import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../src/App";

describe("application shell", () => {
  beforeEach(() => {
    localStorage.clear();
    location.hash = "#/";
  });
  it("shows the permanent prototype notice and mode choices", () => {
    render(<App />);
    expect(screen.getByText("Research prototype.")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Phase 0 research toolkit" }),
    ).toBeInTheDocument();
  });
});
