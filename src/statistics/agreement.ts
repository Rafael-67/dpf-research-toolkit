export interface KappaResult {
  value: number;
  observedAgreement: number;
  expectedAgreement: number;
}

export function cohensKappa(raterA: string[], raterB: string[]): KappaResult {
  if (raterA.length !== raterB.length || raterA.length === 0)
    throw new Error("Raters must have equal, non-zero observations.");
  const categories = new Set([...raterA, ...raterB]);
  const n = raterA.length;
  let matches = 0;
  let expected = 0;
  for (let i = 0; i < n; i += 1) if (raterA[i] === raterB[i]) matches += 1;
  for (const category of categories) {
    expected +=
      (raterA.filter((value) => value === category).length / n) *
      (raterB.filter((value) => value === category).length / n);
  }
  const observed = matches / n;
  return {
    value: expected === 1 ? 1 : (observed - expected) / (1 - expected),
    observedAgreement: observed,
    expectedAgreement: expected,
  };
}

export function fleissKappa(counts: number[][]): KappaResult {
  if (counts.length === 0 || counts[0].length < 2)
    throw new Error("At least one subject and two categories are required.");
  const raters = counts[0].reduce((sum, value) => sum + value, 0);
  if (
    raters < 2 ||
    counts.some(
      (row) =>
        row.length !== counts[0].length ||
        row.reduce((a, b) => a + b, 0) !== raters,
    )
  )
    throw new Error("Each subject must have the same number of raters.");
  const observed =
    counts.reduce(
      (sum, row) =>
        sum +
        row.reduce((s, value) => s + value * (value - 1), 0) /
          (raters * (raters - 1)),
      0,
    ) / counts.length;
  const totals = counts[0].map((_, index) =>
    counts.reduce((sum, row) => sum + row[index], 0),
  );
  const expected = totals.reduce(
    (sum, total) => sum + (total / (counts.length * raters)) ** 2,
    0,
  );
  return {
    value: expected === 1 ? 1 : (observed - expected) / (1 - expected),
    observedAgreement: observed,
    expectedAgreement: expected,
  };
}

export function percentAgreement(a: string[], b: string[]): number {
  return cohensKappa(a, b).observedAgreement * 100;
}
