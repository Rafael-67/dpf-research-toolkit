import { describe, expect, it } from "vitest";
import {
  filterDashboardSessions,
  summarizeDashboard,
} from "../../src/dashboard/scientificDashboard";
import type { EvaluationSession, Scenario } from "../../src/domain/types";

const session = {
  scenarioId: "E1",
  scenarioVersion: "1.0",
  scenarioClass: "reference",
  evaluatorPseudonym: "EV1",
  evaluationStatus: "completed",
  startedAt: "2026-01-01T00:00:00.000Z",
  fieldResponses: [],
} as unknown as EvaluationSession;
describe("Scientific Dashboard read model", () => {
  it("does not mix scenario classes", () => {
    expect(
      filterDashboardSessions([session], [] as Scenario[], {
        scenarioClass: "user",
      }),
    ).toEqual([]);
  });
  it("reports missing fields without mutation", () => {
    const before = structuredClone(session);
    expect(summarizeDashboard([session]).incomplete).toBe(6);
    expect(session).toEqual(before);
  });
});
