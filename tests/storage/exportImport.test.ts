import { describe, expect, it } from "vitest";
import { makeEnvelope, parseEnvelope } from "../../src/storage/exportImport";

describe("exchange envelopes", () => {
  it("round-trips a supported envelope", () => {
    const envelope = makeEnvelope("study-config", { studies: [] });
    expect(envelope).toMatchObject({
      coreVersion: "1.1",
      platformVersion: "1.2.0",
      schemaVersion: "1.1",
    });
    expect(
      parseEnvelope(JSON.stringify(envelope), "study-config").entities,
    ).toEqual({ studies: [] });
  });
  it("distinguishes invalid JSON, wrong type, and schema version", () => {
    expect(() => parseEnvelope("no", "study-config")).toThrow("not valid JSON");
    expect(() =>
      parseEnvelope(
        JSON.stringify({
          schemaVersion: "1.0.0",
          exportType: "evaluation-session",
          entities: {},
        }),
        "study-config",
      ),
    ).toThrow("Wrong export type");
    expect(() =>
      parseEnvelope(
        JSON.stringify({
          schemaVersion: "9.0.0",
          exportType: "study-config",
          entities: {},
        }),
        "study-config",
      ),
    ).toThrow("Unsupported schemaVersion");
  });
});
