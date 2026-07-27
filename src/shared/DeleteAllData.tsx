import { useState } from "react";
import { deleteAllLocalData } from "../storage/localStore";
import { useLanguage } from "../i18n/LanguageContext";

export function DeleteAllData() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  if (!open)
    return (
      <button className="danger-link" onClick={() => setOpen(true)}>
        {t("Delete all local data")}
      </button>
    );
  return (
    <section className="delete-panel" aria-labelledby="delete-title">
      <h2 id="delete-title">{t("Delete all local data")}</h2>
      <p>
        {t(
          "This permanently removes every DPF Toolkit record from this browser.",
        )}
      </p>
      <label>
        {t("Type DELETE to confirm")}
        <input
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
        />
      </label>
      <div className="actions">
        <button onClick={() => setOpen(false)}>{t("Cancel")}</button>
        <button
          className="danger"
          disabled={confirmation !== "DELETE"}
          onClick={() => {
            deleteAllLocalData();
            location.hash = "/";
            location.reload();
          }}
        >
          {t("Delete permanently")}
        </button>
      </div>
    </section>
  );
}
