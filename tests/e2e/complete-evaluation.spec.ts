import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

test("completes all six fields, closing instruments, and exports the immutable session", async ({
  page,
}) => {
  await page.goto("#/evaluator");
  await page.getByLabel("Evaluator pseudonym").fill("E2E-COMPLETE");
  await page.getByRole("button", { name: "Save pseudonym" }).click();
  await page.getByRole("link", { name: "Start evaluation" }).first().click();
  for (let field = 0; field < 6; field += 1) {
    await page
      .getByLabel("Insufficient information to rate this field")
      .check();
    await page
      .getByRole("button", {
        name: field === 5 ? "Review responses" : "Next field",
      })
      .click();
  }
  await page
    .getByRole("button", { name: "Continue to closing survey" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Taxonomy item validation" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Continue to closing survey" })
    .click();
  const ranges = page.locator('input[type="range"]');
  for (let index = 0; index < 6; index += 1) {
    await ranges.nth(index).fill("55");
  }
  const susGroups = page.locator("fieldset.rating");
  for (let index = 0; index < 10; index += 1) {
    await susGroups.nth(index).locator('input[value="3"]').check();
  }
  await page
    .getByLabel(
      "I confirm that I evaluated only the fictional scenario as written.",
    )
    .check();
  await page.getByRole("button", { name: "Complete evaluation" }).click();
  await expect(page.getByText("Completed evaluations")).toBeVisible();
  const exportButton = page.getByRole("button", {
    name: "Export evaluation JSON",
  });
  await expect(exportButton).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await exportButton.click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const exported = JSON.parse(await readFile(downloadPath!, "utf8"));
  expect(exported.schemaVersion).toBe("1.1");
  expect(exported.coreVersion).toBe("1.1");
  expect(exported.exportType).toBe("evaluation-session");
  expect(exported.entities.sessions).toHaveLength(1);
  expect(exported.entities.sessions[0].fieldResponses).toHaveLength(6);
  expect(exported.entities.sessions[0].evaluationStatus).toBe("submitted");
  expect(exported.entities.sessions[0].scientificStatus).toBe("completed");

  await page.goto("#/admin/merge");
  await page.getByLabel("Evaluation JSON files").setInputFiles({
    name: download.suggestedFilename(),
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(exported)),
  });
  await expect(
    page.getByRole("heading", { name: "Merge report" }),
  ).toBeVisible();
  await expect(page.getByText("1 unique sessions loaded.")).toBeVisible();
});
