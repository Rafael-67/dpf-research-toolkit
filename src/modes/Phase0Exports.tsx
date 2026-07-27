import { summarizeDashboard } from "../dashboard/scientificDashboard";
import { downloadJson, makeEnvelope } from "../storage/exportImport";
import { useApp } from "../state/AppContext";
import { useLanguage } from "../i18n/LanguageContext";
import { isSimulatedEvaluation } from "../framework/simulatedEvaluations";

export function Phase0Exports() {
  const { state } = useApp();
  const { language } = useLanguage();
  const scientificSessions = state.sessions.filter(
    ({ sessionId }) => !isSimulatedEvaluation(sessionId),
  );
  const tr = (en: string, es: string) => (language === "es" ? es : en);
  const exports = [
    ["studies", state.studies],
    [
      "study-configuration",
      {
        studies: state.studies,
        rounds: state.rounds,
        roundScenarios: state.roundScenarios,
      },
    ],
    ["institutions", state.institutions],
    ["evaluators", state.profiles],
    ["scenarios", state.scenarios],
    ["evaluation-sessions", scientificSessions],
    [
      "field-responses",
      scientificSessions.flatMap((session) =>
        session.fieldResponses.map((response) => ({
          sessionId: session.sessionId,
          studyId: session.studyId,
          scenarioId: session.scenarioId,
          fieldId: response.fieldId,
          response,
        })),
      ),
    ],
    [
      "taxonomy-ratings",
      scientificSessions.flatMap((session) =>
        Object.values(session.taxonomyItemRatings ?? {}).flat(),
      ),
    ],
    ["documents", state.documents],
    ["document-links", state.documentLinks],
    ["issues", state.issues],
    ["issue-history", state.issueHistory],
    ["dashboard-summary", summarizeDashboard(scientificSessions)],
  ] as const;
  return (
    <section>
      <h2>
        {tr("Phase 0 separate exports", "Exportaciones separadas de la Fase 0")}
      </h2>
      <div className="toolbar wrap">
        {exports.map(([type, entities]) => (
          <button
            key={type}
            onClick={() =>
              downloadJson(`dpf-rp-${type}.json`, makeEnvelope(type, entities))
            }
          >
            {tr("Export", "Exportar")} {type}
          </button>
        ))}
      </div>
    </section>
  );
}
