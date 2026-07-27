import { expect, test } from "@playwright/test";

test("new studies and rounds use the single structured hybrid instrument", async ({
  page,
}) => {
  await page.goto("/#/admin/study/new");
  await page.getByLabel("Study title").fill("Structured study");
  await page.getByLabel("Description").fill("Instrument isolation test");
  await expect(
    page.getByText(
      "DPF-RP uses one structured hybrid workflow. Taxonomy 0.1-exploratory contains candidate items for validation.",
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create study" }).click();

  await expect(page.getByText("Instrument version: 1.1.0")).toBeVisible();
  await page.getByRole("link", { name: "New round" }).click();
  await expect(page.getByText("Instrument version: 1.1.0")).toBeVisible();
  await page.getByLabel("Round label").fill("Structured round");
  await page.getByLabel("Evaluator group").fill("Expert panel");
  await page.getByRole("button", { name: "Create round" }).click();
  await expect(page.getByText("Structured round")).toBeVisible();
  const roundId = page.url().split("/round/")[1];
  await page.goto(
    `/#/evaluator/session/demo-E1?roundId=${encodeURIComponent(roundId)}`,
  );
  await expect(
    page.getByText("Taxonomy 0.1-exploratory", { exact: false }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Save observation" }),
  ).toBeVisible();
});
