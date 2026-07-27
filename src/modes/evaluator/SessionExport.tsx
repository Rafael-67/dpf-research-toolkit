import type { EvaluationSession } from "../../domain/types";
import { downloadJson, makeEnvelope } from "../../storage/exportImport";
import { useLanguage } from "../../i18n/LanguageContext";

export function SessionExport({ session }: { session: EvaluationSession }) {
  const { t } = useLanguage();
  const filename = `evaluation-${session.evaluatorPseudonym}-${session.roundId}.json`;
  return (
    <button
      className="secondary"
      onClick={() =>
        downloadJson(
          filename,
          makeEnvelope("evaluation-session", { sessions: [session] }),
        )
      }
    >
      {t("Export evaluation JSON")}
    </button>
  );
}
