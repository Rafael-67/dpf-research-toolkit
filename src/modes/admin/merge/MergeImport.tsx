import { useState } from "react";
import type {
  AuditEvent,
  ConsensusRecord,
  EvaluatorAssignment,
  FrameworkChangeLogEntry,
  Round,
  Scenario,
  Study,
  UserProfile,
} from "../../../domain/types";
import {
  adaptEvaluationExportEntities,
  validateEvaluationSessions,
} from "../../../domain/sessionCompatibility";
import type { MergedDataset, MergeResult } from "../../../merge/mergeDataset";
import { mergeDatasets } from "../../../merge/mergeDataset";
import { parseEnvelope } from "../../../storage/exportImport";
import { listRecords } from "../../../storage/localStore";
import { ConflictResolver } from "./ConflictResolver";
import { MergedDatasetExport } from "./MergedDatasetExport";
import { useLanguage } from "../../../i18n/LanguageContext";
import { validateImportFile } from "../../../import/fileValidation";

export function MergeImport() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<MergedDataset[]>([]);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [error, setError] = useState("");
  const importFiles = async (files: FileList) => {
    try {
      const imported: MergedDataset[] = [];
      for (const file of [...files]) {
        validateImportFile(file, ["json"]);
        const envelope = parseEnvelope<unknown>(
          await file.text(),
          "evaluation-session",
        );
        imported.push({
          studies: listRecords<Study>("study"),
          rounds: listRecords<Round>("round"),
          scenarios: listRecords<Scenario>("scenario"),
          sessions: validateEvaluationSessions(
            adaptEvaluationExportEntities(envelope.entities, envelope),
          ),
          changelog: listRecords<FrameworkChangeLogEntry>("changelog"),
          comparabilityMatrix: [],
          importSources: [
            {
              importId: crypto.randomUUID(),
              importedAt: new Date().toISOString(),
            },
          ],
          sessionProvenance: [],
          mergeLog: [],
          profiles: listRecords<UserProfile>("profile"),
          assignments: listRecords<EvaluatorAssignment>("assignment"),
          consensusRecords: listRecords<ConsensusRecord>("consensus"),
          auditEvents: listRecords<AuditEvent>("audit"),
        });
      }
      const next = [...inputs, ...imported];
      setInputs(next);
      setResult(mergeDatasets(next));
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : t("Merge import failed."),
      );
    }
  };
  return (
    <main>
      <p className="eyebrow">{t("Administrator mode")}</p>
      <h1>{t("Merge evaluation exports")}</h1>
      <p>
        {t(
          "Import individual evaluator files. Duplicate and version conflicts are always surfaced.",
        )}
      </p>
      <label className="file-input">
        {t("Evaluation JSON files")}
        <input
          type="file"
          multiple
          accept="application/json,.json"
          onChange={(event) =>
            event.target.files && void importFiles(event.target.files)
          }
        />
      </label>
      {error && (
        <p className="notice" role="alert">
          {error}
        </p>
      )}
      {result && (
        <>
          <ConflictResolver result={result} />
          <MergedDatasetExport dataset={result.dataset} />
        </>
      )}
    </main>
  );
}
