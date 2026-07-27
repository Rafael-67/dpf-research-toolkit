import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Round } from "../../domain/types";
import { FRAMEWORK_VERSION } from "../../framework/fields";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { makeAuditEvent } from "../../domain/audit";

export function RoundForm() {
  const { t } = useLanguage();
  const { studyId = "" } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const study = state.studies.find((value) => value.studyId === studyId);
  const [label, setLabel] = useState("");
  const [group, setGroup] = useState("");
  return (
    <main>
      <h1>{t("Create round")}</h1>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const round: Round = {
            roundId: crypto.randomUUID(),
            studyId,
            roundNumber:
              state.rounds.filter((r) => r.studyId === studyId).length + 1,
            label,
            frameworkVersion: FRAMEWORK_VERSION,
            instrumentVersion: "1.1.0",
            status: "open",
            evaluatorGroup: group,
            openedAt: new Date().toISOString(),
            lockedAt: null,
          };
          saveRecord("round", round.roundId, round);
          dispatch({ type: "round", value: round });
          const audit = makeAuditEvent("creation", "round", round.roundId, {
            studyId,
          });
          saveRecord("audit", audit.auditEventId, audit);
          dispatch({ type: "audit", value: audit });
          state.scenarios.forEach((scenario) => {
            const assignment = {
              roundId: round.roundId,
              scenarioId: scenario.scenarioId,
              scenarioVersion: scenario.scenarioVersion,
            };
            saveRecord(
              "roundScenario",
              `${assignment.roundId}:${assignment.scenarioId}`,
              assignment,
            );
            dispatch({ type: "roundScenario", value: assignment });
          });
          navigate(`/admin/study/${studyId}/round/${round.roundId}`);
        }}
      >
        <label>
          {t("Round label")}
          <input
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
        <label>
          {t("Evaluator group")}
          <input
            required
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </label>
        <p className="notice">
          {t("Instrument version")}:{" "}
          {study?.config.instrumentVersion ?? "1.0.0"}
        </p>
        <button type="submit">{t("Create round")}</button>
      </form>
    </main>
  );
}
