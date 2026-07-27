import { describe, expect, it } from "vitest";
import {
  exactSetAgreement,
  frequencies,
  iccOneWayRandom,
  jaccardSimilarity,
  krippendorffAlphaNominal,
  ordinalDifference,
  ordinalSummary,
  weightedKappa,
} from "../../src/statistics/structuredAnalysis";

describe("structured analysis", () => {
  it("reports frequencies, missingness and ordinal descriptives", () => {
    const frequency = frequencies(["a", "a", "b"]).find(
      ({ value }) => value === "a",
    );
    expect(frequency).toMatchObject({ value: "a", count: 2 });
    expect(frequency?.percentage).toBeCloseTo(200 / 3);
    expect(ordinalSummary([1, 3, 5, null])).toMatchObject({
      total: 4,
      missing: 1,
      median: 3,
      min: 1,
      max: 5,
    });
  });
  it("computes set and ordinal comparison inputs", () => {
    expect(jaccardSimilarity(["a", "b"], ["b", "c"])).toBeCloseTo(1 / 3);
    expect(exactSetAgreement(["a"], ["a"])).toBe(true);
    expect(ordinalDifference(1, 5)).toBe(4);
  });
  it("returns unlabelled agreement coefficients", () => {
    expect(weightedKappa([1, 2, 3], [1, 2, 3])).toBe(1);
    expect(
      krippendorffAlphaNominal([
        ["a", "a"],
        ["b", "b"],
      ]),
    ).toBe(1);
    expect(
      iccOneWayRandom([
        [1, 1],
        [3, 3],
        [5, 5],
      ]),
    ).toBe(1);
  });
});
