import type {
  FrameworkChangeLogEntry,
  Round,
  RoundScenario,
  Scenario,
  Study,
} from "../domain/types";
import { parseEnvelope } from "../storage/exportImport";
import { z } from "zod";
import { validateImportFile } from "./fileValidation";

export interface StudyImportEntities {
  studies: Study[];
  rounds: Round[];
  roundScenarios: RoundScenario[];
  scenarios: Scenario[];
  changelog: FrameworkChangeLogEntry[];
  classificationDefaultsApplied?: number;
}

type SourceRecord = Record<string, unknown>;

const studySchema = z
  .object({
    studyId: z.string().min(1),
    title: z.string().min(1),
    description: z.string(),
    createdAt: z.string().datetime(),
    status: z.enum(["draft", "active", "closed"]),
    config: z
      .object({
        instrumentVersion: z.enum(["1.0.0", "1.1.0"]).optional(),
        includeRtlx: z.boolean(),
        includeSus: z.boolean(),
        confidenceScalePoints: z.number().int().positive(),
        relevanceClarityScalePoints: z.number().int().positive(),
      })
      .passthrough(),
  })
  .passthrough();
const roundSchema = z
  .object({
    roundId: z.string().min(1),
    studyId: z.string().min(1),
    roundNumber: z.number().int().positive(),
    label: z.string().min(1),
    frameworkVersion: z.string().min(1),
    instrumentVersion: z.enum(["1.0.0", "1.1.0"]).optional(),
    status: z.enum(["open", "locked"]),
    evaluatorGroup: z.string().min(1),
    openedAt: z.string().datetime(),
    lockedAt: z.string().datetime().nullable(),
  })
  .passthrough();
const scenarioSchema = z
  .object({
    scenarioId: z.string().min(1),
    scenarioVersion: z.string().min(1),
    title: z.string().min(1),
    taskDescription: z.string().min(1),
    operatingConditions: z.string().min(1),
    availableInformation: z.string().min(1),
    vectorMaterialDescription: z.string().min(1),
    volumeOrConcentration: z.string().optional(),
    existingControls: z.string().min(1),
    contextualConstraints: z.string().min(1),
    intendedEvaluatorGroup: z.string().min(1),
    frameworkVersion: z.string().min(1),
    adminNotes: z.string(),
    isDemo: z.boolean(),
    scenarioClass: z
      .enum(["reference", "research-extension", "user"])
      .optional(),
    referenceSet: z.boolean().optional(),
    studyAlignment: z.string().nullable().optional(),
  })
  .passthrough();
const changelogSchema = z
  .object({
    entryId: z.string().min(1),
    fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
    previousDefinitionVersion: z.string(),
    newDefinitionVersion: z.string(),
    previousText: z.string(),
    newText: z.string(),
    changeType: z.enum([
      "wording",
      "response-type",
      "scale",
      "merge",
      "split",
      "removal",
      "addition",
    ]),
    rationale: z.string(),
    approvedInRound: z.string(),
    approvedBy: z.string(),
    createdAt: z.string().datetime(),
    breakingChange: z.boolean(),
  })
  .passthrough();
const roundScenarioSchema = z
  .object({
    roundId: z.string().min(1),
    scenarioId: z.string().min(1),
    scenarioVersion: z.string().min(1),
  })
  .passthrough();
const studyImportEntitiesSchema = z
  .object({
    studies: z.array(studySchema).min(1),
    rounds: z.array(roundSchema),
    scenarios: z.array(scenarioSchema),
    roundScenarios: z.array(roundScenarioSchema).optional(),
    changelog: z.array(changelogSchema),
  })
  .passthrough();

