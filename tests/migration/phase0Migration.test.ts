import { describe, expect, it } from "vitest";
import { simulateSessionMigration } from "../../src/migration/phase0Migration";
import type { EvaluationSession } from "../../src/domain/types";

const legacy = {
  sessionId: "S1",
  studyId: "ST1",
  evaluatorPseudonym: "EV1",
  evaluationStatus: "abandoned",
  metadata: { institutionCode: "SITE-A" },
  finishedAt: null,
} as unknown as EvaluationSession;
describe("Phase 0 migration simulation", () => {
  it("preserves original data and abandoned status", () => {
    const result = simulateSessionMigration(legacy);
    expect(result.migrated.scientificStatus).toBe("abandoned");
    expect(result.migrated._migration.original).toEqual(legacy);
    expect(legacy).not.toHaveProperty("schemaVersion");
  });
  it("is idempotent", () => {
    const first = simulateSessionMigration(legacy).migrated;
    expect(simulateSessionMigration(first).migrated).toEqual(first);
  });
});
