import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AccessibleBarChart,
  CompletionChart,
} from "../../src/dashboard/AccessibleCharts";

describe("accessible scientific charts", () => {
  it("exposes bar values to assistive technology and omits zero bars", () => {
    render(
      <AccessibleBarChart
        title="Sessions by status"
        description="Scientific lifecycle counts"
        emptyLabel="No data"
        data={[
          { key: "completed", label: "Completed", value: 3 },
          { key: "excluded", label: "Excluded", value: 0 },
        ]}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Sessions by status. Completed: 3" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Excluded")).not.toBeInTheDocument();
  });

  it("bounds and announces the completion percentage", () => {
    render(
      <CompletionChart
        title="Response completeness"
        description="Descriptive only"
        value={120}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Response completeness: 100.0%" }),
    ).toBeInTheDocument();
  });
});
