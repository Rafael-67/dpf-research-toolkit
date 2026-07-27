import type {
  AuditEvent,
  ConsensusRecord,
  EvaluatorAssignment,
  EvaluationSession,
  FieldId,
  FrameworkChangeLogEntry,
  Round,
  Scenario,
  Study,
  UserProfile,
} from "../domain/types";

export interface ComparabilityRecord {
  leftRoundId: string;
  rightRoundId: string;
  fieldId: FieldId;
  comparable: boolean;
  reasons: string[];
}

export interface MergedDataset {
  studies: Study[];
  rounds: Round[];
  scenarios: Scenario[];
  sessions: EvaluationSession[];
  changelog: FrameworkChangeLogEntry[];
  comparabilityMatrix: ComparabilityRecord[];
  importSources?: ImportSource[];
  sessionProvenance?: SessionProvenance[];
  mergeLog?: MergeLogEntry[];
  profiles?: UserProfile[];
  assignments?: EvaluatorAssignment[];
  consensusRecords?: ConsensusRecord[];
  auditEvents?: AuditEvent[];
}

export interface ImportSource {
  importId: string;
  importedAt: string;
}
export interface SessionProvenance {
  recordId: string;
  importId: string;
  mergedSessionIndex: number;
  originalSessionId: string;
}
export interface MergeLogEntry {
  eventId: string;
  eventType: "import" | "duplicate-session-id";
  importId: string;
  sessionId?: string;
  message: string;
}

export interface MergeResult {
  dataset: MergedDataset;
  warnings: string[];
  possibleDuplicateAttempts: Array<{
    evaluatorPseudonym: string;
    roundId: string;
    scenarioId: string;
    sessionIds: string[];
  }>;
}

const fieldIds: FieldId[] = ["F1", "F2", "F3", "F4", "F5", "F6"];

