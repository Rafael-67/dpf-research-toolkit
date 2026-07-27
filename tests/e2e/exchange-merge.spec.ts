import { expect, test } from "@playwright/test";

const envelope = (exportType: string, entities: unknown) =>
  JSON.stringify({
    schemaVersion: "1.0.0",
    exportType,
    appVersion: "0.1.0",
    generatedAt: "2026-07-20T00:00:00.000Z",
    entities,
  });

test("evaluator imports a study configuration", async ({ page }) => {
  await page.goto("#/evaluator/import");
  await page
    .getByLabel("Study or case file (JSON, CSV, DOCX, or PDF)")
    .setInputFiles({
      name: "study-config.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        envelope("study-config", {
          studies: [
            {
              studyId: "imported-study",
              title: "Imported study",
              description: "Test",
              createdAt: "2026-07-20T00:00:00.000Z",
              status: "active",
              config: {
                includeRtlx: true,
                includeSus: true,
                confidenceScalePoints: 4,
                relevanceClarityScalePoints: 4,
              },
            },
          ],
          rounds: [],
          scenarios: [],
          changelog: [],
        }),
      ),
    });
  await expect(page.getByRole("status")).toContainText("Imported 1 study");
});

test("evaluator imports cases from CSV", async ({ page }) => {
  await page.goto("#/evaluator/import");
  await page
    .getByLabel("Study or case file (JSON, CSV, DOCX, or PDF)")
    .setInputFiles({
      name: "cases.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(
        "title,taskDescription,existingControls\nImported CSV case,Test task,Fictional controls",
      ),
    });
  await expect(page.getByRole("status")).toContainText(
    "Imported 1 study and 1 cases from cases.csv",
  );
  await page.goto("#/evaluator");
  await expect(
    page.getByRole("heading", { name: "Imported CSV case" }),
  ).toBeVisible();
  await expect(page.getByText("User scenario", { exact: true })).toBeVisible();
});

test("administrator imports and merges an evaluation export", async ({
  page,
}) => {
  await page.goto("#/admin/merge");
  const versions = {
    F1: "1.0",
    F2: "1.0",
    F3: "1.0",
    F4: "1.0",
    F5: "1.0",
    F6: "1.0",
  };
  const session = {
    sessionId: "e2e-session",
    evaluatorPseudonym: "E2E-01",
    studyId: "demo-study",
    roundId: "demo-round-1",
    scenarioId: "demo-1",
    scenarioVersion: "1.0",
    instrumentVersion: "1.0",
    frameworkVersion: "0.1.0-draft",
    fieldDefinitionVersions: versions,
    evaluationStatus: "completed",
    metadata: {
      appVersion: "0.1.0",
      userAgent: "test",
      viewportClass: "desktop",
      locale: "en",
    },
    fieldResponses: Object.keys(versions).map((fieldId) => ({
      fieldId,
      narrativeAnswer: "E2E response",
      openComment: "",
      changeProposal: "",
      confidenceRating: 4,
      relevance: 4,
      clarity: 4,
      exhaustiveness: 4,
      redundancy: 1,
      applicability: 4,
      interpretationDifficulty: 1,
      insufficientInformation: false,
      timeSpentSeconds: 10,
      revisionCount: 1,
      helpAccessedCount: 0,
    })),
    nasaTlx: null,
    sus: null,
    openFeedback: { burden: "", ambiguity: "", usefulness: "" },
    fictionalScenarioConfirmed: true,
    startedAt: "2026-07-20T00:00:00.000Z",
    reviewedAt: "2026-07-20T00:01:00.000Z",
    finishedAt: "2026-07-20T00:02:00.000Z",
    abandonedAt: null,
    resumedAt: null,
  };
  await page.getByLabel("Evaluation JSON files").setInputFiles({
    name: "evaluation.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      envelope("evaluation-session", { sessions: [session] }),
    ),
  });
  await expect(
    page.getByRole("heading", { name: "Merge report" }),
  ).toBeVisible();
  await expect(page.getByText("1 unique sessions loaded.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Export merged JSON" }),
  ).toBeVisible();
});
