import type { RoundScenario, Scenario } from "./types";

export function scenariosAssignedToRound(
  scenarios: Scenario[],
  assignments: RoundScenario[],
  roundId: string,
): Scenario[] {
  const assignedVersions = new Set(
    assignments
      .filter((assignment) => assignment.roundId === roundId)
      .map(
        ({ scenarioId, scenarioVersion }) => `${scenarioId}:${scenarioVersion}`,
      ),
  );
  return scenarios.filter((scenario) =>
    assignedVersions.has(`${scenario.scenarioId}:${scenario.scenarioVersion}`),
  );
}

export function scenariosAssignedToStudy(
  scenarios: Scenario[],
  assignments: RoundScenario[],
  studyRoundIds: string[],
): Scenario[] {
  const roundIds = new Set(studyRoundIds);
  const assignedVersions = new Set(
    assignments
      .filter((assignment) => roundIds.has(assignment.roundId))
      .map(
        ({ scenarioId, scenarioVersion }) => `${scenarioId}:${scenarioVersion}`,
      ),
  );
  return scenarios.filter((scenario) =>
    assignedVersions.has(`${scenario.scenarioId}:${scenario.scenarioVersion}`),
  );
}
