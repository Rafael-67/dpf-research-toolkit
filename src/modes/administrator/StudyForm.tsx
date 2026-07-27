import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Study } from "../../domain/types";
import { saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { makeAuditEvent } from "../../domain/audit";

export function StudyForm() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [includeRtlx, setRtlx] = useState(true);
  const [includeSus, setSus] = useState(true);
  return (
    <main>
      <p className="eyebrow">{t("Administrator mode")}</p>
      <h1>{t("Create study")}</h1>
      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          const study: Study = {
            studyId: crypto.randomUUID(),
            title,
            description,
            createdAt: new Date().toISOString(),
            status: "draft",
            config: {
              instrumentVersion: "1.1.0",
              includeRtlx,
              includeSus,
              confidenceScalePoints: 4,
              relevanceClarityScalePoints: 4,
            },
          };
          saveRecord("study", study.studyId, study);
          dispatch({ type: "study", value: study });
          const audit = makeAuditEvent("creation", "study", study.studyId);
          saveRecord("audit", audit.auditEventId, audit);
          dispatch({ type: "audit", value: audit });
          navigate(`/admin/study/${study.studyId}`);
        }}
      >
        <label>
          {t("Study title")}
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          {t("Description")}
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <p className="notice">
          {t(
            "DPF-RP uses one structured hybrid workflow. Taxonomy 0.1-exploratory contains candidate items for validation.",
          )}
        </p>
        <label className="check">
          <input
            type="checkbox"
            checked={includeRtlx}
            onChange={(e) => setRtlx(e.target.checked)}
          />
          {t("Include RTLX")}
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={includeSus}
            onChange={(e) => setSus(e.target.checked)}
          />
          {t("Include SUS")}
        </label>
        <button type="submit">{t("Create study")}</button>
      </form>
    </main>
  );
}
