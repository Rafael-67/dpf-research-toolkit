import { describe, expect, it } from "vitest";
import { percentAgreement } from "../../src/statistics/agreement";

describe("percent agreement", () => {
  it("matches a hand-computed 2x2 case", () => {
    // Table [[20, 5], [10, 15]] has 35 diagonal agreements of 50: 35/50 = 70%.
    const a = [...Array(25).fill("yes"), ...Array(25).fill("no")];
    const b = [
      ...Array(20).fill("yes"),
      ...Array(5).fill("no"),
      ...Array(10).fill("yes"),
      ...Array(15).fill("no"),
    ];
    expect(percentAgreement(a, b)).toBe(70);
  });
  it("matches a hand-computed 3x3 case", () => {
    // Diagonal counts 4 + 3 + 2 out of 12 observations: 9/12 = 75%.
    const a = ["A", "A", "A", "A", "A", "B", "B", "B", "B", "C", "C", "C"];
    const b = ["A", "A", "A", "A", "B", "B", "B", "B", "C", "C", "C", "A"];
    expect(percentAgreement(a, b)).toBe(75);
  });
});
