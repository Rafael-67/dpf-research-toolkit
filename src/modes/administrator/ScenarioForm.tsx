import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Scenario } from "../../domain/types";
import { FRAMEWORK_VERSION } from "../../framework/fields";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { makeAuditEvent } from "../../domain/audit";

const fields: Array<[keyof Scenario, string]> = [
  ["title", "Title"],
  ["taskDescription", "Task description"],
  ["operatingConditions", "Operating conditions"],
  ["availableInformation", "Available information"],
  ["vectorMaterialDescription", "Vector/material description"],
  ["volumeOrConcentration", "Volume or concentration"],
  ["existingControls", "Existing controls"],
  ["contextualConstraints", "Contextual constraints"],
  ["intendedEvaluatorGroup", "Intended evaluator group"],
];
export function ScenarioForm() {
  const { t } = useLanguage();
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <main>
      <h1>{t("Create fictional scenario")}</h1>
      <p className="notice">
        {t(
          "Do not enter real protocols, institutional identifiers, or non-public agent information.",
        )}
      </p>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const scenario: Scenario = {
            scenarioId: crypto.randomUUID(),
            scenarioVersion: "1.0",
            title: values.title,
            taskDescription: values.taskDescription,
            operatingConditions: values.operatingConditions,
            availableInformation: values.availableInformation,
            vectorMaterialDescription: values.vectorMaterialDescription,
            volumeOrConcentration: values.volumeOrConcentration,
            existingControls: values.existingControls,
            contextualConstraints: values.contextualConstraints,
            intendedEvaluatorGroup: values.intendedEvaluatorGroup,
            frameworkVersion: FRAMEWORK_VERSION,
            adminNotes: "",
            isDemo: false,
            scenarioClass: "user",
            referenceSet: false,
            studyAlignment: null,
            studyId,
          };
          saveRecord(
            "scenario",
            `${scenario.scenarioId}:${scenario.scenarioVersion}`,
            scenario,
          );
          dispatch({ type: "scenario", value: scenario });
          const audit = makeAuditEvent(
            "creation",
            "scenario",
            scenario.scenarioId,
            { studyId: studyId ?? "" },
          );
          saveRecord("audit", audit.auditEventId, audit);
          dispatch({ type: "audit", value: audit });
          state.rounds
            .filter((round) => round.studyId === studyId)
            .forEach((round) => {
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
          navigate(`/admin/study/${studyId}`);
        }}
      >
        {fields.map(([key, label]) => (
          <label key={key}>
            {t(label)}
            <textarea
              required={key !== "volumeOrConcentration"}
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
          </label>
        ))}
        <button type="submit">{t("Create scenario")}</button>
      </form>
    </main>
  );
}
