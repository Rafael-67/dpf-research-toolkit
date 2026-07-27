import type { EvaluationSession, ScientificSessionStatus } from "./types";

const transitions: Record<ScientificSessionStatus, ScientificSessionStatus[]> =
  {
    draft: ["in_progress"],
    in_progress: ["in_review", "completed", "abandoned"],
    in_review: ["in_progress", "completed"],
    completed: ["locked", "excluded"],
    locked: ["excluded"],
    abandoned: ["excluded"],
    excluded: [],
  };

export function normalizeScientificStatus(
  value: EvaluationSession["evaluationStatus"],
): ScientificSessionStatus {
  const mapping: Record<
    EvaluationSession["evaluationStatus"],
    ScientificSessionStatus
  > = {
    not_started: "draft",
    in_progress: "in_progress",
    in_review: "in_review",
    completed: "completed",
    abandoned: "abandoned",
    submitted: "completed",
    returned_for_revision: "in_progress",
    resubmitted: "completed",
    locked: "locked",
    included_in_analysis: "completed",
    excluded_from_analysis: "excluded",
  };
  return mapping[value];
}

export function canTransition(
  from: ScientificSessionStatus,
  to: ScientificSessionStatus,
): boolean {
  return transitions[from].includes(to);
}

export function scientificSnapshot(session: EvaluationSession) {
  return {
    scenarioId: session.scenarioId,
    scenarioVersion: session.scenarioVersion,
    scenarioClass: session.scenarioClass,
    coreVersion: session.coreVersion,
    schemaVersion: session.schemaVersion,
    taxonomyVersion: session.taxonomyVersion,
    instrumentVersion: session.instrumentVersion,
    fieldDefinitionVersions: session.fieldDefinitionVersions,
    taxonomyItemIds: Object.values(session.taxonomyItemRatings ?? {})
      .flat()
      .map((rating) =>
        "taxonomyItemValue" in rating
          ? rating.taxonomyItemValue
          : rating.categoryId,
      ),
    documentSnapshots: session.documentSnapshots ?? [],
  };
}

export function assertScientificSnapshotUnchanged(
  before: EvaluationSession,
  after: EvaluationSession,
): void {
  if (
    before.startedAt &&
    JSON.stringify(scientificSnapshot(before)) !==
      JSON.stringify(scientificSnapshot(after))
  )
    throw new Error(
      "A started evaluation cannot change its scientific version snapshot.",
    );
}
