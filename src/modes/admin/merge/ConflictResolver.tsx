import type { MergeResult } from "../../../merge/mergeDataset";
import { useLanguage } from "../../../i18n/LanguageContext";

export function ConflictResolver({ result }: { result: MergeResult }) {
  const { t } = useLanguage();
  return (
    <section>
      <h2>{t("Merge report")}</h2>
      <p>
        {result.dataset.sessions.length} {t("unique sessions loaded.")}
      </p>
      {result.warnings.length > 0 && (
        <div className="notice">
          <h3>{t("Duplicate session IDs")}</h3>
          <ul>
            {result.warnings.map((warning) => (
              <li key={warning}>{t(warning)}</li>
            ))}
          </ul>
        </div>
      )}
      {result.possibleDuplicateAttempts.length > 0 && (
        <div className="notice">
          <h3>{t("Possible duplicate attempts — human decision required")}</h3>
          <ul>
            {result.possibleDuplicateAttempts.map((attempt) => (
              <li key={attempt.sessionIds.join(":")}>
                {t("Possible duplicate attempt:")} {attempt.evaluatorPseudonym},{" "}
                {t("round")} {attempt.roundId}, {t("scenario")}{" "}
                {attempt.scenarioId}: {attempt.sessionIds.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.dataset.comparabilityMatrix.length > 0 && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("Round pair")}</th>
                <th>{t("Field")}</th>
                <th>{t("Comparable")}</th>
                <th>{t("Reason")}</th>
              </tr>
            </thead>
            <tbody>
              {result.dataset.comparabilityMatrix.map((record) => (
                <tr
                  key={`${record.leftRoundId}-${record.rightRoundId}-${record.fieldId}`}
                >
                  <td>
                    {record.leftRoundId} ↔ {record.rightRoundId}
                  </td>
                  <td>{record.fieldId}</td>
                  <td>
                    {record.comparable ? t("Yes") : t("No — kept separate")}
                  </td>
                  <td>
                    {record.reasons.map((reason) => t(reason)).join("; ") ||
                      t("No breaking change found")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
