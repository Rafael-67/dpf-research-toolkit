import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type {
  EvaluationSession,
  FieldResponse,
  FieldId,
} from "../../domain/types";
import {
  frameworkFields,
  FRAMEWORK_VERSION,
  getFrameworkFields,
} from "../../framework/fields";
import { useLanguage } from "../../i18n/LanguageContext";
import { findResumableSession } from "../../domain/sessionLifecycle";
import { saveEvaluationRecord, saveRecord } from "../../storage/localStore";
import { useApp } from "../../state/AppContext";
import { ClosingSurvey, type ClosingValues } from "./ClosingSurvey";
import { FieldQuestion } from "./FieldQuestion";
import { SessionProgress } from "./SessionProgress";
import { SessionReview } from "./SessionReview";
import { TaxonomyReview } from "./TaxonomyReview";
import { STRUCTURED_ITEM_SET_VERSION } from "../../framework/structuredTaxonomy";
import { makeAuditEvent } from "../../domain/audit";
import {
  CORE_VERSION,
  PLATFORM_VERSION,
  SCHEMA_VERSION,
  TAXONOMY_VERSION,
} from "../../config/versions";
import { normalizeScientificStatus } from "../../domain/phase0Lifecycle";

function blank(fieldId: FieldId): FieldResponse {
  return {
    fieldId,
    narrativeAnswer: "",
    openComment: "",
    changeProposal: "",
    confidenceRating: null,
    relevance: null,
    clarity: null,
    exhaustiveness: null,
    redundancy: null,
    applicability: null,
    interpretationDifficulty: null,
    insufficientInformation: false,
    timeSpentSeconds: 0,
    revisionCount: 0,
    helpAccessedCount: 0,
    responseMode: "structured_narrative",
    observations: [],
    noObservationReason: null,
    overallSynthesis: null,
    fieldSummary: null,
  };
}
export function EvaluationFlow() {
  const { language, t } = useLanguage();
  const localizedFields = getFrameworkFields(language);
  const { scenarioId } = useParams();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const scenario = state.scenarios.find((s) => s.scenarioId === scenarioId);
  const round = state.rounds.find((value) => value.roundId === roundId);
  const study = state.studies.find((value) => value.studyId === round?.studyId);
  const assignment = state.roundScenarios.find(
    (value) =>
      value.roundId === roundId &&
      value.scenarioId === scenarioId &&
      value.scenarioVersion === scenario?.scenarioVersion,
  );
  const evaluatorPseudonym =
    localStorage.getItem("dpft:currentEvaluatorPseudonym") || "demo-evaluator";
  const resumableSession = round
    ? findResumableSession(
        state.sessions,
        evaluatorPseudonym,
        round.roundId,
        scenarioId ?? "",
      )
    : undefined;
  const [step, setStep] = useState<number | "review" | "taxonomy" | "closing">(
    0,
  );
  const [taxonomyItemRatings, setTaxonomyItemRatings] = useState<
    NonNullable<EvaluationSession["taxonomyItemRatings"]>
  >(() => resumableSession?.taxonomyItemRatings ?? {});
  const [taxonomyReview, setTaxonomyReview] = useState<
    NonNullable<EvaluationSession["taxonomyReview"]>
  >(
    () =>
      resumableSession?.taxonomyReview ?? {
        taxonomyItemRatings: [],
        missingItems: [],
        redundantItems: [],
      },
  );
  const [responses, setResponses] = useState(
    () =>
      resumableSession?.fieldResponses ??
      frameworkFields.map((f) => blank(f.fieldId)),
  );
  const startedAt = useMemo(
    () => resumableSession?.startedAt ?? new Date().toISOString(),
    [resumableSession?.startedAt],
  );
  const resumableSessionId = resumableSession?.sessionId;
  const previousResumedAt = resumableSession?.resumedAt;
  const resumedAt = useMemo(
    () =>
      resumableSessionId
        ? [...(previousResumedAt ?? []), new Date().toISOString()]
        : null,
    [previousResumedAt, resumableSessionId],
  );
  if (!scenario || !study || !round || !assignment)
    return (
      <main>
        <h1>{t("Scenario unavailable")}</h1>
      </main>
    );
  const saveDraft = (
    next: FieldResponse[],
    status: EvaluationSession["evaluationStatus"],
  ) => {
    const session = makeSession(
      resumableSession?.sessionId ?? crypto.randomUUID(),
      next,
      status,
    );
    saveEvaluationRecord(session);
    dispatch({ type: "session", value: session });
    return session;
  };
  const makeSession = (
    sessionId: string,
    next: FieldResponse[],
    status: EvaluationSession["evaluationStatus"],
    closing?: ClosingValues,
  ): EvaluationSession => ({
    sessionId,
    evaluatorPseudonym,
    studyId: resumableSession?.studyId ?? study.studyId,
    roundId: resumableSession?.roundId ?? round.roundId,
    scenarioId: scenario.scenarioId,
    scenarioVersion:
      resumableSession?.scenarioVersion ?? scenario.scenarioVersion,
    scenarioClass: resumableSession?.scenarioClass ?? scenario.scenarioClass,
    referenceSet: resumableSession?.referenceSet ?? scenario.referenceSet,
    studyAlignment: resumableSession?.studyAlignment ?? scenario.studyAlignment,
    instrumentVersion: resumableSession?.instrumentVersion ?? "1.1.0",
    frameworkVersion: resumableSession?.frameworkVersion ?? FRAMEWORK_VERSION,
    fieldDefinitionVersions:
      resumableSession?.fieldDefinitionVersions ??
      (Object.fromEntries(
        frameworkFields.map((f) => [f.fieldId, f.fieldDefinitionVersion]),
      ) as Record<FieldId, string>),
    evaluationStatus: status,
    evaluatorId: evaluatorPseudonym,
    institutionId: state.institutions.find(
      (institution) =>
        institution.studyId === study.studyId &&
        institution.institutionCode ===
          (localStorage.getItem("dpft:institutionCode") ?? ""),
    )?.institutionId,
    coreVersion: CORE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    taxonomyVersion: TAXONOMY_VERSION,
    scientificStatus: normalizeScientificStatus(status),
    metadata: resumableSession?.metadata ?? {
      appVersion: PLATFORM_VERSION,
      userAgent: navigator.userAgent,
      viewportClass: innerWidth >= 1024 ? "desktop" : "tablet",
      locale: navigator.language,
    },
    fieldResponses: next,
    nasaTlx: closing
      ? (Object.fromEntries(
          [
            "mental",
            "physical",
            "temporal",
            "performance",
            "effort",
            "frustration",
          ].map((key, i) => [key, closing.rtlx[i]]),
        ) as EvaluationSession["nasaTlx"])
      : null,
    sus: closing ? { itemScores: closing.sus } : null,
    openFeedback: {
      burden: closing?.burden ?? "",
      ambiguity: closing?.ambiguity ?? "",
      usefulness: closing?.usefulness ?? "",
    },
    fictionalScenarioConfirmed: closing?.confirmed ?? false,
    startedAt,
    reviewedAt:
      status === "in_review" ||
      status === "completed" ||
      status === "submitted" ||
      status === "resubmitted"
        ? new Date().toISOString()
        : null,
    finishedAt:
      status === "completed" ||
      status === "submitted" ||
      status === "resubmitted"
        ? new Date().toISOString()
        : null,
    abandonedAt: null,
    resumedAt,
    dataSchemaVersion: "1.2",
    structuredItemSetVersion: STRUCTURED_ITEM_SET_VERSION,
    completedAt:
      status === "completed" ||
      status === "submitted" ||
      status === "resubmitted"
        ? new Date().toISOString()
        : null,
    documentSnapshots:
      resumableSession?.documentSnapshots ??
      state.documentLinks
        .filter(
          (link) =>
            (!link.studyId || link.studyId === study.studyId) &&
            (!link.scenarioId || link.scenarioId === scenario.scenarioId),
        )
        .map((link) => ({
          documentId: link.documentId,
          documentVersion: link.documentVersion,
          documentHash:
            state.documents.find(
              (document) =>
                document.documentId === link.documentId &&
                document.version === link.documentVersion,
            )?.checksum ?? "unavailable",
        })),
    taxonomyItemRatings,
    taxonomyReview: {
      ...taxonomyReview,
      taxonomyItemRatings: Object.values(taxonomyItemRatings).flat(),
    },
    submittedAt:
      status === "submitted" || status === "resubmitted"
        ? new Date().toISOString()
        : null,
    lockedAt: null,
    exclusionReason: null,
    assignedEvaluatorId: state.profiles.find(
      (profile) =>
        profile.pseudonym === evaluatorPseudonym &&
        profile.role === "evaluator",
    )?.profileId,
  });
  if (step === "review")
    return (
      <SessionReview
        responses={responses}
        onEdit={setStep}
        onContinue={() => setStep("taxonomy")}
      />
    );
  if (step === "taxonomy")
    return (
      <TaxonomyReview
        values={taxonomyItemRatings}
        onChange={setTaxonomyItemRatings}
        review={taxonomyReview}
        onReviewChange={setTaxonomyReview}
        onContinue={() => setStep("closing")}
      />
    );
  if (step === "closing")
    return (
      <ClosingSurvey
        includeRtlx={study.config.includeRtlx}
        includeSus={study.config.includeSus}
        onSubmit={(closing) => {
          const existing = saveDraft(responses, "in_progress");
          const completed = makeSession(
            existing.sessionId,
            responses,
            resumableSession?.evaluationStatus === "returned_for_revision"
              ? "resubmitted"
              : "submitted",
            closing,
          );
          saveEvaluationRecord(completed);
          dispatch({ type: "session", value: completed });
          const audit = makeAuditEvent(
            "submission",
            "evaluation",
            completed.sessionId,
            { studyId: completed.studyId, status: completed.evaluationStatus },
          );
          saveRecord("audit", audit.auditEventId, audit);
          dispatch({ type: "audit", value: audit });
          navigate("/evaluator");
        }}
      />
    );
  return (
    <>
      <SessionProgress current={step} />
      <FieldQuestion
        field={localizedFields[step]}
        response={responses[step]}
        position={step}
        onChange={(value) => {
          const next = [...responses];
          next[step] = value;
          setResponses(next);
          saveDraft(next, "in_progress");
        }}
        onBack={() => setStep(Math.max(0, step - 1))}
        onNext={() => {
          if (step === 5) {
            saveDraft(responses, "in_review");
            setStep("review");
          } else setStep(step + 1);
        }}
      />
    </>
  );
}