export function compareVersions(left: string, right: string): number {
  const parse = (value: string) => {
    const [numeric, suffix] = value.split("-", 2);
    return {
      parts: numeric.split(".").map((part) => Number(part) || 0),
      suffix,
    };
  };
  const a = parse(left);
  const b = parse(right);
  const length = Math.max(a.parts.length, b.parts.length);
  for (let index = 0; index < length; index += 1) {
    const difference = (a.parts[index] ?? 0) - (b.parts[index] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  if (a.suffix === b.suffix) return 0;
  if (a.suffix && !b.suffix) return -1;
  if (!a.suffix && b.suffix) return 1;
  return String(a.suffix).localeCompare(String(b.suffix));
}

function uniqueBy<T>(values: T[], getId: (value: T) => string): T[] {
  const map = new Map<string, T>();
  values.forEach((value) => map.set(getId(value), value));
  return [...map.values()];
}

export function mergeDatasets(inputs: MergedDataset[]): MergeResult {
  const warnings: string[] = [];
  const importSources: ImportSource[] = [];
  const sessionProvenance: SessionProvenance[] = [];
  const mergeLog: MergeLogEntry[] = [];
  const seenSessionIds = new Map<string, string>();
  const sessions: EvaluationSession[] = [];
  inputs.forEach((input, inputIndex) => {
    const importId =
      input.importSources?.[0]?.importId ?? `legacy-import-${inputIndex + 1}`;
    const importedAt =
      input.importSources?.[0]?.importedAt ?? new Date(0).toISOString();
    importSources.push({ importId, importedAt });
    mergeLog.push({
      eventId: `${importId}:import`,
      eventType: "import",
      importId,
      message: `Imported ${input.sessions.length} session record(s).`,
    });
    input.sessions.forEach((session, sessionIndex) => {
      const mergedSessionIndex = sessions.length;
      sessions.push(session);
      sessionProvenance.push({
        recordId: `${importId}:${sessionIndex}`,
        importId,
        mergedSessionIndex,
        originalSessionId: session.sessionId,
      });
      const previousImportId = seenSessionIds.get(session.sessionId);
      if (previousImportId) {
        const message = `Duplicate sessionId ${session.sessionId}: records from ${previousImportId} and ${importId} retained separately.`;
        warnings.push(message);
        mergeLog.push({
          eventId: `${importId}:duplicate:${sessionIndex}`,
          eventType: "duplicate-session-id",
          importId,
          sessionId: session.sessionId,
          message,
        });
      } else seenSessionIds.set(session.sessionId, importId);
    });
  });
  const attempts = new Map<string, string[]>();
  sessions.forEach((session) => {
    const key = `${session.evaluatorPseudonym}\u0000${session.roundId}\u0000${session.scenarioId}`;
    attempts.set(key, [...(attempts.get(key) ?? []), session.sessionId]);
  });
  const possibleDuplicateAttempts = [...attempts.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, sessionIds]) => {
      const [evaluatorPseudonym, roundId, scenarioId] = key.split("\u0000");
      return { evaluatorPseudonym, roundId, scenarioId, sessionIds };
    });

  const changelog = uniqueBy(
    inputs.flatMap((input) => input.changelog),
    (entry) => entry.entryId,
  );
  const rounds = uniqueBy(
    inputs.flatMap((input) => input.rounds),
    (round) => round.roundId,
  );
  const comparabilityMatrix: ComparabilityRecord[] = [];
  for (let leftIndex = 0; leftIndex < rounds.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < rounds.length;
      rightIndex += 1
    ) {
      const leftRound = rounds[leftIndex];
      const rightRound = rounds[rightIndex];
      for (const fieldId of fieldIds) {
        const leftVersions = sessions
          .filter((session) => session.roundId === leftRound.roundId)
          .map((session) => session.fieldDefinitionVersions[fieldId]);
        const rightVersions = sessions
          .filter((session) => session.roundId === rightRound.roundId)
          .map((session) => session.fieldDefinitionVersions[fieldId]);
        const reasons = changelog
          .filter((entry) => entry.fieldId === fieldId && entry.breakingChange)
          .filter((entry) =>
            leftVersions.some((left) =>
              rightVersions.some((right) => {
                const lower = compareVersions(left, right) <= 0 ? left : right;
                const upper = lower === left ? right : left;
                return (
                  compareVersions(entry.newDefinitionVersion, lower) > 0 &&
                  compareVersions(entry.newDefinitionVersion, upper) <= 0
                );
              }),
            ),
          )
          .map(
            (entry) =>
              `${entry.changeType}: ${entry.previousDefinitionVersion} → ${entry.newDefinitionVersion}`,
          );
        const leftInstrumentVersions = new Set(
          sessions
            .filter((session) => session.roundId === leftRound.roundId)
            .map((session) => session.instrumentVersion),
        );
        const rightInstrumentVersions = new Set(
          sessions
            .filter((session) => session.roundId === rightRound.roundId)
            .map((session) => session.instrumentVersion),
        );
        for (const leftVersion of leftInstrumentVersions) {
          for (const rightVersion of rightInstrumentVersions) {
            if (leftVersion !== rightVersion) {
              reasons.push(
                `instrumentVersion mismatch: ${leftVersion} ↔ ${rightVersion}`,
              );
            }
          }
        }
        comparabilityMatrix.push({
          leftRoundId: leftRound.roundId,
          rightRoundId: rightRound.roundId,
          fieldId,
          comparable: reasons.length === 0,
          reasons,
        });
      }
    }
  }

  return {
    dataset: {
      studies: uniqueBy(
        inputs.flatMap((input) => input.studies),
        (study) => study.studyId,
      ),
      rounds,
      scenarios: uniqueBy(
        inputs.flatMap((input) => input.scenarios),
        (scenario) => `${scenario.scenarioId}:${scenario.scenarioVersion}`,
      ),
      sessions,
      changelog,
      comparabilityMatrix,
      importSources,
      sessionProvenance,
      mergeLog,
      profiles: uniqueBy(
        inputs.flatMap((input) => input.profiles ?? []),
        (profile) => profile.profileId,
      ),
      assignments: uniqueBy(
        inputs.flatMap((input) => input.assignments ?? []),
        (assignment) => assignment.assignmentId,
      ),
      consensusRecords: uniqueBy(
        inputs.flatMap((input) => input.consensusRecords ?? []),
        (record) => record.consensusId,
      ),
      auditEvents: uniqueBy(
        inputs.flatMap((input) => input.auditEvents ?? []),
        (event) => event.auditEventId,
      ),
    },
    warnings,
    possibleDuplicateAttempts,
  };
}

