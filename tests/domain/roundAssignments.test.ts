import { describe, expect, it } from "vitest";
import {
  scenariosAssignedToRound,
  scenariosAssignedToStudy,
} from "../../src/domain/roundAssignments";
import {
  demoRound,
  demoRoundScenarios,
  demoScenarios,
  researchExtensionRound,
  researchExtensionRoundScenarios,
  researchExtensionScenarios,
} from "../../src/framework/demo";

describe("round and study scenario isolation", () => {
  const scenarios = [...demoScenarios, ...researchExtensionScenarios];
  const assignments = [
    ...demoRoundScenarios,
    ...researchExtensionRoundScenarios,
  ];

  it("keeps exactly E1-E5 in the primary round", () => {
    expect(
      scenariosAssignedToRound(scenarios, assignments, demoRound.roundId).map(
        ({ scenarioId }) => scenarioId,
      ),
    ).toEqual(["demo-E1", "demo-E2", "demo-E3", "demo-E4", "demo-E5"]);
  });

  it("keeps only ORG-01 and INC-01 in the exploratory round", () => {
    expect(
      scenariosAssignedToRound(
        scenarios,
        assignments,
        researchExtensionRound.roundId,
      ).map(({ scenarioId }) => scenarioId),
    ).toEqual(["ORG-01", "INC-01"]);
  });

  it("does not expose exploratory cases through the primary study", () => {
    expect(
      scenariosAssignedToStudy(scenarios, assignments, [demoRound.roundId]),
    ).toHaveLength(5);
  });
});
