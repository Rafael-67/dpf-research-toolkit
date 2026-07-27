import type { EvaluationSession, OrdinalRating5 } from "../domain/types";
import { descriptives } from "./descriptives";

export interface FrequencyRow {
  value: string;
  count: number;
  percentage: number;
}

export function frequencies(values: string[]): FrequencyRow[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts].map(([value, count]) => ({
    value,
    count,
    percentage: values.length ? (count / values.length) * 100 : 0,
  }));
}

export function ordinalSummary(
  values: Array<OrdinalRating5 | null | undefined>,
) {
  const observed = values.filter(
    (value): value is OrdinalRating5 => value !== null && value !== undefined,
  );
  return {
    total: values.length,
    missing: values.length - observed.length,
    ...(observed.length
      ? descriptives(observed)
      : {
          count: 0,
          median: null,
          q1: null,
          q3: null,
          iqr: null,
          min: null,
          max: null,
        }),
  };
}

export function jaccardSimilarity(left: string[], right: string[]): number {
  const a = new Set(left);
  const b = new Set(right);
  const union = new Set([...a, ...b]);
  if (!union.size) return 1;
  return [...a].filter((value) => b.has(value)).length / union.size;
}

export function exactSetAgreement(left: string[], right: string[]): boolean {
  return jaccardSimilarity(left, right) === 1;
}

export function ordinalDifference(left: number, right: number): number {
  return Math.abs(left - right);
}

export function weightedKappa(
  left: number[],
  right: number[],
  scalePoints = 5,
): number {
  if (!left.length || left.length !== right.length)
    throw new Error("Weighted kappa requires paired non-empty ratings.");
  const n = left.length;
  const weights = (a: number, b: number) =>
    1 - ((a - b) / (scalePoints - 1)) ** 2;
  const observed =
    left.reduce((sum, value, index) => sum + weights(value, right[index]), 0) /
    n;
  const leftCounts = Array.from(
    { length: scalePoints },
    (_, index) => left.filter((value) => value === index + 1).length / n,
  );
  const rightCounts = Array.from(
    { length: scalePoints },
    (_, index) => right.filter((value) => value === index + 1).length / n,
  );
  let expected = 0;
  leftCounts.forEach((a, i) =>
    rightCounts.forEach((b, j) => {
      expected += a * b * weights(i + 1, j + 1);
    }),
  );
  return expected === 1 ? 1 : (observed - expected) / (1 - expected);
}

export function krippendorffAlphaNominal(
  rows: Array<Array<string | null>>,
): number | null {
  const pairs: Array<[string, string]> = [];
  rows.forEach((row) => {
    const values = row.filter((value): value is string => value !== null);
    for (let i = 0; i < values.length; i += 1)
      for (let j = i + 1; j < values.length; j += 1)
        pairs.push([values[i], values[j]]);
  });
  if (!pairs.length) return null;
  const observedDisagreement =
    pairs.filter(([a, b]) => a !== b).length / pairs.length;
  const all = rows.flat().filter((value): value is string => value !== null);
  const proportions = frequencies(all).map(({ count }) => count / all.length);
  const expectedDisagreement =
    1 - proportions.reduce((sum, value) => sum + value ** 2, 0);
  return expectedDisagreement === 0
    ? 1
    : 1 - observedDisagreement / expectedDisagreement;
}

export function iccOneWayRandom(rows: number[][]): number | null {
  if (rows.length < 2 || rows[0]?.length < 2) return null;
  const raters = rows[0].length;
  if (rows.some((row) => row.length !== raters)) return null;
  const subjectMeans = rows.map(
    (row) => row.reduce((sum, value) => sum + value, 0) / raters,
  );
  const grandMean =
    subjectMeans.reduce((sum, value) => sum + value, 0) / rows.length;
  const between =
    (raters *
      subjectMeans.reduce((sum, value) => sum + (value - grandMean) ** 2, 0)) /
    (rows.length - 1);
  const within =
    rows.reduce(
      (sum, row, index) =>
        sum +
        row.reduce(
          (rowSum, value) => rowSum + (value - subjectMeans[index]) ** 2,
          0,
        ),
      0,
    ) /
    (rows.length * (raters - 1));
  const denominator = between + (raters - 1) * within;
  return denominator === 0 ? 1 : (between - within) / denominator;
}

export function disagreementRows(
  left: Array<{ key: string; values: string[] }>,
  right: Array<{ key: string; values: string[] }>,
) {
  const rightByKey = new Map(right.map((row) => [row.key, row.values]));
  return left.flatMap((row) => {
    const comparison = rightByKey.get(row.key);
    if (!comparison) return [];
    const jaccard = jaccardSimilarity(row.values, comparison);
    return jaccard === 1
      ? []
      : [{ key: row.key, left: row.values, right: comparison, jaccard }];
  });
}

export function structuredSelectionValues(sessions: EvaluationSession[]) {
  return sessions.flatMap((session) =>
    session.fieldResponses.flatMap((field) =>
      (field.observations ?? []).flatMap((observation) => {
        if (!("observationId" in observation)) return [];
        return Object.entries(observation).flatMap(([group, value]) =>
          Array.isArray(value)
            ? value
                .filter(
                  (item): item is { value: string } =>
                    !!item && typeof item === "object" && "value" in item,
                )
                .map((item) => ({
                  sessionId: session.sessionId,
                  scenarioId: session.scenarioId,
                  fieldId: field.fieldId,
                  group,
                  value: item.value,
                }))
            : [],
        );
      }),
    ),
  );
}
