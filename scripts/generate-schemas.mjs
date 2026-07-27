import { mkdir, writeFile } from "node:fs/promises";
import { z } from "zod";

const iso = z.string().datetime();
const fieldId = z.enum(["F1", "F2", "F3", "F4", "F5", "F6"]);
const rating = z.number().int().min(1).max(4).nullable();
const selection = z.object({
  value: z.string(),
  otherText: z.string().optional(),
});
const ordinal5 = z.number().int().min(1).max(5);
const structuredObservation = z
  .object({
    observationId: z.string(),
    fieldId,
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
    createdAt: iso,
  })
  .passthrough();
const legacyObservation = z
  .object({
    id: z.string(),
    fieldId,
    category: z.string(),
    isOtherCategory: z.boolean(),
    otherCategoryText: z.string().optional(),
    taskPhases: z.array(selection).min(1),
    analyticalRelevance: z.enum(["low", "moderate", "high", "undetermined"]),
    evidenceSources: z.array(selection).min(1),
    evaluatorCertainty: z.enum(["low", "moderate", "high"]),
    rationale: z.string().min(1).max(500),
    createdAt: iso,
  })
  .passthrough();
const observation = z.union([structuredObservation, legacyObservation]);
const study = z
  .object({
    studyId: z.string().min(1),
    title: z.string().min(1),
    description: z.string(),
    createdAt: iso,
    status: z.enum(["draft", "active", "closed", "archived"]),
    config: z
      .object({
        instrumentVersion: z.enum(["1.0.0", "1.1.0"]),
        includeRtlx: z.boolean(),
        includeSus: z.boolean(),
        confidenceScalePoints: z.number().int().positive(),
        relevanceClarityScalePoints: z.number().int().positive(),
      })
      .passthrough(),
  })
  .passthrough();
const round = z
  .object({
    roundId: z.string().min(1),
    studyId: z.string().min(1),
    roundNumber: z.number().int().positive(),
    label: z.string().min(1),
    frameworkVersion: z.string().min(1),
    instrumentVersion: z.enum(["1.0.0", "1.1.0"]),
    status: z.enum(["open", "locked"]),
    evaluatorGroup: z.string().min(1),
    openedAt: iso,
    lockedAt: iso.nullable(),
  })
  .passthrough();
const scenario = z
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
    scenarioClass: z.enum(["reference", "research-extension", "user"]),
    referenceSet: z.boolean(),
    studyAlignment: z.string().nullable(),
  })
  .passthrough();
const studyEntities = z
  .object({
    studies: z.array(study).min(1),
    rounds: z.array(round),
    roundScenarios: z
      .array(
        z
          .object({
            roundId: z.string().min(1),
            scenarioId: z.string().min(1),
            scenarioVersion: z.string().min(1),
          })
          .passthrough(),
      )
      .optional(),
    scenarios: z.array(scenario),
    changelog: z.array(
      z
        .object({
          entryId: z.string().min(1),
          fieldId,
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
            "taxonomy_revision",
          ]),
          rationale: z.string(),
          approvedInRound: z.string(),
          approvedBy: z.string(),
          createdAt: iso,
          breakingChange: z.boolean(),
        })
        .passthrough(),
    ),
    profiles: z
      .array(
        z.object({
          profileId: z.string(),
          pseudonym: z.string(),
          role: z.enum([
            "system_administrator",
            "study_coordinator",
            "evaluator",
            "consensus_reviewer",
            "read_only_analyst",
          ]),
          active: z.boolean(),
          createdAt: iso,
        }),
      )
      .optional(),
    assignments: z
      .array(
        z.object({
          assignmentId: z.string(),
          studyId: z.string(),
          roundId: z.string(),
          scenarioId: z.string(),
          evaluatorProfileId: z.string(),
          createdAt: iso,
          status: z.enum(["assigned", "completed", "withdrawn"]),
        }),
      )
      .optional(),
    consensusRecords: z
      .array(
        z.object({
          consensusId: z.string(),
          studyId: z.string(),
          roundId: z.string(),
          scenarioId: z.string(),
          fieldId,
          sourceSessionIds: z.array(z.string()).min(2),
          reviewerProfileId: z.string(),
          decision: z.enum(["retain", "revise", "unresolved"]),
          rationale: z.string(),
          createdAt: iso,
          lockedAt: iso.nullable(),
        }),
      )
      .optional(),
    auditEvents: z
      .array(
        z.object({
          auditEventId: z.string(),
          action: z.enum([
            "creation",
            "editing",
            "submission",
            "reopening",
            "locking",
            "exclusion",
            "import",
            "export",
            "taxonomy_change",
            "consensus_decision",
            "role_change",
            "archive",
            "duplication",
          ]),
          entityType: z.string(),
          entityId: z.string(),
          actorProfileId: z.string().nullable(),
          occurredAt: iso,
          details: z.record(z.string(), z.unknown()),
        }),
      )
      .optional(),
  })
  .passthrough();
