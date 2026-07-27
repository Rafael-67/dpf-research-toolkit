import { useLanguage } from "./LanguageContext";

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <label className="language-selector">
      <span>{t("Language")}</span>
      <select
        aria-label={t("Language")}
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "es")}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </label>
  );
}
