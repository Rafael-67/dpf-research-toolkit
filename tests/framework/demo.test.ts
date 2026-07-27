import { describe, expect, it } from "vitest";
import {
  demoRound,
  demoRoundScenarios,
  demoScenarios,
  demoStudy,
  researchExtensionRound,
  researchExtensionScenarios,
  researchExtensionStudy,
} from "../../src/framework/demo";

describe("fictional demo scenarios", () => {
  it("provides five unique, explicitly fictional examples assigned to the demo round", () => {
    expect(demoScenarios).toHaveLength(5);
    expect(
      new Set(demoScenarios.map(({ scenarioId }) => scenarioId)).size,
    ).toBe(5);
    expect(demoScenarios.every(({ isDemo }) => isDemo)).toBe(true);
    expect(demoStudy.config.instrumentVersion).toBe("1.1.0");
    expect(demoRound.instrumentVersion).toBe("1.1.0");
    expect(demoRoundScenarios).toHaveLength(5);
  });

  it("keeps the two exploratory cases in their own study and round", () => {
    expect(researchExtensionStudy.studyId).toBe("study-exploratory-001");
    expect(researchExtensionRound.studyId).toBe(researchExtensionStudy.studyId);
    expect(
      researchExtensionScenarios.map(({ scenarioId }) => scenarioId),
    ).toEqual(["ORG-01", "INC-01"]);
    expect(
      researchExtensionScenarios.every(({ referenceSet }) => !referenceSet),
    ).toBe(true);
  });
});
