import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../state/AppContext";
import { StudyExportImport } from "./StudyExportImport";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  localizeDemoRound,
  localizeDemoStudy,
  localizeScenario,
} from "../../i18n/demoLocalization";
import { demoStudy } from "../../framework/demo";
import { StudyGovernance } from "./StudyGovernance";
import { scenariosAssignedToStudy } from "../../domain/roundAssignments";

export function StudyDetail() {
  const { language, t } = useLanguage();
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { state, deleteStudy } = useApp();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const study = state.studies.find((item) => item.studyId === studyId);
  if (!study)
    return (
      <main>
        <h1>{t("Study not found")}</h1>
      </main>
    );
  const rounds = state.rounds.filter((round) => round.studyId === studyId);
  const studySessions = state.sessions.filter(
    (session) => session.studyId === study.studyId,
  );
  const displayedStudy = localizeDemoStudy(study, language);
  const studyScenarios = scenariosAssignedToStudy(
    state.scenarios,
    state.roundScenarios,
    rounds.map(({ roundId }) => roundId),
  );
  return (
    <main>
      <Link to="/admin">{t("← Studies")}</Link>
      <p className="eyebrow">{t("Administrator mode")}</p>
      <h1>{displayedStudy.title}</h1>
      <p>{displayedStudy.description}</p>
      <p className="notice">
        {t("Instrument version")}: {study.config.instrumentVersion ?? "1.0.0"}
      </p>
      <div className="toolbar">
        <Link className="button" to={`/admin/study/${studyId}/round/new`}>
          {t("New round")}
        </Link>
        <Link
          className="button secondary"
          to={`/admin/study/${studyId}/scenario/new`}
        >
          {t("New scenario")}
        </Link>
        <Link
          className="button secondary"
          to={`/admin/study/${studyId}/changelog/new`}
        >
          {t("Record framework change")}
        </Link>
      </div>
      <section>
        <h2>{t("Rounds")}</h2>
        {rounds.length === 0 ? (
          <p>{t("No rounds yet.")}</p>
        ) : (
          <div className="card-grid">
            {rounds.map((round) => (
              <article className="card" key={round.roundId}>
                <span className="status">{t(round.status)}</span>
                <h3>{localizeDemoRound(round.label, language)}</h3>
                <p>
                  {t("Evaluator group")}: {t(round.evaluatorGroup)}
                </p>
                <Link to={`/admin/study/${studyId}/round/${round.roundId}`}>
                  {t("Open round")}
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
      <StudyExportImport studyId={studyId ?? ""} />
      <StudyGovernance study={study} />
      <section className="delete-panel">
        <h2>{t("Delete study")}</h2>
        {study.studyId === demoStudy.studyId ? (
          <p>
            {t("The demonstration study is protected and cannot be deleted.")}
          </p>
        ) : studySessions.length > 0 ? (
          <p>
            Scientific records are retained. Archive this study instead of
            physically deleting it because evaluations exist.
          </p>
        ) : !deleteOpen ? (
          <button className="danger-link" onClick={() => setDeleteOpen(true)}>
            {t("Delete this study")}
          </button>
        ) : (
          <>
            <p>
              {t(
                "This permanently deletes the study, its rounds, scenario assignments, and evaluations from this browser. Reusable scenarios are retained. Export the study first if you need a backup.",
              )}
            </p>
            <p>
              {rounds.length} {t("round(s)")} · {studySessions.length}{" "}
              {t("evaluation(s)")}
            </p>
            <label>
              {t('Type "DELETE" to confirm')}
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </label>
            <div className="actions">
              <button
                className="danger"
                disabled={confirmation !== "DELETE"}
                onClick={() => {
                  deleteStudy(study.studyId);
                  navigate("/admin");
                }}
              >
                {t("Delete study permanently")}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setDeleteOpen(false);
                  setConfirmation("");
                }}
              >
                {t("Cancel")}
              </button>
            </div>
          </>
        )}
      </section>
      <section>
        <h2>{t("Scenarios")}</h2>
        <ul className="item-list">
          {studyScenarios.map((scenario) => (
            <li key={`${scenario.scenarioId}-${scenario.scenarioVersion}`}>
              <strong>{localizeScenario(scenario, language).title}</strong>
              <span>
                {t("Version")} {scenario.scenarioVersion} ·{" "}
                {t(
                  scenario.scenarioClass === "reference"
                    ? "Reference scenario"
                    : scenario.scenarioClass === "research-extension"
                      ? "Research-extension scenario"
                      : "User scenario",
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
