import {
  CORE_VERSION,
  PLATFORM_VERSION,
  SCHEMA_VERSION,
} from "../config/versions";

export interface ExportEnvelope<T> {
  schemaVersion: string;
  exportType:
    | "study-config"
    | "studies"
    | "study-configuration"
    | "evaluation-session"
    | "evaluation-sessions"
    | "field-responses"
    | "merged-dataset"
    | "institutions"
    | "evaluators"
    | "scenarios"
    | "taxonomy-ratings"
    | "documents"
    | "document-links"
    | "issues"
    | "issue-history"
    | "dashboard-summary";
  appVersion: string;
  generatedAt: string;
  coreVersion: string;
  platformVersion: string;
  exportedAt: string;
  exportVersion?: "1.1.0";
  instrumentVersion?: string;
  structuredItemSetVersion?: string;
  entities: T;
}

export function makeEnvelope<T>(
  exportType: ExportEnvelope<T>["exportType"],
  entities: T,
): ExportEnvelope<T> {
  return {
    schemaVersion: SCHEMA_VERSION,
    coreVersion: CORE_VERSION,
    platformVersion: PLATFORM_VERSION,
    exportType,
    appVersion: "0.1.0",
    generatedAt: new Date().toISOString(),
    exportedAt: new Date().toISOString(),
    exportVersion: "1.1.0",
    entities,
  };
}

export function parseEnvelope<T>(
  input: string,
  expectedType: ExportEnvelope<T>["exportType"],
): ExportEnvelope<T> {
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }
  if (!value || typeof value !== "object")
    throw new Error("The JSON root must be an object.");
  const candidate = value as Partial<ExportEnvelope<T>>;
  if (
    !["1.0.0", "1.1", "1.1.0", "1.2"].includes(String(candidate.schemaVersion))
  )
    throw new Error(
      `Unsupported schemaVersion: ${String(candidate.schemaVersion)}; this app supports 1.0.0, 1.1, 1.1.0 and 1.2.`,
    );
  if (candidate.exportType !== expectedType)
    throw new Error(`Wrong export type: expected ${expectedType}.`);
  if (!candidate.entities) throw new Error("The JSON is missing entities.");
  return {
    coreVersion: CORE_VERSION,
    platformVersion: candidate.appVersion ?? "legacy-unspecified",
    exportedAt: candidate.generatedAt ?? new Date(0).toISOString(),
    ...candidate,
  } as ExportEnvelope<T>;
}

export function downloadJson(filename: string, value: unknown): void {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadText(
  filename: string,
  value: string,
  type = "text/csv;charset=utf-8",
): void {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
