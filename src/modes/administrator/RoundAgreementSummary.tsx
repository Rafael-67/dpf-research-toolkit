import { useParams } from "react-router-dom";
import type { FieldId, RatingVariable } from "../../domain/types";
import { getFrameworkFields } from "../../framework/fields";
import { cohensKappa, fleissKappa } from "../../statistics/agreement";
import {
  frequencies,
  jaccardSimilarity,
  ordinalSummary,
  structuredSelectionValues,
} from "../../statistics/structuredAnalysis";
import { taxonomyGroupsFor } from "../../framework/structuredTaxonomy";
import { useApp } from "../../state/AppContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { isSubmittedEvaluation } from "../../domain/sessionLifecycle";

const variables: RatingVariable[] = [
  "confidenceRating",
  "relevance",
  "clarity",
  "exhaustiveness",
  "redundancy",
  "applicability",
  "interpretationDifficulty",
];
export function RoundAgreementSummary() {
  const { language, t } = useLanguage();
  const frameworkFields = getFrameworkFields(language);
  const { roundId } = useParams();
  const { state } = useApp();
  const round = state.rounds.find((r) => r.roundId === roundId);
  const sessions = state.sessions.filter(
    (s) =>
      s.roundId === roundId &&
      isSubmittedEvaluation(s.evaluationStatus) &&
      s.evaluationStatus !== "excluded_from_analysis",
  );
  if (!round)
    return (
      <main>
        <h1>{t("Round not found")}</h1>
      </main>
    );
  return (
    <main>
      <p className="eyebrow">{t("Descriptive statistics only")}</p>
      <h1>{t("Round agreement summary")}</h1>
      {round.status !== "locked" ? (
        <p className="notice">
          {t("Lock this round before statistics are calculated.")}
        </p>
      ) : sessions.length < 2 ? (
        <p className="notice">
          {sessions.length}{" "}
          {t("completed sessions; Cohen's κ requires at least 2.")}
        </p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("Field")}</th>
                <th>{t("Rating")}</th>
                <th>{t("Pairwise Cohen's κ")}</th>
                <th>{t("Fleiss' κ")}</th>
              </tr>
            </thead>
            <tbody>
              {frameworkFields.flatMap((field) =>
                variables.map((variable) => (
                  <AgreementRow
                    key={`${field.fieldId}-${variable}`}
                    fieldId={field.fieldId}
                    fieldName={field.name}
                    variable={variable}
                    sessions={sessions}
                  />
                )),
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="footnote">
        {t(
          "Values are descriptive and do not accept or reject any field, round, or framework.",
        )}
      </p>
      <StructuredSummary sessions={sessions} />
      <TaxonomyAnalysis sessions={sessions} />
      <EvaluatorComparisonTable sessions={sessions} />
    </main>
  );
}

function EvaluatorComparisonTable({
  sessions,
}: {
  sessions: ReturnType<typeof useApp>["state"]["sessions"];
}) {
  const rows = sessions.flatMap((left, leftIndex) =>
    sessions.slice(leftIndex + 1).flatMap((right) => {
      if (left.scenarioId !== right.scenarioId) return [];
      return (["F1", "F2", "F3", "F4", "F5", "F6"] as FieldId[]).map(
        (fieldId) => {
          const categories = (session: typeof left) =>
            session.fieldResponses
              .find((response) => response.fieldId === fieldId)
              ?.observations?.map((observation) =>
                typeof observation.category === "string"
                  ? observation.category
                  : observation.category.value,
              ) ?? [];
          const leftValues = categories(left);
          const rightValues = categories(right);
          const similarity = jaccardSimilarity(leftValues, rightValues);
          return {
            key: `${left.sessionId}:${right.sessionId}:${fieldId}`,
            scenarioId: left.scenarioId,
            fieldId,
            left: left.evaluatorPseudonym,
            right: right.evaluatorPseudonym,
            exact: similarity === 1,
            similarity,
          };
        },
      );
    }),
  );
  return (
    <section>
      <h2>Evaluator comparison table</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Field</th>
              <th>Evaluator A</th>
              <th>Evaluator B</th>
              <th>Exact set agreement</th>
              <th>Jaccard similarity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>{row.scenarioId}</td>
                <td>{row.fieldId}</td>
                <td>{row.left}</td>
                <td>{row.right}</td>
                <td>{String(row.exact)}</td>
                <td>{row.similarity.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="notice">
        Similarity values are descriptive. No automatic interpretation is
        applied.
      </p>
    </section>
  );
}

function TaxonomyAnalysis({
  sessions,
}: {
  sessions: ReturnType<typeof useApp>["state"]["sessions"];
}) {
  const ratings = sessions.flatMap((session) =>
    Object.values(session.taxonomyItemRatings ?? {})
      .flat()
      .filter(
        (rating) => "taxonomyItemValue" in rating && "relevance" in rating,
      ),
  );
  const selected = new Set(
    structuredSelectionValues(sessions).map(
      ({ fieldId, group, value }) => `${fieldId}:${group}:${value}`,
    ),
  );
  const unused = (["F1", "F2", "F3", "F4", "F5", "F6"] as FieldId[]).flatMap(
    (fieldId) =>
      taxonomyGroupsFor(fieldId).flatMap(({ taxonomyGroup, values }) =>
        values
          .filter(
            (value) => !selected.has(`${fieldId}:${taxonomyGroup}:${value}`),
          )
          .map((value) => `${fieldId}:${taxonomyGroup}:${value}`),
      ),
  );
  const otherCount = structuredSelectionValues(sessions).filter(({ value }) =>
    value.startsWith("other"),
  ).length;
  const summary = ordinalSummary(
    ratings.map((rating) => ("relevance" in rating ? rating.relevance : null)),
  );
  return (
    <section>
      <h2>Taxonomy validation inputs</h2>
      <p>
        Explicit item ratings: {ratings.length} · Unused candidate items:{" "}
        {unused.length} · Other selections: {otherCount}
      </p>
      <p>
        Relevance median: {summary.median ?? "not available"} · IQR:{" "}
        {summary.iqr ?? "not available"} · Missing: {summary.missing}
      </p>
      <details>
        <summary>Unused candidate items</summary>
        <ul>
          {unused.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
function AgreementRow({
  fieldId,
  fieldName,
  variable,
  sessions,
}: {
  fieldId: FieldId;
  fieldName: string;
  variable: RatingVariable;
  sessions: ReturnType<typeof useApp>["state"]["sessions"];
}) {
  const { t } = useLanguage();
  const byScenario = new Map<string, string[]>();
  sessions.forEach((session) => {
    const response = session.fieldResponses.find(
      (item) => item.fieldId === fieldId,
    );
    if (
      response &&
      !response.insufficientInformation &&
      response[variable] !== null
    )
      byScenario.set(session.scenarioId, [
        ...(byScenario.get(session.scenarioId) ?? []),
        String(response[variable]),
      ]);
  });
  const values = [...byScenario.values()].filter(
    (ratings) => ratings.length === sessions.length,
  );
  const a = values.map((v) => v[0]);
  const b = values.map((v) => v[1]);
  const pair = a.length ? cohensKappa(a, b).value : null;
  let multi: number | null = null;
  if (sessions.length >= 3 && values.length) {
    const categories = ["1", "2", "3", "4"];
    multi = fleissKappa(
      values.map((ratings) =>
        categories.map(
          (cat) => ratings.filter((value) => value === cat).length,
        ),
      ),
    ).value;
  }
  const display = (value: number | null) =>
    value === null ? t("Not enough comparable data") : value.toFixed(3);
  return (
    <tr>
      <th scope="row">{fieldName}</th>
      <td>{t(variable)}</td>
      <td>{display(pair)}</td>
      <td>
        {sessions.length < 3
          ? t("Requires 3 completed sessions")
          : display(multi)}
      </td>
    </tr>
  );
}

function StructuredSummary({
  sessions,
}: {
  sessions: ReturnType<typeof useApp>["state"]["sessions"];
}) {
  const selections = structuredSelectionValues(sessions);
  const rows = frequencies(selections.map(({ value }) => value));
  const observations = sessions.flatMap((session) =>
    session.fieldResponses.flatMap((field) => field.observations ?? []),
  );
  const missingEvidence = observations.filter(
    (observation) =>
      "observationId" in observation && !observation.evidenceSources.length,
  ).length;
  return (
    <section>
      <h2>Structured dataset descriptives</h2>
      <p>
        Sessions: {sessions.length} · Observations: {observations.length} ·
        Missing evidence: {missingEvidence}
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Selection value</th>
              <th>Frequency</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.value}>
                <th scope="row">{row.value}</th>
                <td>{row.count}</td>
                <td>{row.percentage.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="notice">
        Values are reported without automatic methodological or scientific
        interpretation.
      </p>
    </section>
  );
}
