import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FieldId, FrameworkChangeLogEntry } from "../../domain/types";
import { saveRecord } from "../../storage/localStore";
import { useLanguage } from "../../i18n/LanguageContext";
import { useApp } from "../../state/AppContext";
import { makeAuditEvent } from "../../domain/audit";

export function ChangeLogEntryForm() {
  const { t } = useLanguage();
  const { dispatch } = useApp();
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [fieldId, setFieldId] = useState<FieldId>("F1");
  const [previousDefinitionVersion, setPrevious] = useState("1.0");
  const [newDefinitionVersion, setNew] = useState("2.0");
  const [previousText, setPreviousText] = useState("");
  const [newText, setNewText] = useState("");
  const [changeType, setChangeType] =
    useState<FrameworkChangeLogEntry["changeType"]>("wording");
  const [rationale, setRationale] = useState("");
  const [approvedInRound, setApprovedInRound] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const breakingChange =
    changeType === "response-type" || changeType === "scale";
  return (
    <main>
      <p className="eyebrow">{t("Administrator mode")}</p>
      <h1>{t("Record framework change")}</h1>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const entry: FrameworkChangeLogEntry = {
            entryId: crypto.randomUUID(),
            fieldId,
            previousDefinitionVersion,
            newDefinitionVersion,
            previousText,
            newText,
            changeType,
            rationale,
            approvedInRound,
            approvedBy,
            createdAt: new Date().toISOString(),
            breakingChange,
          };
          saveRecord("changelog", entry.entryId, entry);
          const audit = makeAuditEvent(
            "taxonomy_change",
            "framework_change",
            entry.entryId,
            { studyId: studyId ?? "", fieldId },
          );
          saveRecord("audit", audit.auditEventId, audit);
          dispatch({ type: "audit", value: audit });
          navigate(`/admin/study/${studyId}`);
        }}
      >
        <label>
          {t("Framework field")}
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value as FieldId)}
          >
            {["F1", "F2", "F3", "F4", "F5", "F6"].map((field) => (
              <option key={field}>{field}</option>
            ))}
          </select>
        </label>
        <label>
          {t("Previous definition version")}
          <input
            required
            value={previousDefinitionVersion}
            onChange={(e) => setPrevious(e.target.value)}
          />
        </label>
        <label>
          {t("New definition version")}
          <input
            required
            value={newDefinitionVersion}
            onChange={(e) => setNew(e.target.value)}
          />
        </label>
        <label>
          {t("Previous text")}
          <textarea
            required
            value={previousText}
            onChange={(e) => setPreviousText(e.target.value)}
          />
        </label>
        <label>
          {t("New text")}
          <textarea
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </label>
        <label>
          {t("Change type")}
          <select
            value={changeType}
            onChange={(e) =>
              setChangeType(
                e.target.value as FrameworkChangeLogEntry["changeType"],
              )
            }
          >
            {[
              "wording",
              "response-type",
              "scale",
              "merge",
              "split",
              "removal",
              "addition",
              "taxonomy_revision",
            ].map((type) => (
              <option key={type} value={type}>
                {t(type)}
              </option>
            ))}
          </select>
        </label>
        <p className="notice">
          {t("Comparability default:")}{" "}
          <strong>{t(breakingChange ? "breaking" : "non-breaking")}</strong>.
        </p>
        <label>
          {t("Rationale")}
          <textarea
            required
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </label>
        <label>
          {t("Approved in round (round ID)")}
          <input
            required
            value={approvedInRound}
            onChange={(e) => setApprovedInRound(e.target.value)}
          />
        </label>
        <label>
          {t("Approved by pseudonym/code")}
          <input
            required
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
          />
        </label>
        <button type="submit">{t("Record change")}</button>
      </form>
    </main>
  );
}
