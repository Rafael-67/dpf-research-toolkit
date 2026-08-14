import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import type { EvaluationSession, FieldResponse } from "../../src/domain/types";
import { frameworkFields } from "../../src/framework/fields";
import { LanguageProvider } from "../../src/i18n/LanguageContext";
import { FieldQuestion } from "../../src/modes/evaluator/FieldQuestion";

const response: FieldResponse = {
  fieldId: "F1",
  narrativeAnswer: "",
  openComment: "original open",
  changeProposal: "original change",
  confidenceRating: 4,
  relevance: 3,
  clarity: 2,
  exhaustiveness: 4,
  redundancy: 1,
  applicability: 3,
  interpretationDifficulty: 2,
  insufficientInformation: false,
  timeSpentSeconds: 0,
  revisionCount: 0,
  helpAccessedCount: 0,
  overallSynthesis: "original synthesis",
  observations: [
    {
      observationId: "obs-1",
      fieldId: "F1",
      category: { value: "other", otherText: "task" },
      taskPhases: [{ value: "whole_task" }],
      evidenceSources: [{ value: "direct_observation" }],
      ratings: {
        analyticalRelevance: 4,
        evidenceStrength: 5,
        expectedInfluenceOnDeliveredProtection: 3,
        evaluatorCertainty: 4,
      },
      reasoningSummary: "observation reasoning — exact",
      extendedComments: "observation extension — exact",
      createdAt: "2026-01-01T00:00:00.000Z",
      taskFamily: { value: "preparation" },
      taskOperations: [{ value: "inspect" }],
      workMode: { value: "manual" },
      systemOpenness: { value: "intermittently_open" },
      materialPhysicalState: [{ value: "liquid" }],
      vesselOrDevice: [{ value: "microcentrifuge_tube" }],
    },
  ],
  noObservationReason: null,
  fieldSummary: {
    fieldId: "F1",
    dominantCategories: [{ value: "other", otherText: "task" }],
    overallAnalyticalRelevance: 3,
    informationSufficiency: 3,
    internalConsistencyOfEvidence: 3,
    consensusPriority: 3,
    reasoningSummary: "original field reasoning",
    extendedComments: "original field extension",
  },
};

function Harness() {
  const [current, setCurrent] = useState(response);
  return (
    <LanguageProvider>
      <FieldQuestion
        field={frameworkFields[0]}
        response={current}
        position={0}
        observationDraftKey="session:F1"
        onChange={(update) =>
          setCurrent((latest) => {
            const next = update(latest);
            localStorage.setItem(
              "dpft:evaluation:test",
              JSON.stringify({ fieldResponses: [next] }),
            );
            return next;
          })
        }
        onBack={() => undefined}
        onNext={() => undefined}
      />
    </LanguageProvider>
  );
}

describe("FieldQuestion transactional persistence", () => {
  beforeEach(() => localStorage.clear());

  it("merges rapid free-text changes without losing nested or unrelated values", () => {
    render(<Harness />);
    fireEvent.change(screen.getByLabelText("Field reasoning summary *"), {
      target: { value: "edited field reasoning — exact" },
    });
    const extended = screen
      .getByText("Extended field comments (optional)")
      .parentElement?.querySelector("textarea");
    fireEvent.change(extended!, {
      target: { value: "edited field extension — exact" },
    });
    fireEvent.change(screen.getByLabelText("Open comment"), {
      target: { value: "edited open — exact" },
    });
    fireEvent.change(screen.getByLabelText("Suggested change"), {
      target: { value: "edited change — exact" },
    });

    const stored = JSON.parse(
      localStorage.getItem("dpft:evaluation:test")!,
    ) as Pick<EvaluationSession, "fieldResponses">;
    const saved = stored.fieldResponses[0];
    expect(saved.fieldSummary?.reasoningSummary).toBe(
      "edited field reasoning — exact",
    );
    expect(saved.fieldSummary?.extendedComments).toBe(
      "edited field extension — exact",
    );
    expect(saved.openComment).toBe("edited open — exact");
    expect(saved.changeProposal).toBe("edited change — exact");
    expect(saved.confidenceRating).toBe(4);
    expect(saved.observations?.[0]).toMatchObject({
      reasoningSummary: "observation reasoning — exact",
      extendedComments: "observation extension — exact",
    });
  });
});
