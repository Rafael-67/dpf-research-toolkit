import { describe, expect, it } from "vitest";
import { cohensKappa, fleissKappa } from "../../src/statistics/agreement";

describe("agreement edge cases", () => {
  it("returns perfect agreement when expected agreement is one", () => {
    expect(cohensKappa(["A", "A"], ["A", "A"]).value).toBe(1);
    expect(
      fleissKappa([
        [3, 0],
        [3, 0],
      ]).value,
    ).toBe(1);
  });
  it("rejects unequal Cohen observations", () => {
    expect(() => cohensKappa(["A"], ["A", "B"])).toThrow();
  });
  it("rejects inconsistent Fleiss rater counts", () => {
    expect(() =>
      fleissKappa([
        [2, 1],
        [1, 1],
      ]),
    ).toThrow();
  });
});
