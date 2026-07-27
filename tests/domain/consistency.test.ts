import { describe, expect, it } from "vitest";
import { checkObservationConsistency } from "../../src/domain/consistency";
import type { F1Observation } from "../../src/domain/types";

describe("non-decisional consistency checks", () => {
  it("uses only the neutral review message", () => {
    const observation = {
      observationId: "o1",
      fieldId: "F1",
      category: { value: "not_applicable" },
      taskPhases: [{ value: "whole_task" }],
      evidenceSources: [],
      ratings: {
        analyticalRelevance: 3,
        evidenceStrength: 3,
        expectedInfluenceOnDeliveredProtection: 3,
        evaluatorCertainty: 3,
      },
      reasoningSummary: "",
      createdAt: "2026-01-01T00:00:00.000Z",
      taskFamily: { value: "preparation" },
      taskOperations: [{ value: "inspect" }],
      workMode: { value: "manual" },
      systemOpenness: { value: "not_determinable" },
      materialPhysicalState: [{ value: "liquid" }],
      vesselOrDevice: [{ value: "microcentrifuge_tube" }],
    } satisfies F1Observation;
    const findings = checkObservationConsistency(observation);
    expect(findings.length).toBeGreaterThan(1);
    expect(
      findings.every(
        ({ message }) => message === "Please review this combination.",
      ),
    ).toBe(true);
  });
});
