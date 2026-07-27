import { describe, expect, it } from "vitest";
import { adaptEvaluationExportEntities } from "../../src/domain/sessionCompatibility";

describe("v1.1 evaluation export adapter", () => {
  it("accepts singular session exports without rewriting scientific responses", () => {
    const fieldResponses = [{ fieldId: "F1", narrativeAnswer: "Original" }];
    const result = adaptEvaluationExportEntities(
      {
        session: {
          sessionId: "session-INC-01-HF-02-v11",
          scenarioId: "INC-01",
          fieldResponses,
        },
      },
      {
        schemaVersion: "1.1",
        instrumentVersion: "1.1.0",
        structuredItemSetVersion: "0.1-exploratory",
      },
    );

    expect(result.sessions).toHaveLength(1);
    expect(result.sessions[0]).toMatchObject({
      scenarioClass: "research-extension",
      referenceSet: false,
      studyAlignment: "separate-exploratory-round",
      instrumentVersion: "1.1.0",
      dataSchemaVersion: "1.1",
      structuredItemSetVersion: "0.1-exploratory",
      fieldResponses,
    });
  });

  it("preserves canonical sessions arrays", () => {
    const session = { sessionId: "canonical", scenarioId: "E1" };
    expect(
      adaptEvaluationExportEntities({ sessions: [session] }).sessions[0],
    ).toMatchObject({
      sessionId: "canonical",
      scenarioClass: "reference",
      referenceSet: true,
    });
  });
});
