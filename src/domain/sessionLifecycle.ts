import type { EvaluationSession } from "./types";

export function isSubmittedEvaluation(
  status: EvaluationSession["evaluationStatus"],
): boolean {
  return [
    "submitted",
    "resubmitted",
    "locked",
    "included_in_analysis",
    "excluded_from_analysis",
    "completed",
  ].includes(status);
}

export function findResumableSession(
  sessions: EvaluationSession[],
  evaluatorPseudonym: string,
  roundId: string,
  scenarioId: string,
): EvaluationSession | undefined {
  return sessions.find(
    (session) =>
      session.evaluatorPseudonym === evaluatorPseudonym &&
      session.roundId === roundId &&
      session.scenarioId === scenarioId &&
      ["not_started", "in_progress", "returned_for_revision"].includes(
        session.evaluationStatus,
      ),
  );
}

export const ABANDON_AFTER_MS = 24 * 60 * 60 * 1000;

export function abandonStaleSession(
  session: EvaluationSession,
  nowMs = Date.now(),
): EvaluationSession {
  if (
    session.evaluationStatus !== "in_progress" &&
    session.evaluationStatus !== "in_review" &&
    session.evaluationStatus !== "returned_for_revision"
  )
    return session;
  const startedMs = Date.parse(session.startedAt);
  if (!Number.isFinite(startedMs) || nowMs - startedMs <= ABANDON_AFTER_MS)
    return session;
  return {
    ...session,
    evaluationStatus: "abandoned",
    abandonedAt: new Date(nowMs).toISOString(),
  };
}
