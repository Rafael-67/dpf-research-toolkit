import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AuditEvent, EvaluationSession } from "../../domain/types";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  localizeDemoRound,
  localizeScenario,
} from "../../i18n/demoLocalization";
import { isSubmittedEvaluation } from "../../domain/sessionLifecycle";
import { scenariosAssignedToRound } from "../../domain/roundAssignments";

export function RoundDetail() {
  const { language, t } = useLanguage();
  const { studyId, roundId } = useParams();
  const { state, dispatch } = useApp();
  const round = state.rounds.find((item) => item.roundId === roundId);
  if (!round)
    return (
      <main>
        <h1>{t("Round not found")}</h1>
      </main>
    );
  const completed = state.sessions.filter(
    (session) =>
      session.roundId === roundId &&
      isSubmittedEvaluation(session.evaluationStatus),
  ).length;
  const toggle = () => {
    const updated = {
      ...round,
      status: round.status === "open" ? ("locked" as const) : ("open" as const),
      lockedAt: round.status === "open" ? new Date().toISOString() : null,
    };
    saveRecord("round", updated.roundId, updated);
    dispatch({ type: "round", value: updated });
  };
  const sessions = state.sessions.filter(
    (session) => session.roundId === roundId,
  );
  const assignedScenarios = scenariosAssignedToRound(
    state.scenarios,
    state.roundScenarios,
    round.roundId,
  );
  return (
    <main>
      <Link to={`/admin/study/${studyId}`}>{t("← Study")}</Link>
      <p className="eyebrow">
        {t("Round")} {round.roundNumber}
      </p>
      <h1>{localizeDemoRound(round.label, language)}</h1>
      <p>
        <span className="status">{t(round.status)}</span> {completed}{" "}
        {t("completed evaluation sessions")}
      </p>
      <div className="toolbar">
        <button
          disabled={round.status === "locked" && completed > 0}
          onClick={toggle}
        >
          {round.status === "open" ? t("Lock round") : t("Unlock round")}
        </button>
        <Link
          className="button secondary"
          to={`/admin/study/${studyId}/round/${roundId}/summary`}
        >
          {t("Agreement summary")}
        </Link>
      </div>
      <h2>{t("Assigned scenarios")}</h2>
      <ul className="item-list">
        {assignedScenarios.map((scenario) => (
          <li key={scenario.scenarioId}>
            <strong>{localizeScenario(scenario, language).title}</strong>
            <span>{scenario.scenarioVersion}</span>
          </li>
        ))}
      </ul>
      <h2>Evaluation record states</h2>
      {sessions.map((session) => (
        <EvaluationStateManager key={session.sessionId} session={session} />
      ))}
    </main>
  );
}

function EvaluationStateManager({ session }: { session: EvaluationSession }) {
  const { dispatch } = useApp();
  const [reason, setReason] = useState(session.exclusionReason ?? "");
  const update = (
    evaluationStatus: EvaluationSession["evaluationStatus"],
    action: AuditEvent["action"],
  ) => {
    const updated: EvaluationSession = {
      ...session,
      evaluationStatus,
      exclusionReason:
        evaluationStatus === "excluded_from_analysis"
          ? reason.trim()
          : session.exclusionReason,
      lockedAt: evaluationStatus === "locked" ? new Date().toISOString() : null,
    };
    saveRecord("evaluation", updated.sessionId, updated);
    dispatch({ type: "session", value: updated });
    const audit: AuditEvent = {
      auditEventId: crypto.randomUUID(),
      action,
      entityType: "evaluation",
      entityId: session.sessionId,
      actorProfileId: null,
      occurredAt: new Date().toISOString(),
      details: {
        studyId: session.studyId,
        status: evaluationStatus,
        reason: reason.trim() || null,
      },
    };
    saveRecord("audit", audit.auditEventId, audit);
    dispatch({ type: "audit", value: audit });
  };
  return (
    <article className="card">
      <strong>{session.evaluatorPseudonym}</strong> · {session.scenarioId}
      <p>Status: {session.evaluationStatus}</p>
      <label>
        Exclusion or return justification
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <div className="toolbar">
        <button
          className="secondary"
          disabled={!reason.trim()}
          onClick={() => update("returned_for_revision", "reopening")}
        >
          Return for revision
        </button>
        <button onClick={() => update("locked", "locking")}>Lock record</button>
        <button
          className="secondary"
          onClick={() => update("included_in_analysis", "locking")}
        >
          Include in analysis
        </button>
        <button
          className="secondary"
          disabled={!reason.trim()}
          onClick={() => update("excluded_from_analysis", "exclusion")}
        >
          Exclude with justification
        </button>
      </div>
    </article>
  );
}