function validateStudyEntities(value: unknown): StudyImportEntities {
  const result = studyImportEntitiesSchema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(
      `Invalid study-config at entities.${issue.path.join(".") || "root"}: ${issue.message}`,
    );
  }
  const studies = result.data.studies.map((study) => ({
    ...study,
    config: {
      ...study.config,
      instrumentVersion: study.config.instrumentVersion ?? ("1.0.0" as const),
    },
  }));
  const studyInstrumentVersions = new Map(
    studies.map((study) => [study.studyId, study.config.instrumentVersion]),
  );
  const rounds = result.data.rounds.map((round) => ({
    ...round,
    instrumentVersion:
      round.instrumentVersion ??
      studyInstrumentVersions.get(round.studyId) ??
      ("1.0.0" as const),
  }));
  const mismatchedRound = rounds.find(
    (round) =>
      round.instrumentVersion !== studyInstrumentVersions.get(round.studyId),
  );
  if (mismatchedRound) {
    throw new Error(
      `Invalid study-config at entities.rounds: instrumentVersion ${mismatchedRound.instrumentVersion} does not match its study.`,
    );
  }
  let classificationDefaultsApplied = 0;
  const scenarios = result.data.scenarios.map((scenario) => {
    const missing =
      scenario.scenarioClass === undefined ||
      scenario.referenceSet === undefined;
    if (missing) classificationDefaultsApplied += 1;
    const normalized = {
      ...scenario,
      scenarioClass: scenario.scenarioClass ?? ("reference" as const),
      referenceSet: scenario.referenceSet ?? true,
      studyAlignment: scenario.studyAlignment ?? null,
    };
    if (
      normalized.scenarioClass === "research-extension" &&
      normalized.referenceSet
    ) {
      throw new Error(
        `Invalid study-config at entities.scenarios: research-extension scenario ${normalized.scenarioId} cannot belong to the reference set.`,
      );
    }
    return normalized;
  });
  const studyIds = new Set(studies.map(({ studyId }) => studyId));
  const invalidRound = rounds.find(({ studyId }) => !studyIds.has(studyId));
  if (invalidRound)
    throw new Error(
      `Invalid study-config at entities.rounds: unknown studyId ${invalidRound.studyId}.`,
    );
  const scenarioKeys = new Set(
    scenarios.map(
      ({ scenarioId, scenarioVersion }) => `${scenarioId}:${scenarioVersion}`,
    ),
  );
  const roundIds = new Set(rounds.map(({ roundId }) => roundId));
  const roundScenarios =
    result.data.roundScenarios ??
    rounds.flatMap(({ roundId }) =>
      scenarios.map(({ scenarioId, scenarioVersion }) => ({
        roundId,
        scenarioId,
        scenarioVersion,
      })),
    );
  const invalidAssignment = roundScenarios.find(
    (value) =>
      !roundIds.has(value.roundId) ||
      !scenarioKeys.has(`${value.scenarioId}:${value.scenarioVersion}`),
  );
  if (invalidAssignment)
    throw new Error(
      "Invalid study-config at entities.roundScenarios: unknown round or scenario version.",
    );
  return {
    ...result.data,
    studies,
    rounds,
    scenarios,
    roundScenarios,
    classificationDefaultsApplied,
  } as StudyImportEntities;
}

const aliases: Record<
  keyof Pick<
    Scenario,
    | "title"
    | "taskDescription"
    | "operatingConditions"
    | "availableInformation"
    | "vectorMaterialDescription"
    | "volumeOrConcentration"
    | "existingControls"
    | "contextualConstraints"
    | "intendedEvaluatorGroup"
    | "adminNotes"
  >,
  string[]
> = {
  title: ["title", "case", "scenario", "titulo", "título", "caso", "escenario"],
  taskDescription: [
    "taskdescription",
    "task description",
    "description",
    "descripcion",
    "descripción",
    "tarea",
  ],
  operatingConditions: [
    "operatingconditions",
    "operating conditions",
    "conditions",
    "condiciones operativas",
    "condiciones",
  ],
  availableInformation: [
    "availableinformation",
    "available information",
    "information",
    "informacion disponible",
    "información disponible",
  ],
  vectorMaterialDescription: [
    "vectormaterialdescription",
    "vector material description",
    "material",
    "descripcion del material",
    "descripción del material",
  ],
  volumeOrConcentration: [
    "volumeorconcentration",
    "volume or concentration",
    "volume",
    "concentration",
    "volumen o concentracion",
    "volumen o concentración",
  ],
  existingControls: [
    "existingcontrols",
    "existing controls",
    "controls",
    "controles existentes",
    "controles",
  ],
  contextualConstraints: [
    "contextualconstraints",
    "contextual constraints",
    "constraints",
    "restricciones contextuales",
    "restricciones",
  ],
  intendedEvaluatorGroup: [
    "intendedevaluatorgroup",
    "intended evaluator group",
    "evaluator group",
    "grupo evaluador",
  ],
  adminNotes: [
    "adminnotes",
    "admin notes",
    "notes",
    "notas administrativas",
    "notas",
  ],
};

