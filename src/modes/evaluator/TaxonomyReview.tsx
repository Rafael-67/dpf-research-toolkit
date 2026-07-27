import { useState } from "react";
import type {
  EvaluationSession,
  FieldId,
  OrdinalRating5,
  StructuredTaxonomyItemRating,
  TaxonomyReview as TaxonomyReviewValue,
} from "../../domain/types";
import {
  fieldTaxonomies,
  taxonomyGroupsFor,
} from "../../framework/structuredTaxonomy";

export function TaxonomyReview({
  values,
  onChange,
  onContinue,
  review,
  onReviewChange,
}: {
  values: NonNullable<EvaluationSession["taxonomyItemRatings"]>;
  onChange: (
    value: NonNullable<EvaluationSession["taxonomyItemRatings"]>,
  ) => void;
  onContinue: () => void;
  review: TaxonomyReviewValue;
  onReviewChange: (value: TaxonomyReviewValue) => void;
}) {
  const [proposalField, setProposalField] = useState<FieldId>("F1");
  const [missingProposal, setMissingProposal] = useState("");
  const [redundantFirst, setRedundantFirst] = useState("");
  const [redundantSecond, setRedundantSecond] = useState("");
  const set = (
    fieldId: FieldId,
    taxonomyGroup: string,
    item: string,
    key: "relevance" | "clarity" | "distinctiveness",
    rating: OrdinalRating5,
  ) => {
    const current = values[fieldId] ?? [];
    const existing = current.find(
      (value) =>
        "taxonomyItemValue" in value &&
        value.taxonomyGroup === taxonomyGroup &&
        value.taxonomyItemValue === item,
    ) as StructuredTaxonomyItemRating | undefined;
    const next: StructuredTaxonomyItemRating = {
      fieldId,
      taxonomyGroup,
      taxonomyItemValue: item,
      relevance: existing?.relevance ?? 3,
      clarity: existing?.clarity ?? 3,
      distinctiveness: existing?.distinctiveness ?? 3,
      ...existing,
      [key]: rating,
    };
    onChange({
      ...values,
      [fieldId]: [
        ...current.filter(
          (value) =>
            !(
              "taxonomyItemValue" in value &&
              value.taxonomyGroup === taxonomyGroup &&
              value.taxonomyItemValue === item
            ),
        ),
        next,
      ],
    });
  };
  const complete = (Object.keys(fieldTaxonomies) as FieldId[]).every(
    (fieldId) =>
      taxonomyGroupsFor(fieldId).every(({ taxonomyGroup, values: items }) =>
        items.every((item) => {
          const rating = values[fieldId]?.find(
            (value) =>
              "taxonomyItemValue" in value &&
              value.taxonomyGroup === taxonomyGroup &&
              value.taxonomyItemValue === item,
          );
          return (
            rating &&
            "relevance" in rating &&
            rating.relevance &&
            rating.clarity &&
            rating.distinctiveness
          );
        }),
      ),
  );
  return (
    <main>
      <h1>Taxonomy item validation</h1>
      <p className="notice">
        Taxonomy 0.1-exploratory contains candidate, revisable items. Rate
        relevance, clarity and distinctiveness separately. Selection frequency
        is not a relevance rating and no total score is calculated.
      </p>
      {(Object.keys(fieldTaxonomies) as FieldId[]).map((fieldId) => (
        <section key={fieldId}>
          <h2>{fieldId}</h2>
          {taxonomyGroupsFor(fieldId).map(
            ({ taxonomyGroup, values: items }) => (
              <details key={taxonomyGroup}>
                <summary>{taxonomyGroup.replaceAll("_", " ")}</summary>
                {items.map((item) => {
                  const rating = values[fieldId]?.find(
                    (value) =>
                      "taxonomyItemValue" in value &&
                      value.taxonomyGroup === taxonomyGroup &&
                      value.taxonomyItemValue === item,
                  ) as StructuredTaxonomyItemRating | undefined;
                  return (
                    <fieldset className="card" key={item}>
                      <legend>{item.replaceAll("_", " ")}</legend>
                      {(
                        ["relevance", "clarity", "distinctiveness"] as const
                      ).map((key) => (
                        <label key={key}>
                          {key} (1–5)
                          <select
                            value={rating?.[key] ?? ""}
                            onChange={(event) =>
                              set(
                                fieldId,
                                taxonomyGroup,
                                item,
                                key,
                                Number(event.target.value) as OrdinalRating5,
                              )
                            }
                          >
                            <option value="">Not rated</option>
                            {[1, 2, 3, 4, 5].map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </fieldset>
                  );
                })}
              </details>
            ),
          )}
        </section>
      ))}
      <section className="card">
        <h2>Candidate taxonomy proposals</h2>
        <p>
          Proposals are stored as validation data; they do not change the
          current taxonomy automatically.
        </p>
        <label>
          Field
          <select
            value={proposalField}
            onChange={(event) =>
              setProposalField(event.target.value as FieldId)
            }
          >
            {(["F1", "F2", "F3", "F4", "F5", "F6"] as FieldId[]).map(
              (field) => (
                <option key={field}>{field}</option>
              ),
            )}
          </select>
        </label>
        <label>
          Missing candidate item
          <input
            value={missingProposal}
            onChange={(event) => setMissingProposal(event.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={!missingProposal.trim()}
          onClick={() => {
            onReviewChange({
              ...review,
              missingItems: [
                ...review.missingItems,
                {
                  fieldId: proposalField,
                  taxonomyGroup: "primary_category",
                  proposedValue: missingProposal.trim(),
                },
              ],
            });
            setMissingProposal("");
          }}
        >
          Add missing-item proposal
        </button>
        <label>
          First potentially redundant item
          <input
            value={redundantFirst}
            onChange={(event) => setRedundantFirst(event.target.value)}
          />
        </label>
        <label>
          Second potentially redundant item
          <input
            value={redundantSecond}
            onChange={(event) => setRedundantSecond(event.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={!redundantFirst.trim() || !redundantSecond.trim()}
          onClick={() => {
            onReviewChange({
              ...review,
              redundantItems: [
                ...review.redundantItems,
                {
                  fieldId: proposalField,
                  taxonomyGroup: "primary_category",
                  firstItemValue: redundantFirst.trim(),
                  secondItemValue: redundantSecond.trim(),
                  rationale: "Evaluator-proposed overlap for scientific review",
                },
              ],
            });
            setRedundantFirst("");
            setRedundantSecond("");
          }}
        >
          Add redundancy proposal
        </button>
      </section>
      {!complete && (
        <p className="notice">
          Unrated taxonomy items will remain explicit missing validation data.
        </p>
      )}
      <button onClick={onContinue}>Continue to closing survey</button>
    </main>
  );
}
