import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const synthesis = "Overall field synthesis (optional, ≤ 200 words)";

async function advanceToReview(page: import("@playwright/test").Page) {
  for (let field = 0; field < 6; field += 1) {
    await page
      .getByRole("button", {
        name: field === 5 ? "Review responses" : "Next field",
      })
      .click();
  }
}

async function advanceToClosing(page: import("@playwright/test").Page) {
  await page
    .getByRole("button", { name: "Continue to closing survey" })
    .click();
  await page
    .getByRole("button", { name: "Continue to closing survey" })
    .click();
}

test("review edits survive cross-field navigation, reload, submission and export", async ({
  page,
}) => {
  await page.goto("#/evaluator");
  await page.getByLabel("Evaluator pseudonym").fill("E2E-REVIEW-PERSIST");
  await page.getByRole("button", { name: "Save pseudonym" }).click();
  await page.getByRole("link", { name: "Start evaluation" }).first().click();

  for (let field = 0; field < 6; field += 1) {
    await page.getByLabel(synthesis).fill(`original synthesis F${field + 1}`);
    await page.getByLabel("Open comment").fill(`original open F${field + 1}`);
    await page
      .getByLabel("Suggested change")
      .fill(`original change F${field + 1}`);
    await page
      .getByLabel("Insufficient information to rate this field")
      .check();
    await page
      .getByRole("button", {
        name: field === 5 ? "Review responses" : "Next field",
      })
      .click();
  }

  await page.getByRole("button", { name: "Edit this field" }).first().click();
  await page.getByLabel(synthesis).fill("edited synthesis F1 — exact text");
  await page.getByLabel("Open comment").fill("edited open F1 — exact text");
  await page
    .getByLabel("Suggested change")
    .fill("edited change F1 — exact text");
  await advanceToReview(page);

  await page.getByRole("button", { name: "Edit this field" }).first().click();
  await expect(page.getByLabel(synthesis)).toHaveValue(
    "edited synthesis F1 — exact text",
  );
  await page.getByRole("button", { name: "Next field" }).click();
  await expect(page.getByLabel(synthesis)).toHaveValue("original synthesis F2");
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.getByLabel("Open comment")).toHaveValue(
    "edited open F1 — exact text",
  );

  await page.reload();
  await expect(page.getByLabel(synthesis)).toHaveValue(
    "edited synthesis F1 — exact text",
  );
  await expect(page.getByLabel("Suggested change")).toHaveValue(
    "edited change F1 — exact text",
  );
  await advanceToReview(page);
  await advanceToClosing(page);

  await page.getByLabel("Burden feedback").fill("closing burden — exact text");
  await page
    .getByLabel("Ambiguity feedback")
    .fill("closing ambiguity — exact text");
  await page
    .getByLabel("Usefulness feedback")
    .fill("closing usefulness — exact text");

  await page.reload();
  await advanceToReview(page);
  await advanceToClosing(page);
  await expect(page.getByLabel("Burden feedback")).toHaveValue(
    "closing burden — exact text",
  );
  await expect(page.getByLabel("Ambiguity feedback")).toHaveValue(
    "closing ambiguity — exact text",
  );
  await expect(page.getByLabel("Usefulness feedback")).toHaveValue(
    "closing usefulness — exact text",
  );

  const ranges = page.locator('input[type="range"]');
  for (let index = 0; index < 6; index += 1) await ranges.nth(index).fill("55");
  const susGroups = page.locator("fieldset.rating");
  for (let index = 0; index < 10; index += 1)
    await susGroups.nth(index).locator('input[value="3"]').check();
  await page
    .getByLabel(
      "I confirm that I evaluated only the fictional scenario as written.",
    )
    .check();
  await page.getByRole("button", { name: "Complete evaluation" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export evaluation JSON" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile((await download.path())!, "utf8"));
  const session = exported.entities.sessions[0];
  expect(session.fieldResponses[0].overallSynthesis).toBe(
    "edited synthesis F1 — exact text",
  );
  expect(session.fieldResponses[0].openComment).toBe(
    "edited open F1 — exact text",
  );
  expect(session.fieldResponses[0].changeProposal).toBe(
    "edited change F1 — exact text",
  );
  expect(session.fieldResponses[1].overallSynthesis).toBe(
    "original synthesis F2",
  );
  expect(session.openFeedback).toEqual({
    burden: "closing burden — exact text",
    ambiguity: "closing ambiguity — exact text",
    usefulness: "closing usefulness — exact text",
  });
});
