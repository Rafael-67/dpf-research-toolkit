import { describe, expect, it } from "vitest";
import { cohensKappa } from "../../src/statistics/agreement";

describe("Cohen kappa — Landis & Koch (1977)", () => {
  it("reproduces the Winnipeg perfect-agreement kappa from Table 1 / Eq. 5.1", () => {
    // Table rows are the New Orleans neurologist; columns are the Winnipeg neurologist.
    const table = [
      [38, 5, 0, 1],
      [33, 11, 3, 0],
      [10, 14, 5, 6],
      [3, 7, 3, 10],
    ];
    const a: string[] = [];
    const b: string[] = [];
    table.forEach((row, rowIndex) =>
      row.forEach((count, columnIndex) => {
        for (let i = 0; i < count; i += 1) {
          a.push(String(rowIndex + 1));
          b.push(String(columnIndex + 1));
        }
      }),
    );
    expect(a).toHaveLength(149);
    expect(cohensKappa(a, b).value).toBeCloseTo(0.208, 3);
  });
});
