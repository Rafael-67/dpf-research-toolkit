import type { EvaluationSession } from "./types";
import { INSTRUMENT_VERSION } from "../framework/fields";
import { z } from "zod";

const rating = z.number().int().min(1).max(4).nullable();
const selection = z.object({
  value: z.string().min(1),
  otherText: z.string().optional(),
});
const ordinal5 = z.number().int().min(1).max(5);
const canonicalObservationSchema = z
  .object({
    observationId: z.string().min(1),
    fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
    category: selection,
    taskPhases: z.array(selection).min(1),
    evidenceSources: z.array(selection).min(1),
    ratings: z.object({
      analyticalRelevance: ordinal5,
      evidenceStrength: ordinal5,
      expectedInfluenceOnDeliveredProtection: ordinal5,
      evaluatorCertainty: ordinal5,
      consensusPriority: ordinal5.optional(),
    }),
    reasoningSummary: z.string().min(1).max(500),
    extendedComments: z.string().max(2000).optional(),
    createdAt: z.string().datetime(),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (
      (value.category.value === "other" ||
        value.category.value.startsWith("other_")) &&
      !value.category.otherText?.trim()
    )
      ctx.addIssue({
        code: "custom",
        path: ["category", "otherText"],
        message: "otherText is required for Other",
      });
    if (
      value.taskPhases.some((v) => v.value === "other" && !v.otherText?.trim())
    )
      ctx.addIssue({
        code: "custom",
        message: "task phase otherText is required",
      });
    if (
      value.evidenceSources.some(
        (v) => v.value === "other" && !v.otherText?.trim(),
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "evidence source otherText is required",
      });
    const field = value as Record<string, unknown>;
    const requiredByField: Record<string, string[]> = {
      F1: [
        "taskFamily",
        "taskOperations",
        "workMode",
        "systemOpenness",
        "materialPhysicalState",
        "vesselOrDevice",
      ],
      F2: [
        "demandDomains",
        "demandFactors",
        "demandIntensity",
        "exposureDuration",
        "frequencyPattern",
        "variabilityPattern",
        "recoveryAvailability",
        "temporalLocation",
        "coincidesWithMaterialHandling",
        "coincidesWithOpenHandling",
      ],
      F3: [
        "initiatingConditions",
        "deviationTypes",
        "operationalOutcomes",
        "releasePathways",
        "causalChain",
        "detectability",
        "reversibility",
      ],
      F4: [
        "materialCategories",
        "biologicalMaterialStatus",
        "concentrationComparison",
        "volumeComparison",
        "containerState",
        "manipulationCharacteristics",
        "informationSufficiency",
        "missingInformation",
      ],
      F5: [
        "controlLayer",
        "controls",
        "controlFunctions",
        "humanPerformanceDependencies",
        "failureConditions",
        "gapStatus",
        "gapTypes",
        "recoveryControlStatus",
      ],
      F6: [
        "indicatorName",
        "constructTypes",
        "measurementForms",
        "expectedDirection",
        "interpretationAmbiguity",
        "observationMethods",
        "feasibility",
        "disambiguationCriterion",
      ],
    };
    requiredByField[value.fieldId].forEach((key) => {
      const item = field[key];
      if (
        item === undefined ||
        item === null ||
        item === "" ||
        (Array.isArray(item) && item.length === 0)
      )
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: `${key} is required for ${value.fieldId}`,
        });
    });
  });
const legacyObservationSchema = z
  .object({
    id: z.string().min(1),
    fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
    category: z.string().min(1),
    isOtherCategory: z.boolean(),
    otherCategoryText: z.string().optional(),
    taskPhases: z.array(selection).min(1),
    analyticalRelevance: z.enum(["low", "moderate", "high", "undetermined"]),
    evidenceSources: z.array(selection).min(1),
    evaluatorCertainty: z.enum(["low", "moderate", "high"]),
    rationale: z.string().min(1).max(500),
    createdAt: z.string().datetime(),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (value.isOtherCategory && !value.otherCategoryText?.trim())
      ctx.addIssue({
        code: "custom",
        message: "otherCategoryText is required",
      });
  });
