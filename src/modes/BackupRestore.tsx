import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { downloadJson } from "../storage/exportImport";

interface Backup {
  format: "dpf-local-backup";
  version: 1;
  exportedAt: string;
  records: Record<string, string>;
}

export function BackupRestore() {
  const { language } = useLanguage();
  const es = language === "es";
  const [candidate, setCandidate] = useState<Backup | null>(null);
  const [message, setMessage] = useState("");
  const exportBackup = () => {
    const records = Object.fromEntries(
      Object.keys(localStorage)
        .filter((key) => key.startsWith("dpft:"))
        .map((key) => [key, localStorage.getItem(key) ?? ""]),
    );
    downloadJson("dpf-local-backup.json", {
      format: "dpf-local-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      records,
    } satisfies Backup);
  };
  return (
    <section>
      <h2>{es ? "Copia de seguridad local" : "Local backup"}</h2>
      <p>
        {es
          ? "La restauración reemplaza los registros DPF de este navegador después de mostrar una vista previa."
          : "Restore replaces this browser's DPF records after showing a preview."}
      </p>
      <div className="toolbar">
        <button onClick={exportBackup}>
          {es ? "Exportar copia completa" : "Export complete backup"}
        </button>
        <label className="file-input">
          {es ? "Seleccionar copia" : "Select backup"}
          <input
            type="file"
            accept=".json,application/json"
            onChange={async (event) => {
              try {
                const parsed = JSON.parse(
                  (await event.target.files?.[0]?.text()) ?? "",
                ) as Backup;
                if (
                  parsed.format !== "dpf-local-backup" ||
                  parsed.version !== 1 ||
                  !parsed.records
                )
                  throw new Error("Invalid backup format.");
                setCandidate(parsed);
                setMessage("");
              } catch (error) {
                setCandidate(null);
                setMessage(
                  error instanceof Error ? error.message : "Invalid backup.",
                );
              }
            }}
          />
        </label>
      </div>
      {candidate && (
        <div className="notice">
          <p>
            {Object.keys(candidate.records).length}{" "}
            {es ? "registros preparados" : "records ready"} ·{" "}
            {candidate.exportedAt}
          </p>
          <button
            className="danger"
            onClick={() => {
              Object.keys(localStorage)
                .filter((key) => key.startsWith("dpft:"))
                .forEach((key) => localStorage.removeItem(key));
              Object.entries(candidate.records).forEach(([key, value]) =>
                localStorage.setItem(key, value),
              );
              location.reload();
            }}
          >
            {es ? "Confirmar restauración" : "Confirm restore"}
          </button>
        </div>
      )}
      {message && <p role="alert">{message}</p>}
    </section>
  );
}