const fieldResponse = z
  .object({
    fieldId,
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
    observations: z.array(observation).optional(),
    noObservationReason: z
      .enum(["insufficient_information", "field_not_applicable"])
      .nullable()
      .optional(),
    overallSynthesis: z.string().nullable().optional(),
    fieldSummary: z
      .object({
        fieldId,
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
const session = z
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
    instrumentVersion: z.enum(["1.0.0", "1.1.0"]).optional(),
    frameworkVersion: z.string().min(1),
    fieldDefinitionVersions: z.record(fieldId, z.string().min(1)),
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
    fieldResponses: z.array(fieldResponse).length(6),
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
    startedAt: iso,
    reviewedAt: iso.nullable(),
    finishedAt: iso.nullable(),
    abandonedAt: iso.nullable(),
    resumedAt: z.array(iso).nullable(),
    dataSchemaVersion: z.enum(["1.0", "1.1", "1.2"]).optional(),
    structuredItemSetVersion: z.literal("0.1-exploratory").optional(),
    taxonomyItemRatings: z
      .record(
        z.string(),
        z.array(
          z.union([
            z.object({
              fieldId,
              taxonomyGroup: z.string(),
              taxonomyItemValue: z.string(),
              relevance: ordinal5,
              clarity: ordinal5,
              distinctiveness: ordinal5,
              expectedFrequencyOfUse: ordinal5.optional(),
              missingContext: z.boolean().optional(),
              suggestedReplacement: z.string().optional(),
              comment: z.string().optional(),
            }),
            z.object({
              fieldId,
              categoryId: z.string(),
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
            fieldId,
            taxonomyGroup: z.string(),
            proposedValue: z.string(),
            rationale: z.string().optional(),
          }),
        ),
        redundantItems: z.array(
          z.object({
            fieldId,
            taxonomyGroup: z.string(),
            firstItemValue: z.string(),
            secondItemValue: z.string(),
            rationale: z.string(),
          }),
        ),
      })
      .optional(),
    submittedAt: iso.nullable().optional(),
    lockedAt: iso.nullable().optional(),
    exclusionReason: z.string().nullable().optional(),
    assignedEvaluatorId: z.string().optional(),
  })
  .passthrough();
const envelope = (exportType, entities) =>
  z.object({
    schemaVersion: z.literal("1.0.0"),
    exportType: z.literal(exportType),
    appVersion: z.string(),
    generatedAt: iso,
    exportVersion: z.literal("1.1.0"),
    entities,
  });
await mkdir("specifications/schema", { recursive: true });
for (const [name, schema] of [
  ["study-config.schema.json", envelope("study-config", studyEntities)],
  [
    "evaluation-session.schema.json",
    envelope(
      "evaluation-session",
      z.object({ sessions: z.array(session).min(1) }),
    ),
  ],
]) {
  const json = z.toJSONSchema(schema, { target: "draft-7" });
  await writeFile(
    `specifications/schema/${name}`,
    `${JSON.stringify({ $schema: "http://json-schema.org/draft-07/schema#", title: name, ...json }, null, 2)}\n`,
  );
}
