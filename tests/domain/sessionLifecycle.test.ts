import { describe, expect, it } from "vitest";
import type { EvaluationSession } from "../../src/domain/types";
import {
  abandonStaleSession,
  findResumableSession,
} from "../../src/domain/sessionLifecycle";

const minimal = (
  sessionId: string,
  evaluationStatus: EvaluationSession["evaluationStatus"],
) =>
  ({
    sessionId,
    evaluatorPseudonym: "E1",
    roundId: "r1",
    scenarioId: "s1",
    evaluationStatus,
  }) as EvaluationSession;

describe("session lifecycle", () => {
  it("never resumes a completed or abandoned scientific record", () => {
    expect(
      findResumableSession(
        [minimal("done", "completed"), minimal("old", "abandoned")],
        "E1",
        "r1",
        "s1",
      ),
    ).toBeUndefined();
  });
  it("resumes only the matching active draft", () => {
    const draft = minimal("draft", "in_progress");
    expect(
      findResumableSession(
        [minimal("done", "completed"), draft],
        "E1",
        "r1",
        "s1",
      )?.sessionId,
    ).toBe("draft");
  });

  it("resumes a session saved at the review stage", () => {
    const review = minimal("review", "in_review");
    expect(findResumableSession([review], "E1", "r1", "s1")).toBe(review);
  });

  it("resumes the newest matching draft when legacy duplicates exist", () => {
    const older = {
      ...minimal("older", "in_progress"),
      fieldResponses: [{ fieldId: "F1", narrativeAnswer: "o" }],
    } as EvaluationSession;
    const newer = {
      ...minimal("newer", "in_progress"),
      fieldResponses: [{ fieldId: "F1", narrativeAnswer: "complete text" }],
    } as EvaluationSession;

    expect(
      findResumableSession([older, newer], "E1", "r1", "s1")?.sessionId,
    ).toBe("newer");
  });
  it("abandons an active session older than 24 hours on load", () => {
    const draft = {
      ...minimal("draft", "in_progress"),
      startedAt: "2026-01-01T00:00:00.000Z",
      abandonedAt: null,
    };
    const migrated = abandonStaleSession(
      draft,
      Date.parse("2026-01-02T00:00:01.000Z"),
    );
    expect(migrated.evaluationStatus).toBe("abandoned");
    expect(migrated.abandonedAt).toBe("2026-01-02T00:00:01.000Z");
  });
});
