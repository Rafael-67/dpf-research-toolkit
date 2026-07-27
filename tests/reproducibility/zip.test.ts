import { describe, expect, it } from "vitest";
import { createStoredZipBytes } from "../../src/reproducibility/zip";

describe("reproducibility ZIP", () => {
  it("creates a standards-signature ZIP containing named JSON files", async () => {
    const bytes = createStoredZipBytes({
      "manifest.json": '{"ok":true}',
    });
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
    expect(new TextDecoder().decode(bytes)).toContain("manifest.json");
  });
});
