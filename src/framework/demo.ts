import type { Round, RoundScenario, Scenario, Study } from "../domain/types";
import demoConfig from "./demo-config.json";
import exploratoryConfig from "../../data/study-config-exploratory.json";

const { studies, rounds, scenarios } = demoConfig.entities;

export const demoStudy = studies[0] as Study;
export const demoRound = rounds[0] as Round;
export const demoScenarios = scenarios.map((scenario) => ({
  ...scenario,
  scenarioClass: "reference" as const,
  referenceSet: true,
  studyAlignment: "primary-reference-set",
})) as Scenario[];

const exploratory = exploratoryConfig.entities;
export const researchExtensionStudy = exploratory.studies[0] as Study;
export const researchExtensionRound = exploratory.rounds[0] as Round;
export const researchExtensionScenarios = exploratory.scenarios as Scenario[];
export const researchExtensionRoundScenarios =
  exploratory.roundScenarios as RoundScenario[];

export const builtInScenarios = demoScenarios;

export const demoRoundScenarios: RoundScenario[] = demoScenarios.map(
  ({ scenarioId, scenarioVersion }) => ({
    roundId: demoRound.roundId,
    scenarioId,
    scenarioVersion,
  }),
);
