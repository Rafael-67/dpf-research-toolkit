import type { EvaluationSession } from "../domain/types";
import { assertScientificSnapshotUnchanged } from "../domain/phase0Lifecycle";

export const PREFIX = "dpft:";

export type EntityKind =
  | "study"
  | "round"
  | "roundScenario"
  | "scenario"
  | "evaluation"
  | "changelog"
  | "workedexample"
  | "profile"
  | "assignment"
  | "consensus"
  | "audit"
  | "institution"
  | "document"
  | "documentLink"
  | "issue"
  | "issueHistory"
  | "schemaMigration";

export class StorageQuotaError extends Error {}

export function saveRecord<T>(kind: EntityKind, id: string, value: T): void {
  const key = `${PREFIX}${kind}:${id}`;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    const indexKey = `${PREFIX}index:${kind}`;
    const ids = new Set<string>(
      JSON.parse(localStorage.getItem(indexKey) ?? "[]") as string[],
    );
    ids.add(id);
    localStorage.setItem(indexKey, JSON.stringify([...ids]));
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      throw new StorageQuotaError(
        "Local storage is full. Export your data, then clear completed sessions.",
      );
    }
    throw error;
  }
}

export function readRecord<T>(kind: EntityKind, id: string): T | null {
  const raw = localStorage.getItem(`${PREFIX}${kind}:${id}`);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function listRecords<T>(kind: EntityKind): T[] {
  const ids = JSON.parse(
    localStorage.getItem(`${PREFIX}index:${kind}`) ?? "[]",
  ) as string[];
  return ids.flatMap((id) => {
    const value = readRecord<T>(kind, id);
    return value ? [value] : [];
  });
}

export function saveEvaluationRecord<
  T extends { sessionId: string; evaluationStatus: string },
>(value: T): void {
  const existing = readRecord<T>("evaluation", value.sessionId);
  if (
    existing &&
    "startedAt" in existing &&
    existing.startedAt &&
    "fieldDefinitionVersions" in existing &&
    "fieldDefinitionVersions" in value
  ) {
    assertScientificSnapshotUnchanged(
      existing as unknown as EvaluationSession,
      value as unknown as EvaluationSession,
    );
  }
  if (
    ["completed", "locked", "included_in_analysis"].includes(
      existing?.evaluationStatus ?? "",
    ) &&
    JSON.stringify(existing) !== JSON.stringify(value)
  ) {
    throw new Error(
      "Completed evaluation records are immutable. Start a new evaluation attempt instead.",
    );
  }
  saveRecord("evaluation", value.sessionId, value);
}

export function deleteRecord(kind: EntityKind, id: string): void {
  localStorage.removeItem(`${PREFIX}${kind}:${id}`);
  const indexKey = `${PREFIX}index:${kind}`;
  const ids = JSON.parse(localStorage.getItem(indexKey) ?? "[]") as string[];
  localStorage.setItem(
    indexKey,
    JSON.stringify(ids.filter((value) => value !== id)),
  );
}

export function deleteAllLocalData(): void {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(PREFIX))
    .forEach((key) => localStorage.removeItem(key));
}

export function deleteStudyRecords(studyId: string): {
  roundsDeleted: number;
  assignmentsDeleted: number;
  evaluationsDeleted: number;
} {
  const rounds = listRecords<{ roundId: string; studyId: string }>(
    "round",
  ).filter((round) => round.studyId === studyId);
  const roundIds = new Set(rounds.map(({ roundId }) => roundId));
  const roundAssignments = listRecords<{
    roundId: string;
    scenarioId: string;
  }>("roundScenario").filter((assignment) => roundIds.has(assignment.roundId));
  const evaluations = listRecords<{
    sessionId: string;
    studyId: string;
  }>("evaluation").filter((evaluation) => evaluation.studyId === studyId);
  const evaluatorAssignments = listRecords<{
    assignmentId: string;
    studyId: string;
  }>("assignment").filter((assignment) => assignment.studyId === studyId);
  const consensusRecords = listRecords<{
    consensusId: string;
    studyId: string;
  }>("consensus").filter((record) => record.studyId === studyId);

  roundAssignments.forEach((assignment) =>
    deleteRecord(
      "roundScenario",
      `${assignment.roundId}:${assignment.scenarioId}`,
    ),
  );
  evaluations.forEach(({ sessionId }) => deleteRecord("evaluation", sessionId));
  evaluatorAssignments.forEach(({ assignmentId }) =>
    deleteRecord("assignment", assignmentId),
  );
  consensusRecords.forEach(({ consensusId }) =>
    deleteRecord("consensus", consensusId),
  );
  rounds.forEach(({ roundId }) => deleteRecord("round", roundId));
  deleteRecord("study", studyId);

  return {
    roundsDeleted: rounds.length,
    assignmentsDeleted: roundAssignments.length,
    evaluationsDeleted: evaluations.length,
  };
}
