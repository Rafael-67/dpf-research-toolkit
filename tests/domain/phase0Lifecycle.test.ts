import { describe, expect, it } from "vitest";
import {
  assertScientificSnapshotUnchanged,
  canTransition,
  normalizeScientificStatus,
} from "../../src/domain/phase0Lifecycle";
import type { EvaluationSession } from "../../src/domain/types";

describe("Phase 0 scientific lifecycle", () => {
  it("maps legacy states conservatively", () => {
    expect(normalizeScientificStatus("not_started")).toBe("draft");
    expect(normalizeScientificStatus("abandoned")).toBe("abandoned");
  });
  it("allows only declared transitions", () => {
    expect(canTransition("draft", "in_progress")).toBe(true);
    expect(canTransition("completed", "in_progress")).toBe(false);
    expect(canTransition("abandoned", "excluded")).toBe(true);
  });
  it("protects started scientific snapshots", () => {
    const session = {
      startedAt: "2026-01-01T00:00:00.000Z",
      scenarioId: "E1",
      scenarioVersion: "1.0",
      fieldDefinitionVersions: {},
    } as unknown as EvaluationSession;
    expect(() =>
      assertScientificSnapshotUnchanged(session, {
        ...session,
        scenarioVersion: "2.0",
      }),
    ).toThrow(/scientific version snapshot/);
  });
});
