import { useState } from "react";
import {
  filterDashboardSessions,
  summarizeDashboard,
} from "../dashboard/scientificDashboard";
import type { ScenarioClass, ScientificSessionStatus } from "../domain/types";
import { useLanguage } from "../i18n/LanguageContext";
import { useApp } from "../state/AppContext";
import { Phase0Exports } from "./Phase0Exports";
import {
  AccessibleBarChart,
  CompletionChart,
} from "../dashboard/AccessibleCharts";

export function ScientificDashboard() {
  const { state } = useApp();
  const { language } = useLanguage();
  const tr = (en: string, es: string) => (language === "es" ? es : en);
  const enumLabel = (value: string) =>
    language === "es"
      ? ({
          reference: "referencia",
          "research-extension": "extensión de investigación",
          user: "usuario",
          draft: "borrador",
          in_progress: "en curso",
          in_review: "en revisión",
          completed: "completada",
          locked: "bloqueada",
          abandoned: "abandonada",
          excluded: "excluida",
        }[value] ?? value)
      : value.replaceAll("_", " ");
  const [scenarioClass, setScenarioClass] =
    useState<ScenarioClass>("reference");
  const [studyId, setStudyId] = useState("");
  const [status, setStatus] = useState<ScientificSessionStatus | "">("");
  const [scenarioId, setScenarioId] = useState("");
  const [evaluatorId, setEvaluatorId] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [scenarioVersion, setScenarioVersion] = useState("");
  const [coreVersion, setCoreVersion] = useState("");
  const [taxonomyVersion, setTaxonomyVersion] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const sessions = filterDashboardSessions(state.sessions, state.scenarios, {
    scenarioClass,
    studyId: studyId || undefined,
    status: status || undefined,
    scenarioId: scenarioId || undefined,
    evaluatorId: evaluatorId || undefined,
    institutionId: institutionId || undefined,
    scenarioVersion: scenarioVersion || undefined,
    coreVersion: coreVersion || undefined,
    taxonomyVersion: taxonomyVersion || undefined,
    from: from || undefined,
    to: to || undefined,
  });
  const summary = summarizeDashboard(sessions);
  const categoryChartData = [...summary.categoryFrequency]
    .sort((left, right) => right[1] - left[1])
    .map(([label, value]) => ({ key: label, label, value }));
  return (
    <main>
      <p className="eyebrow">
        {tr(
          "Descriptive scientific information only",
          "Información científica exclusivamente descriptiva",
        )}
      </p>
      <h1>{tr("Scientific Dashboard", "Panel científico")}</h1>
      <button className="secondary no-print" onClick={() => window.print()}>
        {tr("Print descriptive report", "Imprimir informe descriptivo")}
      </button>
      <p className="notice">
        {tr("Analysed subset", "Subconjunto analizado")}:{" "}
        <strong>{scenarioClass}</strong>.{" "}
        {tr(
          "Scenario classes are never combined by default. Agreement metrics are displayed only when pre-specified in the study analysis plan.",
          "Las clases de casos nunca se combinan de forma predeterminada. Las métricas de concordancia solo se muestran cuando están preespecificadas en el plan de análisis del estudio.",
        )}
      </p>
      <form
        className="filter-grid"
        aria-label={tr(
          "Scientific dashboard filters",
          "Filtros del panel científico",
        )}
      >
        <label>
          {tr("Study", "Estudio")}
          <select value={studyId} onChange={(e) => setStudyId(e.target.value)}>
            <option value="">{tr("All studies", "Todos los estudios")}</option>
            {state.studies.map((v) => (
              <option key={v.studyId} value={v.studyId}>
                {v.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Scenario class", "Clase de caso")}
          <select
            value={scenarioClass}
            onChange={(e) => setScenarioClass(e.target.value as ScenarioClass)}
          >
            {["reference", "research-extension", "user"].map((value) => (
              <option key={value} value={value}>
                {enumLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Scenario", "Caso")}
          <select
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            <option value="">{tr("All scenarios", "Todos los casos")}</option>
            {state.scenarios.map((v) => (
              <option
                key={`${v.scenarioId}:${v.scenarioVersion}`}
                value={v.scenarioId}
              >
                {v.scenarioId} — {v.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Evaluator", "Evaluador")}
          <input
            value={evaluatorId}
            onChange={(e) => setEvaluatorId(e.target.value)}
          />
        </label>
        <label>
          {tr("Institution", "Institución")}
          <select
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
          >
            <option value="">
              {tr("All institutions", "Todas las instituciones")}
            </option>
            {state.institutions.map((v) => (
              <option key={v.institutionId} value={v.institutionId}>
                {v.institutionCode}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Status", "Estado")}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as ScientificSessionStatus | "")
            }
          >
            <option value="">{tr("All statuses", "Todos los estados")}</option>
            {[
              "draft",
              "in_progress",
              "in_review",
              "completed",
              "locked",
              "abandoned",
              "excluded",
            ].map((v) => (
              <option key={v} value={v}>
                {enumLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Scenario version", "Versión del caso")}
          <input
            value={scenarioVersion}
            onChange={(e) => setScenarioVersion(e.target.value)}
          />
        </label>
        <label>
          {tr("Core version", "Versión del núcleo")}
          <input
            value={coreVersion}
            onChange={(e) => setCoreVersion(e.target.value)}
          />
        </label>
        <label>
          {tr("Taxonomy version", "Versión de la taxonomía")}
          <input
            value={taxonomyVersion}
            onChange={(e) => setTaxonomyVersion(e.target.value)}
          />
        </label>
        <label>
          {tr("From", "Desde")}
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          {tr("To", "Hasta")}
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
      </form>
      <div className="metric-grid">
        <article className="card">
          <strong>{summary.evaluators}</strong>
          <span>{tr("Active evaluators", "Evaluadores activos")}</span>
        </article>
        <article className="card">
          <strong>{summary.scenarios}</strong>
          <span>{tr("Evaluated scenarios", "Casos evaluados")}</span>
        </article>
        <article className="card">
          <strong>{summary.completion.toFixed(1)}%</strong>
          <span>{tr("Completeness", "Completitud")}</span>
        </article>
        <article className="card">
          <strong>{summary.incomplete}</strong>
          <span>{tr("Incomplete fields", "Campos incompletos")}</span>
        </article>
        <article className="card">
          <strong>{summary.missing}</strong>
          <span>{tr("Missing responses", "Respuestas ausentes")}</span>
        </article>
        <article className="card">
          <strong>{summary.otherUses}</strong>
          <span>{tr("Other selections", "Selecciones «Otro»")}</span>
        </article>
      </div>
      <section aria-labelledby="dashboard-charts-title">
        <h2 id="dashboard-charts-title">
          {tr("Descriptive charts", "Gráficos descriptivos")}
        </h2>
        <p className="footnote">
          {tr(
            "Charts reflect the current filters and present counts only. They do not infer risk, agreement or scientific significance.",
            "Los gráficos reflejan los filtros actuales y presentan únicamente recuentos. No infieren riesgo, concordancia ni significación científica.",
          )}
        </p>
        <div className="chart-grid">
          <CompletionChart
            title={tr("Response completeness", "Completitud de respuestas")}
            description={tr(
              "Completed or explicitly marked insufficient fields",
              "Campos completados o marcados explícitamente como información insuficiente",
            )}
            value={summary.completion}
          />
          <AccessibleBarChart
            title={tr("Sessions by status", "Sesiones por estado")}
            description={tr(
              "Scientific lifecycle counts",
              "Recuentos del ciclo de vida científico",
            )}
            data={summary.statuses.map(({ status: rowStatus, count }) => ({
              key: rowStatus,
              label: enumLabel(rowStatus),
              value: count,
            }))}
            emptyLabel={tr(
              "No sessions match the current filters.",
              "Ninguna sesión coincide con los filtros actuales.",
            )}
          />
          <AccessibleBarChart
            title={tr(
              "Structured category frequency",
              "Frecuencia de categorías estructuradas",
            )}
            description={tr(
              "Observation counts by field and category",
              "Recuentos de observaciones por campo y categoría",
            )}
            data={categoryChartData}
            emptyLabel={tr(
              "No structured categories match the current filters.",
              "Ninguna categoría estructurada coincide con los filtros actuales.",
            )}
          />
        </div>
      </section>
      <div className="table-scroll">
        <table>
          <caption>
            {tr(
              "Session distribution for the selected subset",
              "Distribución de sesiones del subconjunto seleccionado",
            )}
          </caption>
          <thead>
            <tr>
              <th>{tr("Status", "Estado")}</th>
              <th>{tr("Sessions", "Sesiones")}</th>
            </tr>
          </thead>
          <tbody>
            {summary.statuses.map((row) => (
              <tr key={row.status}>
                <th scope="row">{enumLabel(row.status)}</th>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>{tr("Category frequency", "Frecuencia de categorías")}</h2>
      {summary.categoryFrequency.length ? (
        <div className="table-scroll">
          <table>
            <caption>
              {tr(
                "Structured category use by field",
                "Uso de categorías estructuradas por campo",
              )}
            </caption>
            <thead>
              <tr>
                <th>{tr("Field and category", "Campo y categoría")}</th>
                <th>{tr("Frequency", "Frecuencia")}</th>
              </tr>
            </thead>
            <tbody>
              {summary.categoryFrequency.map(([label, count]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p role="status">
          {tr(
            "No structured observations match this subset. Missing data have not been imputed.",
            "Ninguna observación estructurada coincide con este subconjunto. Los datos ausentes no se han imputado.",
          )}
        </p>
      )}
      <p className="footnote">
        {tr("Last activity", "Última actividad")}:{" "}
        {summary.lastActivity ?? tr("none", "ninguna")}.{" "}
        {tr(
          "This dashboard never modifies or interprets scientific records.",
          "Este panel nunca modifica ni interpreta los registros científicos.",
        )}
      </p>
      <Phase0Exports />
    </main>
  );
}
