import { Link } from "react-router-dom";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { localizeDemoStudy } from "../../i18n/demoLocalization";
import { researchExtensionStudy } from "../../framework/demo";
import { SimulatedDataManager } from "../SimulatedDataManager";

export function StudyList() {
  const { language, t } = useLanguage();
  const { state, loadResearchExtension } = useApp();
  const extensionLoaded = state.studies.some(
    ({ studyId }) => studyId === researchExtensionStudy.studyId,
  );
  const referenceCount = state.scenarios.filter(
    ({ scenarioClass, referenceSet }) =>
      scenarioClass === "reference" && referenceSet,
  ).length;
  const extensionCount = state.scenarios.filter(
    ({ scenarioClass }) => scenarioClass === "research-extension",
  ).length;
  return (
    <main>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t("Administrator mode")}</p>
          <h1>{t("Studies")}</h1>
          <p>
            {t("Create studies, rounds, and fictional scenarios for Phase 0.")}
          </p>
        </div>
        <div className="toolbar">
          <Link className="button secondary" to="/admin/import">
            {t("Import studies or cases")}
          </Link>
          <Link className="button secondary" to="/admin/merge">
            {t("Merge evaluations")}
          </Link>
          <Link className="button" to="/admin/study/new">
            {t("New study")}
          </Link>
        </div>
      </div>
      <section
        className="card scenario-set-summary"
        aria-labelledby="sets-title"
      >
        <h2 id="sets-title">
          {language === "es" ? "Conjuntos de escenarios" : "Scenario sets"}
        </h2>
        <p>
          <strong>{language === "es" ? "Referencia" : "Reference"}:</strong>{" "}
          {referenceCount} (E1–E5) ·{" "}
          <strong>
            {language === "es" ? "Exploratorios" : "Exploratory"}:
          </strong>{" "}
          {extensionCount} (ORG-01, INC-01)
        </p>
        <p>
          {language === "es"
            ? "Los casos exploratorios pertenecen a un estudio y una ronda independientes y no se combinan con el análisis primario."
            : "Exploratory cases belong to a separate study and round and are not pooled with the primary analysis."}
        </p>
        {!extensionLoaded && (
          <button type="button" onClick={loadResearchExtension}>
            {language === "es"
              ? "Cargar extensión exploratoria (2 casos)"
              : "Load exploratory extension (2 cases)"}
          </button>
        )}
      </section>
      <SimulatedDataManager />
      <div className="card-grid">
        {state.studies.map((study) => {
          const displayedStudy = localizeDemoStudy(study, language);
          return (
            <article className="card" key={study.studyId}>
              <span className="status">{t(study.status)}</span>
              <h2>{displayedStudy.title}</h2>
              <p>{displayedStudy.description}</p>
              <Link to={`/admin/study/${study.studyId}`}>
                {t("Open study")}
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
