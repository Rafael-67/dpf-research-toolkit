import { expect, test } from "@playwright/test";

test("hash routes survive reload without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("#/admin");
  await expect(page.getByRole("heading", { name: "Studies" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Studies" })).toBeVisible();

  await page.goto("#/evaluator");
  await expect(
    page.getByRole("heading", { name: "Evaluation queue" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Evaluation queue" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("permanent prototype banner is present on nested routes", async ({
  page,
}) => {
  await page.goto("#/admin/study/new");
  await expect(page.getByRole("note")).toContainText("Research prototype");
});
