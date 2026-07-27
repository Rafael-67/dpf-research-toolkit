import type {
  EvaluationSession,
  FieldId,
  FieldResponse,
} from "../domain/types";
import { deleteRecord, saveRecord } from "../storage/localStore";

const REGISTRY_KEY = "dpft:simulation:evaluationIds";
const fieldIds: FieldId[] = ["F1", "F2", "F3", "F4", "F5", "F6"];

export function simulatedEvaluationIds(): string[] {
  return JSON.parse(localStorage.getItem(REGISTRY_KEY) ?? "[]") as string[];
}

export function isSimulatedEvaluation(sessionId: string): boolean {
  return simulatedEvaluationIds().includes(sessionId);
}

function response(fieldId: FieldId, evaluator: number): FieldResponse {
  const rating = ((evaluator + fieldIds.indexOf(fieldId)) % 2) + 3;
  return {
    fieldId,
    narrativeAnswer: `SIMULATED response for ${fieldId}; demonstration data only.`,
    openComment: "",
    changeProposal: "",
    confidenceRating: rating,
    relevance: 4,
    clarity: rating,
    exhaustiveness: 3,
    redundancy: 1,
    applicability: 4,
    interpretationDifficulty: 2,
    insufficientInformation: false,
    timeSpentSeconds: 60,
    revisionCount: 0,
    helpAccessedCount: 0,
    responseMode: "structured_narrative",
    observations: [],
  };
}

export function loadSimulatedEvaluations(): number {
  const now = new Date().toISOString();
  const sessions: EvaluationSession[] = [1, 2, 3].map((evaluator) => ({
    sessionId: `SIMULATED-E1-EVAL-${evaluator}`,
    evaluatorPseudonym: `SIM-EVAL-${evaluator}`,
    studyId: "study-demo-aligned",
    roundId: "round-demo-001",
    scenarioId: "demo-E1",
    scenarioVersion: "1.0",
    scenarioClass: "reference",
    referenceSet: true,
    studyAlignment: "primary-reference-set",
    instrumentVersion: "1.1.0",
    frameworkVersion: "0.1.0-draft",
    fieldDefinitionVersions: Object.fromEntries(
      fieldIds.map((fieldId) => [fieldId, "1.0"]),
    ) as Record<FieldId, string>,
    evaluationStatus: "completed",
    metadata: {
      appVersion: "SIMULATED",
      userAgent: "SIMULATED-DATA",
      viewportClass: "desktop",
      locale: "en",
    },
    fieldResponses: fieldIds.map((fieldId) => response(fieldId, evaluator)),
    nasaTlx: null,
    sus: null,
    openFeedback: { burden: "SIMULATED", ambiguity: "", usefulness: "" },
    fictionalScenarioConfirmed: true,
    startedAt: now,
    reviewedAt: now,
    finishedAt: now,
    abandonedAt: null,
    resumedAt: null,
    dataSchemaVersion: "1.2",
    structuredItemSetVersion: "0.1-exploratory",
    scientificStatus: "completed",
    completedAt: now,
  }));
  sessions.forEach((session) =>
    saveRecord("evaluation", session.sessionId, session),
  );
  localStorage.setItem(
    REGISTRY_KEY,
    JSON.stringify(sessions.map(({ sessionId }) => sessionId)),
  );
  return sessions.length;
}

export function deleteSimulatedEvaluations(): number {
  const ids = simulatedEvaluationIds();
  ids.forEach((id) => deleteRecord("evaluation", id));
  localStorage.removeItem(REGISTRY_KEY);
  return ids.length;
}
