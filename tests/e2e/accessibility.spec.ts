import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 60_000 });

const routes = [
  "#/",
  "#/admin",
  "#/admin/merge",
  "#/evaluator",
  "#/evaluator/import",
  "#/scientific-dashboard",
  "#/documents",
  "#/issues",
  "#/about",
];

for (const route of routes) {
  test(`${route} has no automatically detectable WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    if (route === "#/scientific-dashboard") {
      await expect(
        page.getByRole("heading", { name: "Descriptive charts" }),
      ).toBeVisible();
      await expect(
        page.getByRole("img", { name: /Response completeness:/ }),
      ).toBeVisible();
      await expect(
        page.getByText(
          /They do not infer risk, agreement or scientific significance/,
        ),
      ).toBeVisible();
    }
  });
}
