import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ObservationEditor } from "../../src/modes/evaluator/ObservationEditor";

describe("ObservationEditor draft persistence", () => {
  it("restores unsaved free-text fields after remounting", () => {
    const props = {
      fieldId: "F1" as const,
      draftKey: "session-1:F1",
      onSave: vi.fn(),
    };
    const first = render(<ObservationEditor {...props} />);

    fireEvent.change(screen.getByLabelText(/Reasoning summary/), {
      target: { value: "Persisted reasoning" },
    });
    const extendedComments = screen
      .getByText("Extended comments (optional)")
      .parentElement?.querySelector("textarea");
    expect(extendedComments).not.toBeNull();
    fireEvent.change(extendedComments!, {
      target: { value: "Persisted extended comment" },
    });
    first.unmount();

    render(<ObservationEditor {...props} />);
    expect(screen.getByLabelText(/Reasoning summary/)).toHaveValue(
      "Persisted reasoning",
    );
    const restoredExtendedComments = screen
      .getByText("Extended comments (optional)")
      .parentElement?.querySelector("textarea");
    expect(restoredExtendedComments).toHaveValue(
      "Persisted extended comment",
    );
  });
});
