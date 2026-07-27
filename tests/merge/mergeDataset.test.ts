import { describe, expect, it } from "vitest";
import type {
  EvaluationSession,
  FieldId,
  FrameworkChangeLogEntry,
} from "../../src/domain/types";
import {
  compareVersions,
  mergeDatasets,
  mergedDatasetCsv,
  observationCsv,
  observationSelectionsCsv,
  taxonomyRatingsCsv,
} from "../../src/merge/mergeDataset";

const versions = {
  F1: "1.0",
  F2: "1.0",
  F3: "1.0",
  F4: "1.0",
  F5: "1.0",
  F6: "1.0",
} satisfies Record<FieldId, string>;
function session(
  sessionId: string,
  roundId: string,
  evaluator = "E1",
): EvaluationSession {
  return {
    sessionId,
    evaluatorPseudonym: evaluator,
    studyId: "study",
    roundId,
    scenarioId: "scenario",
    scenarioVersion: "1.0",
    scenarioClass: "reference",
    referenceSet: true,
    studyAlignment: "primary-reference-set",
    instrumentVersion: "1.0",
    frameworkVersion: "0.1.0-draft",
    fieldDefinitionVersions: { ...versions },
    evaluationStatus: "completed",
    metadata: {
      appVersion: "0.1.0",
      userAgent: "test",
      viewportClass: "desktop",
      locale: "en",
    },
    fieldResponses: [
      {
        fieldId: "F1",
        narrativeAnswer: "answer",
        openComment: "",
        changeProposal: "",
        confidenceRating: 4,
        relevance: 4,
        clarity: 4,
        exhaustiveness: 4,
        redundancy: 1,
        applicability: 4,
        interpretationDifficulty: 1,
        insufficientInformation: false,
        timeSpentSeconds: 10,
        revisionCount: 1,
        helpAccessedCount: 0,
      },
    ],
    nasaTlx: null,
    sus: null,
    openFeedback: { burden: "", ambiguity: "", usefulness: "" },
    fictionalScenarioConfirmed: true,
    startedAt: "2026-01-01T00:00:00.000Z",
    reviewedAt: "2026-01-01T00:01:00.000Z",
    finishedAt: "2026-01-01T00:02:00.000Z",
    abandonedAt: null,
    resumedAt: null,
  };
}
const base = {
  studies: [],
  rounds: [
    {
      roundId: "r1",
      studyId: "study",
      roundNumber: 1,
      label: "R1",
      frameworkVersion: "0.1",
      status: "locked" as const,
      evaluatorGroup: "panel",
      openedAt: "2026-01-01T00:00:00.000Z",
      lockedAt: "2026-01-01T01:00:00.000Z",
    },
  ],
  scenarios: [],
  changelog: [],
  comparabilityMatrix: [],
};