const csvColumns = [
  "sessionId",
  "roundId",
  "scenarioId",
  "scenarioClass",
  "referenceSet",
  "studyAlignment",
  "evaluatorPseudonym",
  "fieldId",
  "narrativeAnswer",
  "categoricalAnswer",
  "confidenceRating",
  "relevance",
  "clarity",
  "exhaustiveness",
  "redundancy",
  "applicability",
  "interpretationDifficulty",
  "insufficientInformation",
  "timeSpentSeconds",
  "revisionCount",
  "helpAccessedCount",
] as const;

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export function mergedDatasetCsv(dataset: MergedDataset): string {
  const rows = dataset.sessions.flatMap((session) =>
    session.fieldResponses.map((response) => ({
      sessionId: session.sessionId,
      roundId: session.roundId,
      scenarioId: session.scenarioId,
      scenarioClass: session.scenarioClass,
      referenceSet: session.referenceSet,
      studyAlignment: session.studyAlignment,
      evaluatorPseudonym: session.evaluatorPseudonym,
      ...response,
    })),
  );
  return [
    csvColumns.join(","),
    ...rows.map((row) =>
      csvColumns.map((column) => csvCell(row[column])).join(","),
    ),
  ].join("\r\n");
}

export function observationCsv(dataset: MergedDataset): string {
  const columns = [
    "sessionId",
    "roundId",
    "scenarioId",
    "fieldId",
    "observationIndex",
    "responseMode",
    "structuredItemSetVersion",
    "observationId",
    "category",
    "categoryOtherText",
    "taskPhasesJson",
    "analyticalRelevance",
    "evidenceStrength",
    "expectedInfluenceOnDeliveredProtection",
    "evidenceSourcesJson",
    "evaluatorCertainty",
    "consensusPriority",
    "reasoningSummary",
    "extendedComments",
    "createdAt",
    "extensionJson",
    "overallSynthesis",
  ];
  const baseKeys = new Set([
    "observationId",
    "fieldId",
    "category",
    "taskPhases",
    "evidenceSources",
    "ratings",
    "reasoningSummary",
    "extendedComments",
    "createdAt",
  ]);
  const rows = dataset.sessions.flatMap((session) =>
    session.fieldResponses.flatMap((response) =>
      (response.observations ?? []).map((observation, index) => {
        const isStructured = "observationId" in observation;
        const extension = Object.fromEntries(
          Object.entries(observation).filter(([key]) => !baseKeys.has(key)),
        );
        return {
          sessionId: session.sessionId,
          roundId: session.roundId,
          scenarioId: session.scenarioId,
          fieldId: response.fieldId,
          observationIndex: index + 1,
          responseMode: response.responseMode,
          structuredItemSetVersion: session.structuredItemSetVersion,
          observationId: isStructured
            ? observation.observationId
            : observation.id,
          category: isStructured
            ? observation.category.value
            : observation.category,
          categoryOtherText: isStructured
            ? observation.category.otherText
            : observation.otherCategoryText,
          taskPhasesJson: JSON.stringify(observation.taskPhases),
          analyticalRelevance: isStructured
            ? observation.ratings.analyticalRelevance
            : observation.analyticalRelevance,
          evidenceStrength: isStructured
            ? observation.ratings.evidenceStrength
            : "",
          expectedInfluenceOnDeliveredProtection: isStructured
            ? observation.ratings.expectedInfluenceOnDeliveredProtection
            : "",
          evidenceSourcesJson: JSON.stringify(observation.evidenceSources),
          evaluatorCertainty: isStructured
            ? observation.ratings.evaluatorCertainty
            : observation.evaluatorCertainty,
          consensusPriority: isStructured
            ? observation.ratings.consensusPriority
            : "",
          reasoningSummary: isStructured
            ? observation.reasoningSummary
            : observation.rationale,
          extendedComments: isStructured ? observation.extendedComments : "",
          createdAt: observation.createdAt,
          extensionJson: JSON.stringify(extension),
          overallSynthesis: response.overallSynthesis,
        };
      }),
    ),
  );
  return [
    columns.join(","),
    ...rows.map((row) =>
      columns
        .map((column) => csvCell(row[column as keyof typeof row]))
        .join(","),
    ),
  ].join("\r\n");
}

function collectSelections(
  value: unknown,
  prefix = "",
): Array<{
  group: string;
  index: number;
  value: string;
  otherText?: string;
}> {
  if (!value || typeof value !== "object") return [];
  const rows: Array<{
    group: string;
    index: number;
    value: string;
    otherText?: string;
  }> = [];
  Object.entries(value).forEach(([key, item]) => {
    const group = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(item))
      item.forEach((entry, index) => {
        if (
          entry &&
          typeof entry === "object" &&
          "value" in entry &&
          typeof entry.value === "string"
        )
          rows.push({
            group,
            index: index + 1,
            value: entry.value,
            otherText:
              "otherText" in entry && typeof entry.otherText === "string"
                ? entry.otherText
                : undefined,
          });
      });
    else if (
      item &&
      typeof item === "object" &&
      "value" in item &&
      typeof item.value === "string"
    )
      rows.push({
        group,
        index: 1,
        value: item.value,
        otherText:
          "otherText" in item && typeof item.otherText === "string"
            ? item.otherText
            : undefined,
      });
  });
  return rows;
}

