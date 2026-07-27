import { useEffect, useRef, useState } from "react";
import type {
  FieldResponse,
  FrameworkFieldDefinition,
} from "../../domain/types";
import { RatingScale } from "../../shared/RatingScale";
import { useLanguage } from "../../i18n/LanguageContext";
import { ObservationEditor } from "./ObservationEditor";
import { checkObservationConsistency } from "../../domain/consistency";

export function FieldQuestion({
  field,
  response,
  position,
  onChange,
  onBack,
  onNext,
}: {
  field: FrameworkFieldDefinition;
  response: FieldResponse;
  position: number;
  onChange: (value: FieldResponse) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useLanguage();
  const heading = useRef<HTMLHeadingElement>(null);
  const [error, setError] = useState("");
  useEffect(() => heading.current?.focus(), [field.fieldId]);
  const set = <K extends keyof FieldResponse>(
    key: K,
    value: FieldResponse[K],
  ) =>
    onChange({
      ...response,
      [key]: value,
      revisionCount: response.revisionCount + 1,
    });
  const continueIfComplete = () => {
    if (!response.observations?.length && !response.noObservationReason) {
      setError(
        "Add at least one observation or select a no-observation reason.",
      );
      return;
    }
    if (
      response.observations?.length &&
      !response.fieldSummary?.reasoningSummary.trim()
    ) {
      setError("Complete the required field reasoning summary.");
      return;
    }
    const ratings = [
      response.confidenceRating,
      response.relevance,
      response.clarity,
      response.exhaustiveness,
      response.redundancy,
      response.applicability,
      response.interpretationDifficulty,
    ];
    if (
      !response.insufficientInformation &&
      ratings.some((value) => value === null)
    ) {
      setError(t("Answer every rating or mark insufficient information."));
      return;
    }
    setError("");
    onNext();
  };
  return (
    <main>
      <p className="eyebrow">
        {t("Field {current} of 6", { current: position + 1 })}
      </p>
      <h1 ref={heading} tabIndex={-1}>
        {field.name}
      </h1>
      <p className="lead">{field.promptText}</p>
      <p className="notice">
        {t(
          "Do not enter select-agent information or non-public protocol details. Use only the demo/fictional scenario as written.",
        )}
      </p>
      <div className="form-card">
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
        <>
          <p className="notice">
            Taxonomy 0.1-exploratory · Structured ratings support comparison and
            validation. They are not a biological-risk score, containment
            decision, or validated safety assessment.
          </p>
          {(response.observations ?? []).map((observation, index) => {
            const current =
              "observationId" in observation ? observation : undefined;
            const category = current
              ? current.category.value
              : typeof observation.category === "string"
                ? observation.category
                : observation.category.value;
            const findings = checkObservationConsistency(observation);
            return (
              <details
                className="card"
                key={
                  current?.observationId ??
                  ("id" in observation ? observation.id : index)
                }
              >
                <summary>
                  Observation {index + 1}: {category}
                </summary>
                <p>
                  {observation.taskPhases.map(({ value }) => value).join(", ")}{" "}
                  · Relevance:{" "}
                  {current?.ratings.analyticalRelevance ??
                    ("analyticalRelevance" in observation
                      ? observation.analyticalRelevance
                      : "")}
                  {current ? "/5" : ""} · Certainty:{" "}
                  {current?.ratings.evaluatorCertainty ??
                    ("evaluatorCertainty" in observation
                      ? observation.evaluatorCertainty
                      : "")}
                  {current ? "/5" : ""}
                </p>
                {findings.map((finding) => (
                  <p className="notice" key={`${finding.code}-${finding.path}`}>
                    {finding.message} ({finding.path})
                  </p>
                ))}
                <p>
                  {current?.reasoningSummary ??
                    ("rationale" in observation ? observation.rationale : "")}
                </p>
                <div className="toolbar">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      set("observations", [
                        ...(response.observations ?? []),
                        {
                          ...observation,
                          ...(current
                            ? { observationId: crypto.randomUUID() }
                            : { id: crypto.randomUUID() }),
                          createdAt: new Date().toISOString(),
                        },
                      ])
                    }
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...(response.observations ?? [])];
                      [next[index - 1], next[index]] = [
                        next[index],
                        next[index - 1],
                      ];
                      set("observations", next);
                    }}
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    disabled={
                      index === (response.observations?.length ?? 0) - 1
                    }
                    onClick={() => {
                      const next = [...(response.observations ?? [])];
                      [next[index], next[index + 1]] = [
                        next[index + 1],
                        next[index],
                      ];
                      set("observations", next);
                    }}
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete observation ${index + 1}? This cannot be undone.`,
                        )
                      )
                        set(
                          "observations",
                          response.observations?.filter((_, i) => i !== index),
                        );
                    }}
                  >
                    Delete
                  </button>
                </div>
              </details>
            );
          })}
          <ObservationEditor
            fieldId={field.fieldId}
            onSave={(observation) =>
              set("observations", [
                ...(response.observations ?? []),
                observation,
              ])
            }
          />
          <label>
            No-observation reason
            <select
              value={response.noObservationReason ?? ""}
              onChange={(event) =>
                set(
                  "noObservationReason",
                  (event.target.value ||
                    null) as FieldResponse["noObservationReason"],
                )
              }
            >
              <option value="">Not selected</option>
              <option value="insufficient_information">
                Insufficient information
              </option>
              <option value="field_not_applicable">Field not applicable</option>
            </select>
          </label>
          <label>
            Overall field synthesis (optional, ≤ 200 words)
            <textarea
              value={response.overallSynthesis ?? ""}
              onChange={(event) => set("overallSynthesis", event.target.value)}
            />
          </label>
          {!!response.observations?.length && (
            <fieldset>
              <legend>Field-level summary</legend>
              {[
                ["overallAnalyticalRelevance", "Overall analytical relevance"],
                ["informationSufficiency", "Information sufficiency"],
                [
                  "internalConsistencyOfEvidence",
                  "Internal consistency of evidence",
                ],
                ["consensusPriority", "Consensus priority"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label} (1–5)
                  <select
                    value={
                      response.fieldSummary?.[
                        key as
                          | "overallAnalyticalRelevance"
                          | "informationSufficiency"
                          | "internalConsistencyOfEvidence"
                          | "consensusPriority"
                      ] ?? 3
                    }
                    onChange={(event) =>
                      set("fieldSummary", {
                        fieldId: response.fieldId,
                        dominantCategories:
                          response.fieldSummary?.dominantCategories ??
                          response.observations!.map((item) =>
                            typeof item.category === "string"
                              ? { value: item.category }
                              : item.category,
                          ),
                        overallAnalyticalRelevance:
                          response.fieldSummary?.overallAnalyticalRelevance ??
                          3,
                        informationSufficiency:
                          response.fieldSummary?.informationSufficiency ?? 3,
                        internalConsistencyOfEvidence:
                          response.fieldSummary
                            ?.internalConsistencyOfEvidence ?? 3,
                        consensusPriority:
                          response.fieldSummary?.consensusPriority ?? 3,
                        reasoningSummary:
                          response.fieldSummary?.reasoningSummary ?? "",
                        ...{
                          [key]: Number(event.target.value),
                        },
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              ))}
              <label>
                Field reasoning summary *
                <textarea
                  maxLength={500}
                  value={response.fieldSummary?.reasoningSummary ?? ""}
                  onChange={(event) =>
                    set("fieldSummary", {
                      fieldId: response.fieldId,
                      dominantCategories: response.observations!.map((item) =>
                        typeof item.category === "string"
                          ? { value: item.category }
                          : item.category,
                      ),
                      overallAnalyticalRelevance:
                        response.fieldSummary?.overallAnalyticalRelevance ?? 3,
                      informationSufficiency:
                        response.fieldSummary?.informationSufficiency ?? 3,
                      internalConsistencyOfEvidence:
                        response.fieldSummary?.internalConsistencyOfEvidence ??
                        3,
                      consensusPriority:
                        response.fieldSummary?.consensusPriority ?? 3,
                      reasoningSummary: event.target.value,
                      extendedComments: response.fieldSummary?.extendedComments,
                    })
                  }
                />
              </label>
              <details>
                <summary>Extended field comments (optional)</summary>
                <textarea
                  maxLength={2000}
                  value={response.fieldSummary?.extendedComments ?? ""}
                  onChange={(event) =>
                    response.fieldSummary &&
                    set("fieldSummary", {
                      ...response.fieldSummary,
                      extendedComments: event.target.value,
                    })
                  }
                />
              </details>
            </fieldset>
          )}
        </>
        <label>
          {t("Open comment")}
          <textarea
            value={response.openComment}
            onChange={(e) => set("openComment", e.target.value)}
          />
        </label>
        <label>
          {t("Suggested change")}
          <textarea
            value={response.changeProposal}
            onChange={(e) => set("changeProposal", e.target.value)}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={response.insufficientInformation}
            onChange={(e) =>
              onChange({
                ...response,
                insufficientInformation: e.target.checked,
                noObservationReason: e.target.checked
                  ? "insufficient_information"
                  : response.noObservationReason,
                revisionCount: response.revisionCount + 1,
              })
            }
          />
          {t("Insufficient information to rate this field")}
        </label>
        {!response.insufficientInformation && (
          <div className="rating-grid">
            <RatingScale
              name={`${field.fieldId}-confidence`}
              label={t("Confidence")}
              value={response.confidenceRating}
              max={4}
              onChange={(v) => set("confidenceRating", v)}
            />
            <RatingScale
              name={`${field.fieldId}-relevance`}
              label={t("Relevance")}
              value={response.relevance}
              max={4}
              onChange={(v) => set("relevance", v)}
            />
            <RatingScale
              name={`${field.fieldId}-clarity`}
              label={t("Clarity")}
              value={response.clarity}
              max={4}
              onChange={(v) => set("clarity", v)}
            />
            <RatingScale
              name={`${field.fieldId}-exhaustiveness`}
              label={t("Exhaustiveness")}
              value={response.exhaustiveness}
              max={4}
              onChange={(v) => set("exhaustiveness", v)}
            />
            <RatingScale
              name={`${field.fieldId}-redundancy`}
              label={t("Redundancy")}
              value={response.redundancy}
              max={4}
              onChange={(v) => set("redundancy", v)}
            />
            <RatingScale
              name={`${field.fieldId}-applicability`}
              label={t("Applicability")}
              value={response.applicability}
              max={4}
              onChange={(v) => set("applicability", v)}
            />
            <RatingScale
              name={`${field.fieldId}-difficulty`}
              label={t("Interpretation difficulty")}
              value={response.interpretationDifficulty}
              max={4}
              onChange={(v) => set("interpretationDifficulty", v)}
            />
          </div>
        )}
        <div className="actions">
          <button
            type="button"
            className="secondary"
            disabled={position === 0}
            onClick={onBack}
          >
            {t("Previous")}
          </button>
          <button type="button" onClick={continueIfComplete}>
            {position === 5 ? t("Review responses") : t("Next field")}
          </button>
        </div>
      </div>
    </main>
  );
}
