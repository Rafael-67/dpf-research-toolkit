import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteAllLocalData,
  deleteStudyRecords,
  listRecords,
  saveEvaluationRecord,
  saveRecord,
} from "../../src/storage/localStore";

describe("localStore", () => {
  beforeEach(() => localStorage.clear());
  it("writes a record and its index", () => {
    saveRecord("study", "s1", { id: "s1" });
    expect(listRecords("study")).toEqual([{ id: "s1" }]);
  });
  it("deletes only dpft-prefixed keys", () => {
    localStorage.setItem("other", "keep");
    saveRecord("study", "s1", {});
    deleteAllLocalData();
    expect(localStorage.getItem("other")).toBe("keep");
    expect(listRecords("study")).toEqual([]);
  });
  it("prevents modification of a completed evaluation record", () => {
    saveEvaluationRecord({
      sessionId: "done",
      evaluationStatus: "completed",
      answer: "original",
    });
    expect(() =>
      saveEvaluationRecord({
        sessionId: "done",
        evaluationStatus: "completed",
        answer: "changed",
      }),
    ).toThrow("immutable");
  });
  it("deletes one study and its dependent records but retains reusable scenarios", () => {
    saveRecord("study", "s1", { studyId: "s1" });
    saveRecord("study", "s2", { studyId: "s2" });
    saveRecord("round", "r1", { roundId: "r1", studyId: "s1" });
    saveRecord("round", "r2", { roundId: "r2", studyId: "s2" });
    saveRecord("roundScenario", "r1:case", {
      roundId: "r1",
      scenarioId: "case",
    });
    saveRecord("scenario", "case:1", {
      scenarioId: "case",
      scenarioVersion: "1",
    });
    saveRecord("evaluation", "e1", {
      sessionId: "e1",
      studyId: "s1",
    });

    expect(deleteStudyRecords("s1")).toEqual({
      roundsDeleted: 1,
      assignmentsDeleted: 1,
      evaluationsDeleted: 1,
    });
    expect(listRecords<{ studyId: string }>("study")).toEqual([
      { studyId: "s2" },
    ]);
    expect(listRecords<{ roundId: string }>("round")).toEqual([
      { roundId: "r2", studyId: "s2" },
    ]);
    expect(listRecords("roundScenario")).toEqual([]);
    expect(listRecords("evaluation")).toEqual([]);
    expect(listRecords("scenario")).toHaveLength(1);
  });
});
