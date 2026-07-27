import { describe, expect, it } from "vitest";
import { fleissKappa } from "../../src/statistics/agreement";

describe("Fleiss' kappa — Fleiss (1971)", () => {
  it("reproduces the 30-patient, six-rater psychiatric diagnosis example", () => {
    const counts = [
      [0, 0, 0, 6, 0],
      [0, 3, 0, 0, 3],
      [0, 1, 4, 1, 0],
      [0, 0, 6, 0, 0],
      [0, 3, 0, 3, 0],
      [2, 0, 4, 0, 0],
      [0, 0, 4, 0, 2],
      [2, 0, 3, 1, 0],
      [2, 0, 0, 4, 0],
      [0, 0, 0, 0, 6],
      [1, 0, 0, 5, 0],
      [1, 1, 0, 4, 0],
      [0, 3, 3, 0, 0],
      [1, 0, 0, 5, 0],
      [0, 2, 0, 3, 1],
      [0, 0, 5, 0, 1],
      [3, 0, 0, 1, 2],
      [5, 1, 0, 0, 0],
      [0, 2, 0, 4, 0],
      [1, 0, 2, 0, 3],
      [0, 0, 0, 0, 6],
      [0, 1, 0, 5, 0],
      [0, 2, 0, 1, 3],
      [2, 0, 0, 4, 0],
      [1, 0, 0, 4, 1],
      [0, 5, 0, 1, 0],
      [4, 0, 0, 0, 2],
      [0, 2, 0, 4, 0],
      [1, 0, 5, 0, 0],
      [0, 0, 0, 0, 6],
    ];
    const result = fleissKappa(counts);
    expect(result.observedAgreement).toBeCloseTo(0.5556, 4);
    // Fleiss reports the overall value to two decimal places (0.43).
    expect(result.value).toBeCloseTo(0.43, 2);
  });
});