const normalizedAliases = Object.entries(aliases).flatMap(([field, names]) =>
  names.map((name) => [normalizeKey(name), field] as const),
);

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function textValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function valueFor(record: SourceRecord, field: keyof typeof aliases): string {
  const keys = new Map(
    Object.entries(record).map(([key, value]) => [normalizeKey(key), value]),
  );
  for (const alias of aliases[field]) {
    const value = keys.get(normalizeKey(alias));
    if (value !== undefined) return textValue(value);
  }
  return "";
}

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizeScenario(record: SourceRecord, index: number): Scenario {
  const title = valueFor(record, "title");
  const taskDescription = valueFor(record, "taskDescription");
  if (!title || !taskDescription) {
    throw new Error(
      `Case ${index + 1} must include both title and taskDescription (or their Spanish equivalents).`,
    );
  }
  return {
    scenarioId: textValue(record.scenarioId) || makeId("imported-case"),
    scenarioVersion: textValue(record.scenarioVersion) || "1.0",
    title,
    taskDescription,
    operatingConditions:
      valueFor(record, "operatingConditions") ||
      "Not provided in the imported case.",
    availableInformation:
      valueFor(record, "availableInformation") ||
      "Not provided in the imported case.",
    vectorMaterialDescription:
      valueFor(record, "vectorMaterialDescription") ||
      "Not provided in the imported case.",
    volumeOrConcentration:
      valueFor(record, "volumeOrConcentration") || undefined,
    existingControls:
      valueFor(record, "existingControls") ||
      "Not provided in the imported case.",
    contextualConstraints:
      valueFor(record, "contextualConstraints") ||
      "Not provided in the imported case.",
    intendedEvaluatorGroup:
      valueFor(record, "intendedEvaluatorGroup") ||
      "Imported-case evaluator group",
    frameworkVersion: textValue(record.frameworkVersion) || "0.1.0-draft",
    adminNotes: valueFor(record, "adminNotes"),
    isDemo: false,
    scenarioClass: "user",
    referenceSet: false,
    studyAlignment: null,
  };
}

function entitiesForScenarios(
  scenarios: Scenario[],
  sourceName: string,
): StudyImportEntities {
  const now = new Date().toISOString();
  const studyId = makeId("imported-study");
  const study: Study = {
    studyId,
    title: `Imported cases — ${sourceName}`,
    description: `${scenarios.length} case(s) imported locally from ${sourceName}.`,
    createdAt: now,
    status: "active",
    config: {
      instrumentVersion: "1.0.0",
      includeRtlx: true,
      includeSus: true,
      confidenceScalePoints: 4,
      relevanceClarityScalePoints: 4,
    },
  };
  const round: Round = {
    roundId: makeId("imported-round"),
    studyId,
    roundNumber: 1,
    label: "Imported cases",
    frameworkVersion: "0.1.0-draft",
    instrumentVersion: "1.0.0",
    status: "open",
    evaluatorGroup: "Imported-case evaluator group",
    openedAt: now,
    lockedAt: null,
  };
  return {
    studies: [study],
    rounds: [round],
    scenarios,
    roundScenarios: scenarios.map(({ scenarioId, scenarioVersion }) => ({
      roundId: round.roundId,
      scenarioId,
      scenarioVersion,
    })),
    changelog: [],
  };
}

function parseCsvRows(input: string): string[][] {
  const firstLine = input.split(/\r?\n/, 1)[0] ?? "";
  const delimiter =
    (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0)
      ? ";"
      : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("The CSV contains an unterminated quoted field.");
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

export function parseCsvCases(
  input: string,
  sourceName = "CSV file",
): StudyImportEntities {
  const rows = parseCsvRows(input.replace(/^\uFEFF/, ""));
  if (rows.length < 2)
    throw new Error("The CSV must contain a header and at least one case row.");
  const [headers, ...data] = rows;
  const records = data.map((values) =>
    Object.fromEntries(
      headers.map((header, index) => [header, values[index] ?? ""]),
    ),
  );
  return entitiesForScenarios(records.map(normalizeScenario), sourceName);
}

function recordsFromLabeledText(input: string): SourceRecord[] {
  const lines = input.replace(/\r/g, "").split("\n");
  const records: SourceRecord[] = [];
  let record: SourceRecord = {};
  let activeField = "";
  const flush = () => {
    if (Object.keys(record).length) records.push(record);
    record = {};
    activeField = "";
  };
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(/^([^:]{2,50}):\s*(.*)$/);
    if (match) {
      const mapped = normalizedAliases.find(
        ([alias]) => alias === normalizeKey(match[1]),
      )?.[1];
      if (mapped) {
        if (mapped === "title" && record.title) flush();
        activeField = mapped;
        record[activeField] = match[2].trim();
        continue;
      }
    }
    if (activeField)
      record[activeField] = `${textValue(record[activeField])} ${line}`.trim();
  }
  flush();
  return records;
}

