import { CORE_VERSION, SCHEMA_VERSION } from "../config/versions";
import { normalizeScientificStatus } from "../domain/phase0Lifecycle";
import type { EvaluationSession, Institution } from "../domain/types";

export interface MigrationSimulation {
  migrated: EvaluationSession & {
    _migration: {
      sourceSchemaVersion: string;
      targetSchemaVersion: string;
      simulatedAt: string;
      original: EvaluationSession;
    };
  };
  institutions: Institution[];
  warnings: string[];
}

export function simulateSessionMigration(
  source: EvaluationSession,
): MigrationSimulation {
  if ("_migration" in source)
    return {
      migrated: structuredClone(source) as MigrationSimulation["migrated"],
      institutions: [],
      warnings: [],
    };
  const original = structuredClone(source);
  const code = String(
    (source.metadata as Record<string, unknown>).institutionCode ?? "",
  ).trim();
  const institutionId = source.institutionId
    ? source.institutionId
    : code
      ? `INST-${source.studyId}-${code}`.replace(/[^A-Za-z0-9-]/g, "-")
      : undefined;
  const migrated = {
    ...structuredClone(source),
    evaluatorId: source.evaluatorId ?? source.evaluatorPseudonym,
    institutionId,
    coreVersion: source.coreVersion ?? CORE_VERSION,
    schemaVersion: SCHEMA_VERSION,
    taxonomyVersion:
      source.taxonomyVersion ??
      source.structuredItemSetVersion ??
      "legacy-unspecified",
    scientificStatus:
      source.scientificStatus ??
      normalizeScientificStatus(source.evaluationStatus),
    completedAt: source.completedAt ?? source.finishedAt,
    documentSnapshots: source.documentSnapshots ?? [],
    _migration: {
      sourceSchemaVersion:
        source.schemaVersion ??
        source.dataSchemaVersion ??
        "legacy-unspecified",
      targetSchemaVersion: SCHEMA_VERSION,
      simulatedAt: new Date().toISOString(),
      original,
    },
  } as MigrationSimulation["migrated"];
  return {
    migrated,
    institutions:
      code && institutionId
        ? [
            {
              institutionId,
              studyId: source.studyId,
              institutionCode: code,
              displayName: null,
              active: true,
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
    warnings: code
      ? []
      : ["No legacy institutionCode was available; no Institution inferred."],
  };
}