export function observationSelectionsCsv(dataset: MergedDataset): string {
  const columns = [
    "sessionId",
    "roundId",
    "scenarioId",
    "fieldId",
    "observationId",
    "selectionGroup",
    "selectionIndex",
    "value",
    "otherText",
    "structuredItemSetVersion",
  ];
  const rows = dataset.sessions.flatMap((session) =>
    session.fieldResponses.flatMap((response) =>
      (response.observations ?? []).flatMap((observation) => {
        const observationId =
          "observationId" in observation
            ? observation.observationId
            : observation.id;
        return collectSelections(observation).map((selection) => ({
          sessionId: session.sessionId,
          roundId: session.roundId,
          scenarioId: session.scenarioId,
          fieldId: response.fieldId,
          observationId,
          selectionGroup: selection.group,
          selectionIndex: selection.index,
          value: selection.value,
          otherText: selection.otherText,
          structuredItemSetVersion: session.structuredItemSetVersion,
        }));
      }),
    ),
  );
  return [
    columns.join(","),
    ...rows.map((row) =>
      columns
        .map((column) => csvCell(row[column as keyof typeof row]))
        .join(","),
    ),
  ].join("\r\n");
}

export function taxonomyRatingsCsv(dataset: MergedDataset): string {
  const columns = [
    "sessionId",
    "roundId",
    "scenarioId",
    "recordType",
    "fieldId",
    "taxonomyGroup",
    "taxonomyItemValue",
    "relevance",
    "clarity",
    "distinctiveness",
    "expectedFrequencyOfUse",
    "missingContext",
    "suggestedReplacement",
    "comment",
    "structuredItemSetVersion",
    "proposedValue",
    "firstItemValue",
    "secondItemValue",
    "rationale",
  ];
  const rows: Array<Record<string, unknown>> = dataset.sessions.flatMap(
    (session) => [
      ...Object.values(session.taxonomyItemRatings ?? {})
        .flat()
        .map((value) => ({
          sessionId: session.sessionId,
          roundId: session.roundId,
          scenarioId: session.scenarioId,
          recordType: "item_rating",
          fieldId: value.fieldId,
          taxonomyGroup:
            "taxonomyGroup" in value ? value.taxonomyGroup : "primary_category",
          taxonomyItemValue:
            "taxonomyItemValue" in value
              ? value.taxonomyItemValue
              : value.categoryId,
          relevance: "relevance" in value ? value.relevance : value.rating,
          clarity: "clarity" in value ? value.clarity : "",
          distinctiveness:
            "distinctiveness" in value ? value.distinctiveness : "",
          expectedFrequencyOfUse:
            "expectedFrequencyOfUse" in value
              ? value.expectedFrequencyOfUse
              : "",
          missingContext: "missingContext" in value ? value.missingContext : "",
          suggestedReplacement:
            "suggestedReplacement" in value ? value.suggestedReplacement : "",
          comment: "comment" in value ? value.comment : "",
          structuredItemSetVersion: session.structuredItemSetVersion,
        })),
      ...(session.taxonomyReview?.missingItems ?? []).map((value) => ({
        sessionId: session.sessionId,
        roundId: session.roundId,
        scenarioId: session.scenarioId,
        recordType: "missing_item",
        fieldId: value.fieldId,
        taxonomyGroup: value.taxonomyGroup,
        proposedValue: value.proposedValue,
        rationale: value.rationale,
        structuredItemSetVersion: session.structuredItemSetVersion,
      })),
      ...(session.taxonomyReview?.redundantItems ?? []).map((value) => ({
        sessionId: session.sessionId,
        roundId: session.roundId,
        scenarioId: session.scenarioId,
        recordType: "redundancy",
        fieldId: value.fieldId,
        taxonomyGroup: value.taxonomyGroup,
        firstItemValue: value.firstItemValue,
        secondItemValue: value.secondItemValue,
        rationale: value.rationale,
        structuredItemSetVersion: session.structuredItemSetVersion,
      })),
    ],
  );
  return [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => csvCell(row[column])).join(","),
    ),
  ].join("\r\n");
}