const observationSchema = z.union([
  canonicalObservationSchema,
  legacyObservationSchema,
]);
const fieldResponseSchema = z
  .object({
    fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
    narrativeAnswer: z.string(),
    categoricalAnswer: z.string().optional(),
    openComment: z.string(),
    changeProposal: z.string(),
    confidenceRating: rating,
    relevance: rating,
    clarity: rating,
    exhaustiveness: rating,
    redundancy: rating,
    applicability: rating,
    interpretationDifficulty: rating,
    insufficientInformation: z.boolean(),
    timeSpentSeconds: z.number().nonnegative(),
    revisionCount: z.number().int().nonnegative(),
    helpAccessedCount: z.number().int().nonnegative(),
    responseMode: z
      .enum(["legacy_narrative", "structured_narrative"])
      .optional(),
    observations: z.array(observationSchema).optional(),
    noObservationReason: z
      .enum(["insufficient_information", "field_not_applicable"])
      .nullable()
      .optional(),
    overallSynthesis: z.string().nullable().optional(),
    fieldSummary: z
      .object({
        fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
        dominantCategories: z.array(selection).min(1),
        overallAnalyticalRelevance: ordinal5,
        informationSufficiency: ordinal5,
        internalConsistencyOfEvidence: ordinal5,
        consensusPriority: ordinal5,
        reasoningSummary: z.string().min(1).max(500),
        extendedComments: z.string().max(2000).optional(),
      })
      .nullable()
      .optional(),
  })
  .passthrough();
const evaluationSessionSchema = z
  .object({
    sessionId: z.string().min(1),
    evaluatorPseudonym: z.string().min(1),
    studyId: z.string().min(1),
    roundId: z.string().min(1),
    scenarioId: z.string().min(1),
    scenarioVersion: z.string().min(1),
    scenarioClass: z
      .enum(["reference", "research-extension", "user"])
      .optional(),
    referenceSet: z.boolean().optional(),
    studyAlignment: z.string().nullable().optional(),
    instrumentVersion: z.enum(["1.0", "1.0.0", "1.1.0"]).optional(),
    frameworkVersion: z.string().min(1),
    fieldDefinitionVersions: z.record(
      z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
      z.string().min(1),
    ),
    evaluationStatus: z.enum([
      "not_started",
      "in_progress",
      "in_review",
      "completed",
      "abandoned",
      "submitted",
      "returned_for_revision",
      "resubmitted",
      "locked",
      "included_in_analysis",
      "excluded_from_analysis",
    ]),
    metadata: z
      .object({
        appVersion: z.string().min(1),
        userAgent: z.string(),
        viewportClass: z.enum(["desktop", "tablet"]),
        locale: z.string().min(1),
      })
      .passthrough(),
    fieldResponses: z.array(fieldResponseSchema).length(6),
    nasaTlx: z.record(z.string(), z.number().min(0).max(100)).nullable(),
    sus: z
      .object({
        itemScores: z.array(z.number().int().min(1).max(5)).length(10),
      })
      .nullable(),
    openFeedback: z.object({
      burden: z.string(),
      ambiguity: z.string(),
      usefulness: z.string(),
    }),
    fictionalScenarioConfirmed: z.boolean(),
    startedAt: z.string().datetime(),
    reviewedAt: z.string().datetime().nullable(),
    finishedAt: z.string().datetime().nullable(),
    abandonedAt: z.string().datetime().nullable(),
    resumedAt: z.array(z.string().datetime()).nullable(),
    dataSchemaVersion: z.enum(["1.0", "1.1", "1.2"]).optional(),
    structuredItemSetVersion: z.literal("0.1-exploratory").optional(),
    taxonomyItemRatings: z
      .record(
        z.string(),
        z.array(
          z.union([
            z.object({
              fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
              taxonomyGroup: z.string().min(1),
              taxonomyItemValue: z.string().min(1),
              relevance: ordinal5,
              clarity: ordinal5,
              distinctiveness: ordinal5,
              expectedFrequencyOfUse: ordinal5.optional(),
              missingContext: z.boolean().optional(),
              suggestedReplacement: z.string().optional(),
              comment: z.string().optional(),
            }),
            z.object({
              fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
              categoryId: z.string().min(1),
              rating: z.number().int().min(1).max(4),
              otherCategoryText: z.string().optional(),
            }),
          ]),
        ),
      )
      .optional(),
    taxonomyReview: z
      .object({
        taxonomyItemRatings: z.array(z.unknown()),
        missingItems: z.array(
          z.object({
            fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
            taxonomyGroup: z.string().min(1),
            proposedValue: z.string().min(1),
            rationale: z.string().optional(),
          }),
        ),
        redundantItems: z.array(
          z.object({
            fieldId: z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]),
            taxonomyGroup: z.string().min(1),
            firstItemValue: z.string().min(1),
            secondItemValue: z.string().min(1),
            rationale: z.string().min(1),
          }),
        ),
      })
      .optional(),
    submittedAt: z.string().datetime().nullable().optional(),
    lockedAt: z.string().datetime().nullable().optional(),
    exclusionReason: z.string().nullable().optional(),
    assignedEvaluatorId: z.string().optional(),
  })
  .passthrough()
  .superRefine((session, ctx) => {
    if (session.instrumentVersion === "1.1.0") {
      session.fieldResponses.forEach((response, index) => {
        if (response.responseMode !== "structured_narrative")
          ctx.addIssue({
            code: "custom",
            path: ["fieldResponses", index, "responseMode"],
            message: "v1.1 requires structured_narrative",
          });
        if (!response.observations?.length && !response.noObservationReason)
          ctx.addIssue({
            code: "custom",
            path: ["fieldResponses", index, "observations"],
            message: "v1.1 requires observations or a reason",
          });
      });
      if (session.structuredItemSetVersion !== "0.1-exploratory")
        ctx.addIssue({
          code: "custom",
          path: ["structuredItemSetVersion"],
          message: "v1.1 taxonomy version is required",
        });
      if (session.dataSchemaVersion === "1.2")
        session.fieldResponses.forEach((response, index) => {
          if (
            response.observations?.length &&
            !response.fieldSummary?.reasoningSummary
          )
            ctx.addIssue({
              code: "custom",
              path: ["fieldResponses", index, "fieldSummary"],
              message: "schema 1.2 requires a field summary",
            });
        });
      if (
        session.evaluationStatus === "excluded_from_analysis" &&
        !session.exclusionReason?.trim()
      )
        ctx.addIssue({
          code: "custom",
          path: ["exclusionReason"],
          message: "exclusionReason is required for excluded records",
        });
    }
  });