describe("merge datasets", () => {
  it("uses semantic-like version ordering", () => {
    expect(compareVersions("1.10", "1.2")).toBe(1);
    expect(compareVersions("1.0-draft", "1.0")).toBe(-1);
  });
  it("retains every duplicate session ID with provenance and warns", () => {
    const result = mergeDatasets([
      { ...base, sessions: [session("same", "r1")] },
      { ...base, sessions: [session("same", "r1", "E2")] },
    ]);
    expect(result.dataset.sessions).toHaveLength(2);
    expect(
      result.dataset.sessions.map(
        ({ evaluatorPseudonym }) => evaluatorPseudonym,
      ),
    ).toEqual(["E1", "E2"]);
    expect(result.warnings).toHaveLength(1);
    expect(result.dataset.sessionProvenance).toHaveLength(2);
    expect(
      result.dataset.mergeLog?.some(
        ({ eventType }) => eventType === "duplicate-session-id",
      ),
    ).toBe(true);
  });
  it("surfaces different IDs for the same evaluator/round/scenario", () => {
    const result = mergeDatasets([
      { ...base, sessions: [session("one", "r1"), session("two", "r1")] },
    ]);
    expect(result.possibleDuplicateAttempts[0].sessionIds).toEqual([
      "one",
      "two",
    ]);
  });
  it("marks only the changed field non-comparable", () => {
    const r2 = { ...base.rounds[0], roundId: "r2", roundNumber: 2 };
    const newer = session("two", "r2", "E2");
    newer.fieldDefinitionVersions.F1 = "2.0";
    const entry: FrameworkChangeLogEntry = {
      entryId: "change",
      fieldId: "F1",
      previousDefinitionVersion: "1.0",
      newDefinitionVersion: "2.0",
      previousText: "old",
      newText: "new",
      changeType: "scale",
      rationale: "approved",
      approvedInRound: "r2",
      approvedBy: "TEAM",
      createdAt: "2026-01-02T00:00:00.000Z",
      breakingChange: true,
    };
    const result = mergeDatasets([
      {
        ...base,
        rounds: [base.rounds[0], r2],
        sessions: [session("one", "r1"), newer],
        changelog: [entry],
      },
    ]);
    expect(
      result.dataset.comparabilityMatrix.find(
        (record) => record.fieldId === "F1",
      )?.comparable,
    ).toBe(false);
    expect(
      result.dataset.comparabilityMatrix.find(
        (record) => record.fieldId === "F2",
      )?.comparable,
    ).toBe(true);
  });
  it("keeps different instrument versions non-comparable", () => {
    const r2 = { ...base.rounds[0], roundId: "r2", roundNumber: 2 };
    const newerInstrument = session("two", "r2", "E2");
    newerInstrument.instrumentVersion = "2.0";
    const result = mergeDatasets([
      {
        ...base,
        rounds: [base.rounds[0], r2],
        sessions: [session("one", "r1"), newerInstrument],
      },
    ]);
    expect(
      result.dataset.comparabilityMatrix.every((record) => !record.comparable),
    ).toBe(true);
    expect(result.dataset.comparabilityMatrix[0].reasons[0]).toContain(
      "instrumentVersion mismatch",
    );
  });
  it("exports one CSV row per FieldResponse and escapes quotes", () => {
    const value = session("one", "r1");
    value.fieldResponses[0].narrativeAnswer = 'said "hello"';
    const csv = mergedDatasetCsv({ ...base, sessions: [value] });
    expect(csv.split("\r\n")).toHaveLength(2);
    expect(csv).toContain('"said ""hello"""');
    expect(csv.split("\r\n")[0]).toContain(
      "scenarioClass,referenceSet,studyAlignment",
    );
    expect(csv).toContain('"reference","true","primary-reference-set"');
  });

  it("exports v1.1 observations and taxonomy ratings without flattening loss", () => {
    const value = session("structured", "r1");
    value.instrumentVersion = "1.1.0";
    value.structuredItemSetVersion = "0.1-exploratory";
    value.fieldResponses[0].responseMode = "structured_narrative";
    value.fieldResponses[0].observations = [
      {
        id: "obs",
        fieldId: "F1",
        category: "other",
        isOtherCategory: true,
        otherCategoryText: "new category",
        taskPhases: [{ value: "whole_task" }],
        analyticalRelevance: "high",
        evidenceSources: [{ value: "evaluator_inference" }],
        evaluatorCertainty: "moderate",
        rationale: "Reason",
        createdAt: "2026-01-01T00:00:00.000Z",
        subPhaseName: "phase",
      },
    ];
    value.taxonomyItemRatings = {
      F1: [
        {
          fieldId: "F1",
          categoryId: "other",
          rating: 4,
          otherCategoryText: "new category",
        },
      ],
    };
    expect(observationCsv({ ...base, sessions: [value] })).toContain(
      '""subPhaseName"":""phase""',
    );
    expect(taxonomyRatingsCsv({ ...base, sessions: [value] })).toContain(
      '"other","4"',
    );
  });

  it("exports schema 1.2 observations and selections as separate normalised rows", () => {
    const value = session("structured-quantitative", "r1");
    value.instrumentVersion = "1.1.0";
    value.dataSchemaVersion = "1.2";
    value.structuredItemSetVersion = "0.1-exploratory";
    value.fieldResponses[0].responseMode = "structured_narrative";
    value.fieldResponses[0].observations = [
      {
        observationId: "obs-1",
        fieldId: "F1",
        category: { value: "other", otherText: "candidate task" },
        taskPhases: [{ value: "whole_task" }],
        evidenceSources: [{ value: "direct_observation" }],
        ratings: {
          analyticalRelevance: 4,
          evidenceStrength: 5,
          expectedInfluenceOnDeliveredProtection: 3,
          evaluatorCertainty: 4,
          consensusPriority: 2,
        },
        reasoningSummary:
          "Direct observation links the selected task structure to the field.",
        createdAt: "2026-01-01T00:00:00.000Z",
        taskFamily: { value: "preparation" },
        taskOperations: [{ value: "inspect" }, { value: "label" }],
        workMode: { value: "manual" },
        systemOpenness: { value: "intermittently_open" },
        materialPhysicalState: [{ value: "liquid" }],
        vesselOrDevice: [{ value: "microcentrifuge_tube" }],
      },
    ];
    value.taxonomyItemRatings = {
      F1: [
        {
          fieldId: "F1",
          taxonomyGroup: "taskFamily",
          taxonomyItemValue: "preparation",
          relevance: 5,
          clarity: 4,
          distinctiveness: 3,
        },
      ],
    };
    const dataset = { ...base, sessions: [value] };
    expect(observationCsv(dataset)).toContain(
      '"obs-1","other","candidate task"',
    );
    const selections = observationSelectionsCsv(dataset);
    expect(selections).toContain('"taskOperations","2","label"');
    expect(selections).toContain('"evidenceSources","1","direct_observation"');
    expect(taxonomyRatingsCsv(dataset)).toContain(
      '"taskFamily","preparation","5","4","3"',
    );
  });
});
