import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../state/AppContext";
import { SessionExport } from "./SessionExport";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  localizeDemoRound,
  localizeScenario,
} from "../../i18n/demoLocalization";
import { isSubmittedEvaluation } from "../../domain/sessionLifecycle";
import { isSimulatedEvaluation } from "../../framework/simulatedEvaluations";

export function PseudonymEntry() {
  const { language, t } = useLanguage();
  const [pseudonym, setPseudonym] = useState(
    localStorage.getItem("dpft:currentEvaluatorPseudonym") ?? "",
  );
  const navigate = useNavigate();
  const { state } = useApp();
  const evaluatorProfile = state.profiles.find(
    (profile) =>
      profile.pseudonym === pseudonym && profile.role === "evaluator",
  );
  const roundProgress = state.rounds.map((round) => {
    const assigned = state.roundScenarios.filter(
      ({ roundId }) => roundId === round.roundId,
    );
    const completed = assigned.filter((assignment) =>
      state.sessions.some(
        (session) =>
          session.roundId === round.roundId &&
          session.scenarioId === assignment.scenarioId &&
          session.evaluatorPseudonym === pseudonym &&
          isSubmittedEvaluation(session.evaluationStatus) &&
          !isSimulatedEvaluation(session.sessionId),
      ),
    ).length;
    return { round, completed, total: assigned.length };
  });
  return (
    <main>
      <p className="eyebrow">{t("Evaluator mode")}</p>
      <h1>{t("Evaluation queue")}</h1>
      <p>
        {t(
          "Use a study-issued pseudonym. Do not enter your real name or institutional identifier.",
        )}
      </p>
      <form
        className="inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          localStorage.setItem("dpft:currentEvaluatorPseudonym", pseudonym);
          navigate("/evaluator");
        }}
      >
        <label>
          {t("Evaluator pseudonym")}
          <input
            required
            value={pseudonym}
            onChange={(e) => setPseudonym(e.target.value)}
          />
        </label>
        <button>{t("Save pseudonym")}</button>
      </form>
      <section>
        <div className="page-heading">
          <div>
            <h2>{t("Cases and fictional demo scenarios")}</h2>
            <p>
              {t(
                "Five fictional examples are loaded automatically for testing. Use Import study to load additional cases from a valid study-config.json.",
              )}
            </p>
          </div>
          <Link className="button secondary" to="/evaluator/import">
            {t("Import study")}
          </Link>
        </div>
        <div className="metric-grid">
          {roundProgress
            .filter(({ total }) => total > 0)
            .map(({ round, completed, total }) => (
              <article className="card" key={round.roundId}>
                <strong>{localizeDemoRound(round.label, language)}</strong>
                <span>
                  {completed} / {total} {t("Completed")}
                </span>
              </article>
            ))}
        </div>
        <div className="card-grid">
          {state.roundScenarios.map((assignment) => {
            const scenario = state.scenarios.find(
              (value) =>
                value.scenarioId === assignment.scenarioId &&
                value.scenarioVersion === assignment.scenarioVersion,
            );
            const round = state.rounds.find(
              (value) => value.roundId === assignment.roundId,
            );
            if (!scenario || !round) return null;
            const functionalAssignments = state.assignments.filter(
              (value) =>
                value.roundId === round.roundId &&
                value.scenarioId === scenario.scenarioId &&
                value.status === "assigned",
            );
            if (
              functionalAssignments.length &&
              !functionalAssignments.some(
                (value) =>
                  value.evaluatorProfileId === evaluatorProfile?.profileId,
              )
            )
              return null;
            const displayedScenario = localizeScenario(scenario, language);
            const inProgress = state.sessions.some(
              (session) =>
                session.roundId === round.roundId &&
                session.scenarioId === scenario.scenarioId &&
                session.evaluatorPseudonym === pseudonym &&
                session.evaluationStatus === "in_progress",
            );
            return (
              <article
                className="card"
                key={`${assignment.roundId}:${assignment.scenarioId}`}
              >
                <span className="status">
                  {t(
                    scenario.scenarioClass === "reference"
                      ? "Reference scenario"
                      : scenario.scenarioClass === "research-extension"
                        ? "Research-extension scenario"
                        : "User scenario",
                  )}
                </span>
                <h3>{displayedScenario.title}</h3>
                <p>{localizeDemoRound(round.label, language)}</p>
                <p>{displayedScenario.taskDescription}</p>
                <Link
                  to={`/evaluator/session/${scenario.scenarioId}?roundId=${encodeURIComponent(round.roundId)}`}
                >
                  {t(inProgress ? "Continue evaluation" : "Start evaluation")}
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      {state.sessions.some(
        (session) =>
          isSubmittedEvaluation(session.evaluationStatus) &&
          !isSimulatedEvaluation(session.sessionId),
      ) && (
        <section>
          <h2>{t("Completed evaluations")}</h2>
          <div className="card-grid">
            {state.sessions
              .filter(
                (session) =>
                  isSubmittedEvaluation(session.evaluationStatus) &&
                  !isSimulatedEvaluation(session.sessionId),
              )
              .map((session) => {
                const scenario = state.scenarios.find(
                  (value) => value.scenarioId === session.scenarioId,
                );
                return (
                  <article className="card" key={session.sessionId}>
                    <h3>
                      {scenario
                        ? localizeScenario(scenario, language).title
                        : session.scenarioId}
                    </h3>
                    <p>
                      {t("Completed")}{" "}
                      {session.finishedAt
                        ? new Date(session.finishedAt).toLocaleString(language)
                        : ""}
                    </p>
                    <SessionExport session={session} />
                  </article>
                );
              })}
          </div>
        </section>
      )}
    </main>
  );
}
