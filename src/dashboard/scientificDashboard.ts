import { normalizeScientificStatus } from "../domain/phase0Lifecycle";
import type {
  EvaluationSession,
  Scenario,
  ScenarioClass,
  ScientificSessionStatus,
} from "../domain/types";

export interface DashboardFilters {
  studyId?: string;
  scenarioId?: string;
  scenarioClass: ScenarioClass;
  evaluatorId?: string;
  institutionId?: string;
  status?: ScientificSessionStatus;
  scenarioVersion?: string;
  coreVersion?: string;
  taxonomyVersion?: string;
  from?: string;
  to?: string;
}

export function filterDashboardSessions(
  sessions: EvaluationSession[],
  scenarios: Scenario[],
  filter: DashboardFilters,
): EvaluationSession[] {
  return sessions.filter((session) => {
    const scenario = scenarios.find(
      (item) =>
        item.scenarioId === session.scenarioId &&
        item.scenarioVersion === session.scenarioVersion,
    );
    const scenarioClass =
      session.scenarioClass ?? scenario?.scenarioClass ?? "user";
    const started = Date.parse(session.startedAt);
    return (
      scenarioClass === filter.scenarioClass &&
      (!filter.studyId || session.studyId === filter.studyId) &&
      (!filter.scenarioId || session.scenarioId === filter.scenarioId) &&
      (!filter.evaluatorId ||
        (session.evaluatorId ?? session.evaluatorPseudonym) ===
          filter.evaluatorId) &&
      (!filter.institutionId ||
        session.institutionId === filter.institutionId) &&
      (!filter.status ||
        (session.scientificStatus ??
          normalizeScientificStatus(session.evaluationStatus)) ===
          filter.status) &&
      (!filter.scenarioVersion ||
        session.scenarioVersion === filter.scenarioVersion) &&
      (!filter.coreVersion || session.coreVersion === filter.coreVersion) &&
      (!filter.taxonomyVersion ||
        session.taxonomyVersion === filter.taxonomyVersion) &&
      (!filter.from || started >= Date.parse(filter.from)) &&
      (!filter.to || started <= Date.parse(`${filter.to}T23:59:59.999Z`))
    );
  });
}

export function summarizeDashboard(sessions: EvaluationSession[]) {
  const statuses: ScientificSessionStatus[] = [
    "draft",
    "in_progress",
    "in_review",
    "completed",
    "locked",
    "abandoned",
    "excluded",
  ];
  const responses = sessions.flatMap((session) => session.fieldResponses);
  const observations = responses.flatMap(
    (response) => response.observations ?? [],
  );
  const categoryFrequency = new Map<string, number>();
  observations.forEach((observation) => {
    const category =
      typeof observation.category === "string"
        ? observation.category
        : observation.category.value;
    categoryFrequency.set(
      `${observation.fieldId}:${category}`,
      (categoryFrequency.get(`${observation.fieldId}:${category}`) ?? 0) + 1,
    );
  });
  const complete = responses.filter(
    (response) =>
      response.insufficientInformation ||
      Boolean(response.narrativeAnswer.trim()),
  ).length;
  return {
    statuses: statuses.map((status) => ({
      status,
      count: sessions.filter(
        (session) =>
          (session.scientificStatus ??
            normalizeScientificStatus(session.evaluationStatus)) === status,
      ).length,
    })),
    evaluators: new Set(
      sessions.map(
        (session) => session.evaluatorId ?? session.evaluatorPseudonym,
      ),
    ).size,
    scenarios: new Set(sessions.map((session) => session.scenarioId)).size,
    missing: responses.filter((response) => response.insufficientInformation)
      .length,
    incomplete: Math.max(0, sessions.length * 6 - complete),
    completion: sessions.length ? (complete / (sessions.length * 6)) * 100 : 0,
    comments: responses.filter(
      (response) => response.openComment || response.changeProposal,
    ).length,
    otherUses: observations.filter((observation) => {
      const value =
        typeof observation.category === "string"
          ? observation.category
          : observation.category.value;
      return value === "other" || value.startsWith("other_");
    }).length,
    categoryFrequency: [...categoryFrequency.entries()],
    lastActivity:
      sessions
        .map(
          (session) =>
            session.completedAt ?? session.finishedAt ?? session.startedAt,
        )
        .sort()
        .at(-1) ?? null,
  };
}
