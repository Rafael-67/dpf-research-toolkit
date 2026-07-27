import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteSimulatedEvaluations,
  isSimulatedEvaluation,
  loadSimulatedEvaluations,
  simulatedEvaluationIds,
} from "../../src/framework/simulatedEvaluations";
import { listRecords } from "../../src/storage/localStore";
import type { EvaluationSession } from "../../src/domain/types";

describe("isolated simulated evaluations", () => {
  beforeEach(() => localStorage.clear());

  it("loads three unmistakably simulated E1 records and deletes only them", () => {
    expect(loadSimulatedEvaluations()).toBe(3);
    expect(simulatedEvaluationIds()).toHaveLength(3);
    expect(
      listRecords<EvaluationSession>("evaluation").every(({ sessionId }) =>
        isSimulatedEvaluation(sessionId),
      ),
    ).toBe(true);
    expect(deleteSimulatedEvaluations()).toBe(3);
    expect(listRecords<EvaluationSession>("evaluation")).toEqual([]);
  });
});
