import type { MergedDataset } from "../../../merge/mergeDataset";
import {
  mergedDatasetCsv,
  observationCsv,
  observationSelectionsCsv,
  taxonomyRatingsCsv,
} from "../../../merge/mergeDataset";
import {
  downloadJson,
  downloadText,
  makeEnvelope,
} from "../../../storage/exportImport";
import { useLanguage } from "../../../i18n/LanguageContext";

export function MergedDatasetExport({ dataset }: { dataset: MergedDataset }) {
  const { t } = useLanguage();
  return (
    <section className="card">
      <h2>{t("Export merged dataset")}</h2>
      <p>
        {t(
          "Exports retain all sessions and the field-level comparability matrix.",
        )}
      </p>
      <div className="toolbar">
        <button
          onClick={() =>
            downloadJson(
              "merged-dataset.json",
              makeEnvelope("merged-dataset", dataset),
            )
          }
        >
          {t("Export merged JSON")}
        </button>
        <button
          className="secondary"
          onClick={() =>
            downloadText("merged-observations.csv", observationCsv(dataset))
          }
        >
          Export observation CSV
        </button>
        <button
          className="secondary"
          onClick={() =>
            downloadText(
              "merged-observation-selections.csv",
              observationSelectionsCsv(dataset),
            )
          }
        >
          Export observation selections CSV
        </button>
        <button
          className="secondary"
          onClick={() =>
            downloadText(
              "merged-taxonomy-ratings.csv",
              taxonomyRatingsCsv(dataset),
            )
          }
        >
          Export taxonomy-review CSV
        </button>
        <button
          className="secondary"
          onClick={() =>
            downloadText(
              "merged-field-responses.csv",
              mergedDatasetCsv(dataset),
            )
          }
        >
          {t("Export field-response CSV")}
        </button>
      </div>
    </section>
  );
}
