export interface Descriptives {
  count: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
}

function quantile(sorted: number[], probability: number): number {
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

export function descriptives(values: number[]): Descriptives {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value)))
    throw new Error("Descriptives require at least one finite value.");
  const sorted = [...values].sort((a, b) => a - b);
  const counts = new Map<number, number>();
  sorted.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  const highest = Math.max(...counts.values());
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  return {
    count: sorted.length,
    mean: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
    median: quantile(sorted, 0.5),
    modes: [...counts]
      .filter(([, count]) => count === highest)
      .map(([value]) => value),
    min: sorted[0],
    max: sorted.at(-1)!,
    range: sorted.at(-1)! - sorted[0],
    q1,
    q3,
    iqr: q3 - q1,
  };
}
