import { useState } from "react";
import type { Institution } from "../domain/types";
import { useLanguage } from "../i18n/LanguageContext";
import { saveRecord } from "../storage/localStore";
import { useApp } from "../state/AppContext";

export function InstitutionRegistry() {
  const { language } = useLanguage();
  const { state, dispatch } = useApp();
  const [studyId, setStudyId] = useState(state.studies[0]?.studyId ?? "");
  const [institutionCode, setInstitutionCode] = useState("");
  const [displayName, setDisplayName] = useState("");
  const tr = (en: string, es: string) => (language === "es" ? es : en);
  return (
    <main>
      <p className="eyebrow">
        {tr("Normalised entity", "Entidad normalizada")}
      </p>
      <h1>{tr("Institutions", "Instituciones")}</h1>
      <p className="notice">
        {tr(
          "Institution codes are study-scoped and evaluator records reference their stable identifier.",
          "Los códigos de institución pertenecen a cada estudio y los evaluadores hacen referencia a su identificador estable.",
        )}
      </p>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const value: Institution = {
            institutionId: crypto.randomUUID(),
            studyId,
            institutionCode: institutionCode.trim(),
            displayName: displayName.trim() || null,
            active: true,
            createdAt: new Date().toISOString(),
          };
          saveRecord("institution", value.institutionId, value);
          dispatch({ type: "institution", value });
          setInstitutionCode("");
          setDisplayName("");
        }}
      >
        <label>
          {tr("Study", "Estudio")}
          <select
            required
            value={studyId}
            onChange={(event) => setStudyId(event.target.value)}
          >
            <option value="">
              {tr("Select study", "Seleccione un estudio")}
            </option>
            {state.studies.map((study) => (
              <option key={study.studyId} value={study.studyId}>
                {study.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Institution code", "Código de institución")}
          <input
            required
            value={institutionCode}
            onChange={(event) => setInstitutionCode(event.target.value)}
          />
        </label>
        <label>
          {tr("Display name (optional)", "Nombre visible (opcional)")}
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <button>{tr("Register institution", "Registrar institución")}</button>
      </form>
      <div className="table-scroll">
        <table>
          <caption>
            {tr("Institution registry", "Registro de instituciones")}
          </caption>
          <thead>
            <tr>
              <th>{tr("Code", "Código")}</th>
              <th>{tr("Name", "Nombre")}</th>
              <th>{tr("Study", "Estudio")}</th>
              <th>{tr("Status", "Estado")}</th>
            </tr>
          </thead>
          <tbody>
            {state.institutions.map((institution) => (
              <tr key={institution.institutionId}>
                <th scope="row">{institution.institutionCode}</th>
                <td>{institution.displayName ?? "—"}</td>
                <td>{institution.studyId}</td>
                <td>
                  {institution.active
                    ? tr("active", "activa")
                    : tr("inactive", "inactiva")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
