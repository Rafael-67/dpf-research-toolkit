import { expect, test } from "@playwright/test";

test("evaluator can begin the one-field-at-a-time demo flow", async ({
  page,
}) => {
  await page.goto("#/evaluator");
  await page.getByLabel("Evaluator pseudonym").fill("EVAL-001");
  await page.getByRole("button", { name: "Save pseudonym" }).click();
  await page.getByRole("link", { name: "Start evaluation" }).first().click();
  await expect(page.getByText("Field 1 of 6")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Critical task" }),
  ).toBeFocused();
  await expect(
    page.getByText(/Do not enter select-agent information/),
  ).toBeVisible();
});
