import { expect, test } from "@playwright/test";

test("reference and exploratory scenarios remain in separate studies and rounds", async ({
  page,
}) => {
  await page.goto("#/admin");
  await expect(page.getByText(/Reference:\s*5 \(E1–E5\)/)).toBeVisible();
  await expect(page.getByText(/Exploratory:\s*0/)).toBeVisible();

  await page
    .getByRole("button", { name: "Load exploratory extension (2 cases)" })
    .click();
  await expect(page.getByText(/Exploratory:\s*2/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Research-extension scenarios/ }),
  ).toBeVisible();

  const referenceStudy = page
    .locator("article.card")
    .filter({ hasText: "Five aligned demo scenarios" });
  await referenceStudy.getByRole("link", { name: "Open study" }).click();
  await page.getByRole("link", { name: "Open round" }).click();

  await expect(page.getByText(/E1: Repetitive pipetting/)).toBeVisible();
  await expect(page.getByText(/E5: Static microscopy/)).toBeVisible();
  await expect(page.getByText(/ORG-01:/)).toHaveCount(0);
  await expect(page.getByText(/INC-01:/)).toHaveCount(0);
});
