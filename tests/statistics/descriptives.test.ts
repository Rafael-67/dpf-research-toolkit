import { describe, expect, it } from "vitest";
import { descriptives } from "../../src/statistics/descriptives";

describe("basic descriptives", () => {
  it("computes mean, median, modes, range, and interpolated IQR", () => {
    const result = descriptives([1, 2, 2, 3, 4]);
    expect(result).toMatchObject({
      count: 5,
      mean: 2.4,
      median: 2,
      modes: [2],
      min: 1,
      max: 4,
      range: 3,
      q1: 2,
      q3: 3,
      iqr: 1,
    });
  });
  it("rejects empty and non-finite inputs", () => {
    expect(() => descriptives([])).toThrow();
    expect(() => descriptives([1, Number.NaN])).toThrow();
  });
});
