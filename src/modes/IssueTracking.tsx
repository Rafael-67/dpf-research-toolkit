import { useMemo, useState } from "react";
import { createIssueHistory, transitionIssue } from "../domain/reviewServices";
import type { IssueStatus, IssueType, ReviewIssue } from "../domain/types";
import { saveRecord } from "../storage/localStore";
import { useApp } from "../state/AppContext";
import { useLanguage } from "../i18n/LanguageContext";

const types: IssueType[] = [
  "scenario-clarification",
  "taxonomy-question",
  "field-ambiguity",
  "supporting-document",
  "methodological-note",
  "data-quality",
  "technical-problem",
  "change-request",
  "other",
];
export function IssueTracking() {
  const { state, dispatch } = useApp();
  const { language } = useLanguage();
  const tr = (en: string, es: string) => (language === "es" ? es : en);
  const enumLabel = (value: string) =>
    language === "es"
      ? ({
          "scenario-clarification": "aclaración del caso",
          "taxonomy-question": "pregunta taxonómica",
          "field-ambiguity": "ambigüedad del campo",
          "supporting-document": "documento de apoyo",
          "methodological-note": "nota metodológica",
          "data-quality": "calidad de datos",
          "technical-problem": "problema técnico",
          "change-request": "solicitud de cambio",
          other: "otro",
          low: "baja",
          normal: "normal",
          high: "alta",
          open: "abierta",
          under_review: "en revisión",
          resolved: "resuelta",
          rejected: "rechazada",
          deferred: "aplazada",
          closed: "cerrada",
        }[value] ?? value)
      : value.replaceAll("_", " ");
  const [description, setDescription] = useState("");
  const [issueType, setIssueType] = useState<IssueType>("methodological-note");
  const [query, setQuery] = useState("");
  const [studyId, setStudyId] = useState(state.studies[0]?.studyId ?? "");
  const [scenarioId, setScenarioId] = useState("");
  const [priority, setPriority] = useState<ReviewIssue["priority"]>("normal");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const visible = useMemo(
    () =>
      state.issues.filter(
        (v) =>
          (statusFilter === "all" || v.status === statusFilter) &&
          v.description.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, state.issues, statusFilter],
  );
  const update = (issue: ReviewIssue, status: IssueStatus) => {
    const result = transitionIssue(
      issue,
      status,
      "local-reviewer",
      status === "resolved"
        ? tr(
            "Resolved after explicit human review.",
            "Resuelta tras revisión humana explícita.",
          )
        : null,
    );
    saveRecord("issue", result.issue.issueId, result.issue);
    saveRecord("issueHistory", result.history.historyId, result.history);
    dispatch({ type: "issue", value: result.issue });
    dispatch({ type: "issueHistory", value: result.history });
  };
  return (
    <main>
      <p className="eyebrow">
        {tr("Independent review layer", "Capa de revisión independiente")}
      </p>
      <h1>{tr("Issues", "Incidencias")}</h1>
      <p className="notice">
        {tr(
          "Issues never modify evaluations, responses, taxonomy ratings or document snapshots.",
          "Las incidencias nunca modifican evaluaciones, respuestas, valoraciones taxonómicas ni instantáneas documentales.",
        )}
      </p>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const value: ReviewIssue = {
            issueId: crypto.randomUUID(),
            studyId: studyId || "unassigned",
            scenarioId: scenarioId || undefined,
            issueType,
            status: "open",
            priority,
            description,
            createdBy: "local-reviewer",
            createdAt: new Date().toISOString(),
            resolvedAt: null,
            resolution: null,
          };
          const history = createIssueHistory(value);
          saveRecord("issue", value.issueId, value);
          saveRecord("issueHistory", history.historyId, history);
          dispatch({ type: "issue", value });
          dispatch({ type: "issueHistory", value: history });
          setDescription("");
        }}
      >
        <label>
          {tr("Issue type", "Tipo de incidencia")}
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as IssueType)}
          >
            {types.map((v) => (
              <option key={v} value={v}>
                {enumLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Study", "Estudio")}
          <select
            value={studyId}
            onChange={(event) => setStudyId(event.target.value)}
          >
            <option value="">{tr("Unassigned", "Sin asignar")}</option>
            {state.studies.map((study) => (
              <option key={study.studyId} value={study.studyId}>
                {study.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Scenario (optional)", "Caso (opcional)")}
          <select
            value={scenarioId}
            onChange={(event) => setScenarioId(event.target.value)}
          >
            <option value="">{tr("None", "Ninguno")}</option>
            {state.scenarios.map((scenario) => (
              <option key={scenario.scenarioId} value={scenario.scenarioId}>
                {scenario.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Priority", "Prioridad")}
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as ReviewIssue["priority"])
            }
          >
            {["low", "normal", "high"].map((value) => (
              <option key={value} value={value}>
                {enumLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Description", "Descripción")}
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button>{tr("Create Issue", "Crear incidencia")}</button>
      </form>
      <label>
        {tr("Search Issues", "Buscar incidencias")}
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <label>
        {tr("Status", "Estado")}
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as IssueStatus | "all")
          }
        >
          <option value="all">{tr("All", "Todos")}</option>
          {[
            "open",
            "under_review",
            "resolved",
            "rejected",
            "deferred",
            "closed",
          ].map((value) => (
            <option key={value} value={value}>
              {enumLabel(value)}
            </option>
          ))}
        </select>
      </label>
      {visible.length ? (
        <ul className="item-list">
          {visible.map((issue) => (
            <li key={issue.issueId}>
              <span>
                <strong>{enumLabel(issue.issueType)}</strong>
                <br />
                {issue.description}
                <br />
                <small>{enumLabel(issue.priority)}</small>
              </span>
              <select
                aria-label={`${tr("Status for", "Estado de")} ${issue.description}`}
                value={issue.status}
                onChange={(e) => update(issue, e.target.value as IssueStatus)}
              >
                {[
                  "open",
                  "under_review",
                  "resolved",
                  "rejected",
                  "deferred",
                  "closed",
                ].map((v) => (
                  <option key={v} value={v}>
                    {enumLabel(v)}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status">
          {tr(
            "No Issues match the current search.",
            "Ninguna incidencia coincide con la búsqueda actual.",
          )}
        </p>
      )}
      <h2>{tr("History", "Historial")}</h2>
      <div className="table-scroll">
        <table>
          <caption>
            {tr(
              "Append-only Issue status history",
              "Historial de estados de incidencias de solo adición",
            )}
          </caption>
          <thead>
            <tr>
              <th>{tr("Issue", "Incidencia")}</th>
              <th>{tr("From", "Desde")}</th>
              <th>{tr("To", "Hasta")}</th>
              <th>{tr("Date", "Fecha")}</th>
            </tr>
          </thead>
          <tbody>
            {state.issueHistory.map((v) => (
              <tr key={v.historyId}>
                <th scope="row">{v.issueId}</th>
                <td>
                  {v.fromStatus
                    ? enumLabel(v.fromStatus)
                    : tr("created", "creada")}
                </td>
                <td>{enumLabel(v.toStatus)}</td>
                <td>{v.changedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
