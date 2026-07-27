import { expect, test } from "@playwright/test";

test("switches the interface to Spanish and persists the preference", async ({
  page,
}) => {
  await page.goto("#/");
  await page.getByLabel("Language").selectOption("es");
  await expect(
    page.getByRole("heading", {
      name: "Herramienta de investigación de Fase 0",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Administración", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Idioma")).toHaveValue("es");
  await page.goto("#/evaluator");
  await expect(
    page.getByRole("heading", { name: "Cola de evaluación" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "E1: Pipeteo repetitivo y alicuotado lentiviral",
    }),
  ).toBeVisible();
  await expect(page.getByText(/Repeated aliquoting/)).toHaveCount(0);
  await page.getByRole("link", { name: "Administración", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: /Cinco escenarios de demostración alineados/,
    }),
  ).toBeVisible();
  await page.goto("#/admin/study/study-demo-aligned/changelog/new");
  await expect(page.getByText("Comparabilidad predeterminada:")).toBeVisible();
  await expect(page.getByLabel("Tipo de cambio")).toContainText("redacción");
  await page.goto(
    "#/admin/study/study-demo-aligned/round/round-demo-001/summary",
  );
  await expect(
    page.getByText("Bloquee esta ronda antes de calcular las estadísticas."),
  ).toBeVisible();
  await expect(page.getByText(/Values are descriptive/)).toHaveCount(0);
});

test("switches back to English", async ({ page }) => {
  await page.goto("#/");
  await page.getByLabel(/Language|Idioma/).selectOption("en");
  await expect(
    page.getByRole("heading", { name: "Phase 0 research toolkit" }),
  ).toBeVisible();
});

test("Phase 0 modules are fully available in Spanish", async ({ page }) => {
  await page.goto("#/");
  await page.getByLabel(/Language|Idioma/).selectOption("es");
  await page.goto("#/scientific-dashboard");
  await expect(
    page.getByRole("heading", { name: "Panel científico" }),
  ).toBeVisible();
  await expect(
    page.getByText("Información científica exclusivamente descriptiva"),
  ).toBeVisible();
  await expect(
    page.getByRole("option", { name: "extensión de investigación" }),
  ).toBeAttached();

  await page.goto("#/documents");
  await expect(
    page.getByRole("heading", { name: "Documentos de apoyo" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Registrar versión inmutable" }),
  ).toBeVisible();

  await page.goto("#/issues");
  await expect(
    page.getByRole("heading", { name: "Incidencias" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Crear incidencia" }),
  ).toBeVisible();
});
