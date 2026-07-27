import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import {
  parseCsvCases,
  parseJsonCases,
  parseLabeledCases,
} from "../../src/import/caseImport";
import {
  MAX_IMPORT_BYTES,
  validateImportFile,
} from "../../src/import/fileValidation";

vi.stubGlobal("crypto", { randomUUID: vi.fn(() => "test-id") });

describe("case import normalization", () => {
  it("imports multiple CSV rows and preserves quoted commas", () => {
    const entities = parseCsvCases(
      'title,taskDescription,existingControls\n"Case one","Pipetting, repeated","BSC"\nCase two,Imaging,Fixed sample',
      "cases.csv",
    );
    expect(entities.scenarios).toHaveLength(2);
    expect(entities.scenarios[0]).toMatchObject({
      title: "Case one",
      taskDescription: "Pipetting, repeated",
      existingControls: "BSC",
      isDemo: false,
      scenarioClass: "user",
      referenceSet: false,
    });
  });

  it("imports English and Spanish labeled cases", () => {
    const entities = parseLabeledCases(
      [
        "Title: First case",
        "Task description: First task",
        "Existing controls: Cabinet",
        "Título: Segundo caso",
        "Descripción: Segunda tarea",
        "Controles: Guantes",
      ].join("\n"),
      "cases.docx",
    );
    expect(entities.scenarios.map(({ title }) => title)).toEqual([
      "First case",
      "Segundo caso",
    ]);
  });

  it("accepts semicolon-delimited CSV files", () => {
    const entities = parseCsvCases(
      "titulo;descripcion;controles\nCaso CSV;Tarea ficticia;Cabina",
    );
    expect(entities.scenarios[0]).toMatchObject({
      title: "Caso CSV",
      taskDescription: "Tarea ficticia",
      existingControls: "Cabina",
    });
  });

  it("rejects records without the required title and task description", () => {
    expect(() => parseCsvCases("title,notes\nIncomplete,Missing task")).toThrow(
      "taskDescription",
    );
  });

  it("rejects a native study-config atomically with an exact entity path", () => {
    const invalid = JSON.stringify({
      schemaVersion: "1.0.0",
      exportType: "study-config",
      appVersion: "0.1.0",
      generatedAt: "2026-01-01T00:00:00.000Z",
      entities: {
        studies: [{ studyId: "s1" }],
        rounds: [],
        scenarios: [],
        changelog: [],
      },
    });
    expect(() => parseJsonCases(invalid, "invalid.json")).toThrow(
      "entities.studies.0.title",
    );
  });

  it("imports the two corrected exploratory scenarios as a separate set", () => {
    const input = readFileSync("data/study-config-exploratory.json", "utf8");
    const entities = parseJsonCases(input, "study-config-exploratory.json");
    expect(entities.scenarios.map(({ scenarioId }) => scenarioId)).toEqual([
      "ORG-01",
      "INC-01",
    ]);
    expect(
      entities.scenarios.every(
        ({ scenarioClass, referenceSet }) =>
          scenarioClass === "research-extension" && referenceSet === false,
      ),
    ).toBe(true);
  });

  it("normalizes the supplied fixture envelope and records legacy defaults", () => {
    const native = JSON.stringify({
      schemaVersion: "1.0",
      exportType: "study-config",
      appVersion: "1.1.0",
      generatedAt: null,
      entities: {
        study: {
          studyId: "legacy",
          title: "Legacy",
          description: "Legacy fixture",
          createdAt: null,
          status: "draft",
          config: {
            includeRtlx: true,
            includeSus: true,
            confidenceScalePoints: 4,
            relevanceClarityScalePoints: 4,
          },
        },
        rounds: [],
        scenarios: [],
      },
    });
    const entities = parseJsonCases(native, "legacy.json");
    expect(entities.studies[0].createdAt).toBe("1970-01-01T00:00:00.000Z");
    expect(entities.changelog).toEqual([]);
    expect(entities.studies[0].config.instrumentVersion).toBe("1.0.0");
  });

  it("rejects a round whose instrument differs from its study", () => {
    const fixture = JSON.parse(
      readFileSync("data/study-config-exploratory.json", "utf8"),
    ) as { entities: { rounds: Array<{ instrumentVersion: string }> } };
    fixture.entities.rounds[0].instrumentVersion = "1.0.0";
    const input = JSON.stringify(fixture);
    expect(() => parseJsonCases(input, "mismatch.json")).toThrow(
      "does not match its study",
    );
  });

  it("rejects a research-extension scenario in the reference set", () => {
    const input = readFileSync(
      "data/study-config-exploratory.json",
      "utf8",
    ).replace('"referenceSet": false', '"referenceSet": true');
    expect(() => parseJsonCases(input, "invalid.json")).toThrow(
      "cannot belong to the reference set",
    );
  });
});

describe("import file security", () => {
  it("rejects oversized and MIME-mismatched files", () => {
    const oversized = new File(
      [new Uint8Array(MAX_IMPORT_BYTES + 1)],
      "cases.json",
      { type: "application/json" },
    );
    expect(() => validateImportFile(oversized, ["json"])).toThrow(
      "Maximum import size",
    );
    const mismatch = new File(["{}"], "cases.json", {
      type: "application/pdf",
    });
    expect(() => validateImportFile(mismatch, ["json"])).toThrow(
      "File type mismatch",
    );
  });
});
