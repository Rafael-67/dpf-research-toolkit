import { useLanguage } from "../i18n/LanguageContext";

export function PrototypeBanner() {
  const { t } = useLanguage();
  return (
    <div className="prototype-banner" role="note">
      <strong>{t("Research prototype.")}</strong>{" "}
      {t(
        "Do not use for real studies without institutional data-protection review. Use fictional/demo information only.",
      )}
    </div>
  );
}
