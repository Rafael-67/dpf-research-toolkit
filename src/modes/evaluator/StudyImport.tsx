import { useState } from "react";
import { importStudyFile } from "../../import/caseImport";
import { downloadText } from "../../storage/exportImport";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { makeAuditEvent } from "../../domain/audit";
import {
  adaptEvaluationExportEntities,
  validateEvaluationSessions,
} from "../../domain/sessionCompatibility";
import { parseEnvelope } from "../../storage/exportImport";

interface StudyImportProps {
  mode?: "administrator" | "evaluator";
}

export function StudyImport({ mode = "evaluator" }: StudyImportProps) {
  const { language, t } = useLanguage();
  const { dispatch } = useApp();
  const [message, setMessage] = useState("");
  const downloadCsvTemplate = () =>
    downloadText(
      "case-import-template.csv",
      [
        "title,taskDescription,operatingConditions,availableInformation,vectorMaterialDescription,volumeOrConcentration,existingControls,contextualConstraints,intendedEvaluatorGroup,adminNotes",
        '"Example case","Describe the fictional task here","Operating conditions","Available information","Fictional material","Fictional quantity","Existing controls","Contextual constraints","Evaluator group","Optional notes"',
      ].join("\r\n"),
    );
  const importFile = async (file: File) => {
    try {
      if (file.name.toLowerCase().endsWith(".json")) {
        const text = await file.text();
        let candidate: { exportType?: unknown } | null = null;
        try {
          candidate = JSON.parse(text) as { exportType?: unknown };
        } catch {
          // The normal case importer provides the localized JSON error.
        }
        if (candidate?.exportType === "evaluation-session") {
          const envelope = parseEnvelope<unknown>(text, "evaluation-session");
          const sessions = validateEvaluationSessions(
            adaptEvaluationExportEntities(envelope.entities, envelope),
          );
          sessions.forEach((session) => {
            saveRecord("evaluation", session.sessionId, session);
            dispatch({ type: "session", value: session });
          });
          setMessage(
            language === "es"
              ? `Se importaron ${sessions.length} valoración(es) v1.1 desde ${file.name}.`
              : `Imported ${sessions.length} v1.1 evaluation(s) from ${file.name}.`,
          );
          return;
        }
      }
      const entities = await importStudyFile(file);
      entities.studies.forEach((study) => {
        saveRecord("study", study.studyId, study);
        dispatch({ type: "study", value: study });
      });
      entities.rounds.forEach((round) => {
        saveRecord("round", round.roundId, round);
        dispatch({ type: "round", value: round });
      });
      entities.scenarios.forEach((scenario) => {
        saveRecord(
          "scenario",
          `${scenario.scenarioId}:${scenario.scenarioVersion}`,
          scenario,
        );
        dispatch({ type: "scenario", value: scenario });
      });
      entities.roundScenarios.forEach((assignment) => {
        saveRecord(
          "roundScenario",
          `${assignment.roundId}:${assignment.scenarioId}`,
          assignment,
        );
        dispatch({ type: "roundScenario", value: assignment });
      });
      entities.changelog.forEach((entry) =>
        saveRecord("changelog", entry.entryId, entry),
      );
      const audit = makeAuditEvent("import", "study_import", file.name, {
        studies: entities.studies.length,
        scenarios: entities.scenarios.length,
      });
      saveRecord("audit", audit.auditEventId, audit);
      dispatch({ type: "audit", value: audit });
      setMessage(
        `${t("Imported {studies} study and {cases} cases from {file}.", {
          studies: entities.studies.length,
          cases: entities.scenarios.length,
          file: file.name,
        })}${
          entities.classificationDefaultsApplied
            ? ` ${t(
                "Legacy classification defaults applied to {count} scenarios.",
                {
                  count: entities.classificationDefaultsApplied,
                },
              )}`
            : ""
        }`,
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? t(error.message) : t("Import failed."),
      );
    }
  };
  return (
    <main>
      <p className="eyebrow">
        {t(mode === "administrator" ? "Administrator mode" : "Evaluator mode")}
      </p>
      <h1>{t("Import studies or cases")}</h1>
      <p>
        {language === "es"
          ? "Los archivos se procesan únicamente en este navegador. Importe un "
          : "Files are processed only in this browser. Import a native "}
        <code>study-config.json</code>
        {language === "es"
          ? ", datos JSON, una tabla CSV o un documento Word/PDF etiquetado."
          : ", JSON case data, a CSV table, or a labeled Word/PDF document."}
      </p>
      <details className="card">
        <summary>{t("Required case format")}</summary>
        <p>
          {language === "es" ? "Cada caso necesita " : "Every case needs "}
          <strong>title</strong>
          {language === "es" ? " y " : " and "}
          <strong>taskDescription</strong>.{" "}
          {language === "es"
            ? "CSV utiliza un caso por fila. Word y PDF usan líneas etiquetadas; repita Título: para iniciar otro caso. También se aceptan etiquetas en inglés."
            : "CSV uses one case per row. Word and PDF use labeled lines; repeat Title: to start another case. Spanish labels are also accepted."}
        </p>
        <p>
          {language === "es" ? "Campos opcionales: " : "Optional fields: "}
          operatingConditions, availableInformation, vectorMaterialDescription,
          volumeOrConcentration, existingControls, contextualConstraints,
          intendedEvaluatorGroup, and adminNotes.
        </p>
      </details>
      <button className="secondary" type="button" onClick={downloadCsvTemplate}>
        {t("Download CSV template")}
      </button>
      <label className="file-input">
        {t("Study or case file (JSON, CSV, DOCX, or PDF)")}
        <input
          type="file"
          accept="application/json,.json,text/csv,.csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/pdf,.pdf"
          onChange={(event) =>
            event.target.files?.[0] && void importFile(event.target.files[0])
          }
        />
      </label>
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
    </main>
  );
}
