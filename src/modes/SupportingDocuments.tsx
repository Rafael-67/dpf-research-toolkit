import { useState } from "react";
import type {
  DocumentLink,
  DocumentAccessMode,
  DocumentScope,
  FieldId,
  SupportingDocument,
} from "../domain/types";
import {
  createDocumentVersion,
  validateDocumentReference,
} from "../domain/reviewServices";
import { saveRecord } from "../storage/localStore";
import { useApp } from "../state/AppContext";
import { useLanguage } from "../i18n/LanguageContext";

export function SupportingDocuments() {
  const { state, dispatch } = useApp();
  const { language } = useLanguage();
  const tr = (en: string, es: string) => (language === "es" ? es : en);
  const enumLabel = (value: string) =>
    language === "es"
      ? ({
          external: "externo",
          "packaged-local": "local empaquetado",
          "metadata-only": "solo metadatos",
          instrument: "instrumento",
          study: "estudio",
          scenario: "caso",
          field: "campo",
        }[value] ?? value)
      : value;
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("1.0");
  const [uri, setUri] = useState("");
  const [checksum, setChecksum] = useState("");
  const [scope, setScope] = useState<DocumentScope>("instrument");
  const [accessMode, setAccessMode] =
    useState<DocumentAccessMode>("metadata-only");
  const [studyId, setStudyId] = useState("");
  const [scenarioId, setScenarioId] = useState("");
  const [fieldId, setFieldId] = useState<FieldId>("F1");
  const persistDocument = (value: SupportingDocument, link: DocumentLink) => {
    saveRecord("document", value.documentId, value);
    saveRecord("documentLink", link.documentLinkId, link);
    dispatch({ type: "document", value });
    dispatch({ type: "documentLink", value: link });
  };
  return (
    <main>
      <p className="eyebrow">
        {tr(
          "Versioned read-only resources",
          "Recursos versionados de solo lectura",
        )}
      </p>
      <h1>{tr("Supporting Documents", "Documentos de apoyo")}</h1>
      <p className="notice">
        {tr(
          "Only metadata, URI and checksums are stored. Binary files are not embedded in scientific records.",
          "Solo se almacenan metadatos, URI y sumas de verificación. Los archivos binarios no se incorporan a los registros científicos.",
        )}
      </p>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          validateDocumentReference(accessMode, uri, checksum);
          const value: SupportingDocument = {
            documentId: crypto.randomUUID(),
            title,
            documentType: "reference",
            version,
            uri,
            checksum,
            accessMode,
            scope,
            studyId: scope !== "instrument" ? studyId : undefined,
            scenarioId:
              scope === "scenario" || scope === "field"
                ? scenarioId
                : undefined,
            fieldId: scope === "field" ? fieldId : undefined,
            createdAt: new Date().toISOString(),
            active: true,
          };
          const link: DocumentLink = {
            documentLinkId: crypto.randomUUID(),
            documentId: value.documentId,
            documentVersion: value.version,
            scope,
            studyId: value.studyId,
            scenarioId: value.scenarioId,
            fieldId: value.fieldId,
            createdAt: value.createdAt,
          };
          persistDocument(value, link);
          setTitle("");
        }}
      >
        <label>
          {tr("Title", "Título")}
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        {scope !== "instrument" && (
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
        )}
        {(scope === "scenario" || scope === "field") && (
          <label>
            {tr("Scenario", "Caso")}
            <select
              required
              value={scenarioId}
              onChange={(event) => setScenarioId(event.target.value)}
            >
              <option value="">
                {tr("Select scenario", "Seleccione un caso")}
              </option>
              {state.scenarios.map((scenario) => (
                <option key={scenario.scenarioId} value={scenario.scenarioId}>
                  {scenario.title}
                </option>
              ))}
            </select>
          </label>
        )}
        {scope === "field" && (
          <label>
            {tr("Field", "Campo")}
            <select
              value={fieldId}
              onChange={(event) => setFieldId(event.target.value as FieldId)}
            >
              {["F1", "F2", "F3", "F4", "F5", "F6"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          {tr("Version", "Versión")}
          <input
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </label>
        <label>
          {tr("Type", "Tipo")}
          <select
            value={accessMode}
            onChange={(e) =>
              setAccessMode(e.target.value as DocumentAccessMode)
            }
          >
            {["external", "packaged-local", "metadata-only"].map((value) => (
              <option key={value} value={value}>
                {enumLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {tr("Scope", "Ámbito")}
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as DocumentScope)}
          >
            {["instrument", "study", "scenario", "field"].map((value) => (
              <option key={value} value={value}>
                {enumLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          URI
          <input value={uri} onChange={(e) => setUri(e.target.value)} />
        </label>
        <label>
          {tr("SHA-256 checksum", "Suma de verificación SHA-256")}
          <input
            value={checksum}
            onChange={(e) => setChecksum(e.target.value)}
            placeholder="sha256:…"
          />
        </label>
        <button>
          {tr("Register immutable version", "Registrar versión inmutable")}
        </button>
      </form>
      <h2>{tr("Document registry", "Registro documental")}</h2>
      {state.documents.length ? (
        <div className="table-scroll">
          <table>
            <caption>
              {tr(
                "Supporting-document versions",
                "Versiones de los documentos de apoyo",
              )}
            </caption>
            <thead>
              <tr>
                <th>{tr("Title", "Título")}</th>
                <th>{tr("Version", "Versión")}</th>
                <th>{tr("Scope", "Ámbito")}</th>
                <th>{tr("Mode", "Modo")}</th>
                <th>{tr("Checksum", "Suma de verificación")}</th>
                <th>{tr("Versioning", "Versionado")}</th>
                <th>{tr("Availability", "Disponibilidad")}</th>
              </tr>
            </thead>
            <tbody>
              {state.documents.map((v) => (
                <tr key={v.documentId}>
                  <th scope="row">{v.title}</th>
                  <td>{v.version}</td>
                  <td>{enumLabel(v.scope)}</td>
                  <td>{enumLabel(v.accessMode)}</td>
                  <td>
                    <code>
                      {v.checksum
                        ? `${v.checksum.slice(0, 18)}…`
                        : tr("not recorded", "no registrada")}
                    </code>
                  </td>
                  <td>
                    {v.active ? (
                      <button
                        type="button"
                        onClick={() => {
                          const nextVersion = `${v.version}.1`;
                          const next = createDocumentVersion(
                            v,
                            nextVersion,
                            v.uri,
                            v.checksum,
                          );
                          const previous = { ...v, active: false };
                          saveRecord("document", previous.documentId, previous);
                          dispatch({ type: "document", value: previous });
                          persistDocument(next, {
                            documentLinkId: crypto.randomUUID(),
                            documentId: next.documentId,
                            documentVersion: next.version,
                            scope: next.scope,
                            studyId: next.studyId,
                            scenarioId: next.scenarioId,
                            fieldId: next.fieldId,
                            createdAt: next.createdAt,
                          });
                        }}
                      >
                        {tr(
                          "Create next immutable version",
                          "Crear siguiente versión inmutable",
                        )}
                      </button>
                    ) : (
                      tr("Superseded", "Sustituido")
                    )}
                  </td>
                  <td>
                    {v.active ? (
                      v.uri ? (
                        <a href={v.uri} target="_blank" rel="noreferrer">
                          {tr(
                            "Open read-only",
                            "Abrir en modo de solo lectura",
                          )}
                        </a>
                      ) : (
                        tr("metadata only", "solo metadatos")
                      )
                    ) : (
                      tr("inactive / superseded", "inactivo / sustituido")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p role="status">
          {tr(
            "No supporting documents registered.",
            "No hay documentos de apoyo registrados.",
          )}
        </p>
      )}
    </main>
  );
}