export function normalizeEvaluationSession(
  value:
    | EvaluationSession
    | (Omit<EvaluationSession, "instrumentVersion"> & {
        instrumentVersion?: string;
      }),
): EvaluationSession {
  return {
    ...value,
    instrumentVersion:
      value.instrumentVersion === "1.0"
        ? INSTRUMENT_VERSION
        : value.instrumentVersion || INSTRUMENT_VERSION,
    scenarioClass: value.scenarioClass || "reference",
    referenceSet: value.referenceSet ?? true,
    studyAlignment: value.studyAlignment ?? null,
  } as EvaluationSession;
}

export function validateEvaluationSessions(
  value: unknown,
): EvaluationSession[] {
  const result = z
    .object({ sessions: z.array(evaluationSessionSchema).min(1) })
    .safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(
      `Invalid evaluation export at entities.${issue.path.join(".") || "root"}: ${issue.message}`,
    );
  }
  return result.data.sessions.map((session) =>
    normalizeEvaluationSession(
      session as Parameters<typeof normalizeEvaluationSession>[0],
    ),
  );
}

interface EvaluationExportContext {
  schemaVersion?: string;
  appVersion?: string;
  instrumentVersion?: string;
  structuredItemSetVersion?: string;
}

/**
 * Accepts both the canonical { sessions: [] } payload and early v1.1
 * { session: {} } exports. Only absent technical metadata is supplied;
 * scientific field responses and observations are never rewritten.
 */
export function adaptEvaluationExportEntities(
  value: unknown,
  context: EvaluationExportContext = {},
): { sessions: unknown[] } {
  if (!value || typeof value !== "object")
    throw new Error("Invalid evaluation export: entities must be an object.");
  const entities = value as {
    session?: unknown;
    sessions?: unknown;
  };
  const sourceSessions = Array.isArray(entities.sessions)
    ? entities.sessions
    : entities.session && typeof entities.session === "object"
      ? [entities.session]
      : null;
  if (!sourceSessions?.length)
    throw new Error(
      "Invalid evaluation export: entities.session or entities.sessions is required.",
    );
  const fieldVersions = Object.fromEntries(
    ["F1", "F2", "F3", "F4", "F5", "F6"].map((fieldId) => [
      fieldId,
      "legacy-v1.1-export",
    ]),
  );
  return {
    sessions: sourceSessions.map((source) => {
      if (!source || typeof source !== "object") return source;
      const session = source as Record<string, unknown>;
      const scenarioId = String(session.scenarioId ?? "");
      const isResearchExtension =
        scenarioId === "ORG-01" || scenarioId === "INC-01";
      return {
        ...session,
        scenarioClass:
          session.scenarioClass ??
          (isResearchExtension ? "research-extension" : "reference"),
        referenceSet:
          session.referenceSet ?? (isResearchExtension ? false : true),
        studyAlignment:
          session.studyAlignment ??
          (isResearchExtension ? "separate-exploratory-round" : null),
        instrumentVersion:
          session.instrumentVersion ?? context.instrumentVersion ?? "1.1.0",
        dataSchemaVersion:
          session.dataSchemaVersion ??
          (context.schemaVersion === "1.2" ? "1.2" : "1.1"),
        structuredItemSetVersion:
          session.structuredItemSetVersion ??
          context.structuredItemSetVersion ??
          "0.1-exploratory",
        fieldDefinitionVersions:
          session.fieldDefinitionVersions ?? fieldVersions,
        metadata: session.metadata ?? {
          appVersion: context.appVersion ?? "legacy-v1.1-export",
          userAgent: "",
          viewportClass: "desktop",
          locale: "und",
        },
        resumedAt: session.resumedAt ?? null,
      };
    }),
  };
}