export function parseLabeledCases(
  input: string,
  sourceName: string,
): StudyImportEntities {
  const records = recordsFromLabeledText(input);
  if (!records.length) {
    throw new Error(
      "No cases were found. Use labeled fields such as Title: and Task description: (or Título: and Descripción:).",
    );
  }
  return entitiesForScenarios(records.map(normalizeScenario), sourceName);
}

export function parseJsonCases(
  input: string,
  sourceName: string,
): StudyImportEntities {
  let nativeInput = input;
  try {
    const candidate = JSON.parse(input) as {
      schemaVersion?: string;
      exportType?: string;
      generatedAt?: string | null;
      entities?: Record<string, unknown>;
    };
    if (candidate?.exportType === "study-config") {
      if (candidate.schemaVersion === "1.0") candidate.schemaVersion = "1.0.0";
      if (!candidate.generatedAt)
        candidate.generatedAt = "1970-01-01T00:00:00.000Z";
      const entities = candidate.entities;
      if (entities) {
        if (!Array.isArray(entities.studies) && entities.study)
          entities.studies = [entities.study];
        if (!Array.isArray(entities.changelog)) entities.changelog = [];
        for (const study of (entities.studies as SourceRecord[]) ?? []) {
          if (!study.createdAt) study.createdAt = "1970-01-01T00:00:00.000Z";
        }
        for (const round of (entities.rounds as SourceRecord[]) ?? []) {
          if (!round.openedAt) round.openedAt = "1970-01-01T00:00:00.000Z";
        }
      }
      nativeInput = JSON.stringify(candidate);
    }
  } catch {
    // The normal parser below reports malformed JSON consistently.
  }
  try {
    return validateStudyEntities(
      parseEnvelope<unknown>(nativeInput, "study-config").entities,
    );
  } catch (envelopeError) {
    let value: unknown;
    try {
      value = JSON.parse(input);
    } catch {
      throw envelopeError;
    }
    if (
      value &&
      typeof value === "object" &&
      (value as { exportType?: unknown }).exportType === "study-config"
    ) {
      throw envelopeError;
    }
    const records = Array.isArray(value)
      ? value
      : value &&
          typeof value === "object" &&
          Array.isArray((value as { scenarios?: unknown }).scenarios)
        ? (value as { scenarios: unknown[] }).scenarios
        : [value];
    if (
      !records.every(
        (record) =>
          record && typeof record === "object" && !Array.isArray(record),
      )
    ) {
      throw new Error(
        "JSON cases must be an object, an array of objects, or an object with a scenarios array.",
      );
    }
    return entitiesForScenarios(
      (records as SourceRecord[]).map(normalizeScenario),
      sourceName,
    );
  }
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  return result.value;
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() })
    .promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item) => ("str" in item ? item.str : "")).join("\n"),
    );
  }
  return pages.join("\n");
}

export async function importStudyFile(
  file: File,
): Promise<StudyImportEntities> {
  const requestedExtension = file.name.split(".").pop()?.toLowerCase();
  if (requestedExtension === "doc") {
    throw new Error(
      "Legacy .doc files are not supported. Save the document as .docx and try again.",
    );
  }
  const extension = validateImportFile(file, ["json", "csv", "docx", "pdf"]);
  if (extension === "json") return parseJsonCases(await file.text(), file.name);
  if (extension === "csv") return parseCsvCases(await file.text(), file.name);
  if (extension === "docx")
    return parseLabeledCases(await extractDocx(file), file.name);
  if (extension === "pdf")
    return parseLabeledCases(await extractPdf(file), file.name);
  throw new Error("Unsupported file type. Select JSON, CSV, DOCX, or PDF.");
}
