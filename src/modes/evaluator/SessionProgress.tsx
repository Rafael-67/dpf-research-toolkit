import { useLanguage } from "../../i18n/LanguageContext";

export function SessionProgress({ current }: { current: number }) {
  const { t } = useLanguage();
  return (
    <div
      className="progress"
      aria-label={t("Field {current} of 6", { current: current + 1 })}
    >
      <span style={{ width: `${((current + 1) / 6) * 100}%` }} />
    </div>
  );
}
