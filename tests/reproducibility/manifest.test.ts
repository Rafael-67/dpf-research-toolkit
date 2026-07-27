import { describe, expect, it } from "vitest";
import {
  APPLICATION_MANIFEST,
  canonicalJson,
  makeReproduciblePackage,
  sha256,
} from "../../src/reproducibility/manifest";

describe("application manifest", () => {
  it("fixes the reference and exploratory sets without pooling them", () => {
    expect(APPLICATION_MANIFEST.scenarioSets.reference.ids).toHaveLength(5);
    expect(APPLICATION_MANIFEST.scenarioSets.researchExtension.ids).toEqual([
      "ORG-01",
      "INC-01",
    ]);
    expect(
      APPLICATION_MANIFEST.scenarioSets.researchExtension.primaryAnalysis,
    ).toBe(false);
  });

  it("canonicalizes object keys before hashing", async () => {
    expect(canonicalJson({ b: 2, a: 1 })).toBe(canonicalJson({ a: 1, b: 2 }));
    expect(await sha256({ b: 2, a: 1 })).toBe(await sha256({ a: 1, b: 2 }));
  });

  it("includes independently verifiable dataset hashes", async () => {
    const result = await makeReproduciblePackage({ examples: ["E1", "E2"] });
    expect(result.hashAlgorithm).toBe("SHA-256");
    expect(result.hashes.examples).toMatch(/^[a-f0-9]{64}$/);
  });
});
