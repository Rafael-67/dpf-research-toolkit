export type FieldId = "F1" | "F2" | "F3" | "F4" | "F5" | "F6";
export type InstrumentVersion = "1.0.0" | "1.1.0";
export type RatingVariable =
  | "confidenceRating"
  | "relevance"
  | "clarity"
  | "exhaustiveness"
  | "redundancy"
  | "applicability"
  | "interpretationDifficulty";

export interface FrameworkFieldDefinition {
  fieldId: FieldId;
  name: string;
  promptText: string;
  responseType: "narrative" | "categorical" | "ordinal";
  categoricalOptions?: string[];
  ordinalScale?: { min: number; max: number; labels: string[] };
  frameworkVersion: string;
  fieldDefinitionVersion: string;
}

export interface StudyConfig {
  instrumentVersion?: InstrumentVersion;
  includeRtlx: boolean;
  includeSus: boolean;
  confidenceScalePoints: number;
  relevanceClarityScalePoints: number;
}

export interface Study {
  studyId: string;
  title: string;
  description: string;
  createdAt: string;
  status: "draft" | "active" | "closed" | "archived";
  config: StudyConfig;
  metadata?: Record<string, string>;
  duplicatedFromStudyId?: string;
  archivedAt?: string | null;
}

export interface Round {
  roundId: string;
  studyId: string;
  roundNumber: number;
  label: string;
  frameworkVersion: string;
  instrumentVersion?: InstrumentVersion;
  status: "open" | "locked";
  evaluatorGroup: string;
  openedAt: string;
  lockedAt: string | null;
}

export interface RoundScenario {
  roundId: string;
  scenarioId: string;
  scenarioVersion: string;
}

export type ScenarioClass = "reference" | "research-extension" | "user";
export type ScientificSessionStatus =
  | "draft"
  | "in_progress"
  | "in_review"
  | "completed"
  | "locked"
  | "abandoned"
  | "excluded";

export interface Scenario {
  scenarioId: string;
  scenarioVersion: string;
  title: string;
  taskDescription: string;
  operatingConditions: string;
  availableInformation: string;
  vectorMaterialDescription: string;
  volumeOrConcentration?: string;
  existingControls: string;
  contextualConstraints: string;
  intendedEvaluatorGroup: string;
  frameworkVersion: string;
  adminNotes: string;
  isDemo: boolean;
  scenarioClass: ScenarioClass;
  referenceSet: boolean;
  studyAlignment: string | null;
  studyId?: string;
  validationStatus?: "reference" | "exploratory" | "unvalidated";
  includedInPrimaryStudy?: boolean;
}

export interface FieldResponse {
  fieldId: FieldId;
  narrativeAnswer: string;
  categoricalAnswer?: string;
  openComment: string;
  changeProposal: string;
  confidenceRating: number | null;
  relevance: number | null;
  clarity: number | null;
  exhaustiveness: number | null;
  redundancy: number | null;
  applicability: number | null;
  interpretationDifficulty: number | null;
  insufficientInformation: boolean;
  timeSpentSeconds: number;
  revisionCount: number;
  helpAccessedCount: number;
  responseMode?: "legacy_narrative" | "structured_narrative";
  observations?: StoredObservation[];
  noObservationReason?:
    "insufficient_information" | "field_not_applicable" | null;
  overallSynthesis?: string | null;
  fieldSummary?: FieldSummaryRating | null;
}

export type TaskPhase =
  | "pre_task_preparation"
  | "initial_phase"
  | "intermediate_phase"
  | "final_phase"
  | "critical_sub_step"
  | "transition"
  | "interruption"
  | "resumption"
  | "whole_task"
  | "other";
export type EvidenceSource =
  | "scenario_information"
  | "direct_observation"
  | "video_or_image"
  | "procedure_or_sop"
  | "equipment_documentation"
  | "measurement_or_instrument"
  | "operator_report"
  | "supervisor_report"
  | "incident_or_deviation_record"
  | "training_record"
  | "maintenance_or_certification_record"
  | "professional_experience"
  | "published_evidence"
  | "sop_documentation"
  | "operator_interview"
  | "electronic_record"
  | "instrumental_measurement"
  | "evaluator_inference"
  | "insufficient_information"
  | "other";
export interface Selection<T extends string> {
  value: T;
  otherText?: string;
}
export type OrdinalRating5 = 1 | 2 | 3 | 4 | 5;
export type EvidenceSourceSelection = Selection<EvidenceSource>;
export interface QuantitativeObservationRatings {
  analyticalRelevance: OrdinalRating5;
  evidenceStrength: OrdinalRating5;
  expectedInfluenceOnDeliveredProtection: OrdinalRating5;
  evaluatorCertainty: OrdinalRating5;
  consensusPriority?: OrdinalRating5;
}
export interface BaseObservation {
  observationId: string;
  fieldId: FieldId;
  category: Selection<string>;
  taskPhases: Selection<TaskPhase>[];
  evidenceSources: EvidenceSourceSelection[];
  ratings: QuantitativeObservationRatings;
  reasoningSummary: string;
  extendedComments?: string;
  createdAt: string;
}
export interface F1Observation extends BaseObservation {
  fieldId: "F1";
  taskFamily: Selection<string>;
  taskOperations: Selection<string>[];
  workMode: Selection<string>;
  systemOpenness: Selection<string>;
  materialPhysicalState: Selection<string>[];
  vesselOrDevice: Selection<string>[];
  subPhase?: { name: string; description?: string };
  taskDurationBand?: string;
  repetitionPattern?: string;
  automationLevel?: string;
  personnelConfiguration?: string;
  locationWithinLaboratory?: Selection<string>;
  taskCriticality?: OrdinalRating5;
}
export interface F2Observation extends BaseObservation {
  fieldId: "F2";
  demandDomains: Selection<string>[];
  demandFactors: Selection<string>[];
  bodyRegions?: Selection<string>[];
  demandIntensity: OrdinalRating5;
  exposureDuration: string;
  frequencyPattern: string;
  variabilityPattern: string;
  recoveryAvailability: string;
  temporalLocation: Selection<TaskPhase>[];
  coincidesWithMaterialHandling: "yes" | "no" | "partial" | "unknown";
  coincidesWithOpenHandling: "yes" | "no" | "partial" | "unknown";
  ppeContributors?: Selection<string>[];
  environmentalContributors?: Selection<string>[];
  peakDemand?: { phase?: Selection<TaskPhase>; description: string };
}
export interface F3CausalChain {
  initiatingConditionIds: string[];
  deviationTypeIds: string[];
  operationalOutcomeIds: string[];
  releasePathwayIds: string[];
  chainSummary: string;
}
export interface F3Observation extends BaseObservation {
  fieldId: "F3";
  initiatingConditions: Selection<string>[];
  deviationTypes: Selection<string>[];
  operationalOutcomes: Selection<string>[];
  releasePathways: Selection<string>[];
  exposureRoutes?: Selection<string>[];
  affectedTargets?: Selection<string>[];
  causalChain: F3CausalChain;
  detectability: OrdinalRating5;
  reversibility: OrdinalRating5;
}
export interface ConcentrationValue {
  rawValue?: number;
  unit?: string;
  descriptiveBand: Selection<string>;
}
export interface F4Observation extends BaseObservation {
  fieldId: "F4";
  materialCategories: Selection<string>[];
  biologicalMaterialStatus: Selection<string>[];
  concentration?: ConcentrationValue;
  volumeBand?: Selection<string>;
  concentrationComparison: string;
  volumeComparison: string;
  containerState: Selection<string>;
  manipulationCharacteristics: Selection<string>[];
  vectorOrConstructFeatures?: Selection<string>[];
  informationSufficiency: string;
  missingInformation: Selection<string>[];
}
export interface F5Observation extends BaseObservation {
  fieldId: "F5";
  controlLayer: Selection<string>;
  controls: Selection<string>[];
  controlFunctions: Selection<string>[];
  humanPerformanceDependencies: Selection<string>[];
  failureConditions: Selection<string>[];
  gapStatus: string;
  gapTypes: Selection<string>[];
  recoveryControlStatus: string;
  verificationEvidence?: Selection<string>[];
}
export interface F6Observation extends BaseObservation {
  fieldId: "F6";
  indicatorName: string;
  constructTypes: Selection<string>[];
  measurementForms: Selection<string>[];
  expectedDirection: Selection<string>;
  interpretationAmbiguity: Selection<string>;
  observationMethods: Selection<string>[];
  feasibility: OrdinalRating5;
  sensitivityExpected?: OrdinalRating5;
  specificityExpected?: OrdinalRating5;
  standardisationPotential?: OrdinalRating5;
  intrusiveness?: OrdinalRating5;
  resourceBurden?: OrdinalRating5;
  disambiguationCriterion: string;
}
export type Observation =
  | F1Observation
  | F2Observation
  | F3Observation
  | F4Observation
  | F5Observation
  | F6Observation;

export interface LegacyObservation {
  id: string;
  fieldId: FieldId;
  category: string;
  isOtherCategory: boolean;
  otherCategoryText?: string;
  taskPhases: Selection<TaskPhase>[];
  analyticalRelevance: "low" | "moderate" | "high" | "undetermined";
  evidenceSources: Selection<EvidenceSource>[];
  evaluatorCertainty: "high" | "moderate" | "low";
  rationale: string;
  createdAt: string;
  subPhaseName?: string;
  actions?: string;
  materialState?: "open" | "closed" | "not_applicable";
  durationBand?: "lt_5_min" | "5_15_min" | "15_30_min" | "gt_30_min";
  criticalSubPhase?: boolean;
  dominantDemandPrimary?: string;
  dominantDemandSecondary?: string[];
  peakDemandPhase?: Selection<TaskPhase>;
  peakDemandCategory?: string;
  peakDemandEvidence?: Selection<EvidenceSource>;
  coincidesWithMaterialHandling?: "yes" | "no" | "uncertain";
  deviationType?: string[];
  initiatingConditions?: string[];
  operationalOutcome?: string[];
  releasePathway?: string[];
  causalChain?: {
    conditionOrDemand: string;
    deviationType: string;
    operationalOutcome: string;
    summary: string;
  };
  concentrationComparison?: string;
  volumeComparison?: string;
  containerState?: string;
  informationSufficiency?: string;
  absentInformation?: string[];
  controlLayer?: string[];
  controlFunction?: string[];
  humanPerformanceDependency?: "low" | "moderate" | "high" | "undetermined";
  failureCondition?: string;
  gapStatus?: "identified" | "not_identified" | "uncertain";
  gapType?: string;
  recoveryControlStatus?: string;
  indicatorName?: string;
  indicatorType?: string;
  observationMethod?: string[];
  expectedDirection?: string;
  protectiveAdaptationAmbiguity?: "yes" | "no" | "uncertain";
}
export type StoredObservation = Observation | LegacyObservation;
export interface StructuredTaxonomyItemRating {
  fieldId: FieldId;
  taxonomyGroup: string;
  taxonomyItemValue: string;
  relevance: OrdinalRating5;
  clarity: OrdinalRating5;
  distinctiveness: OrdinalRating5;
  expectedFrequencyOfUse?: OrdinalRating5;
  missingContext?: boolean;
  suggestedReplacement?: string;
  comment?: string;
}
export interface LegacyTaxonomyItemRating {
  fieldId: FieldId;
  categoryId: string;
  rating: 1 | 2 | 3 | 4;
  otherCategoryText?: string;
}
export type TaxonomyItemRating =
  StructuredTaxonomyItemRating | LegacyTaxonomyItemRating;
export interface TaxonomyMissingItem {
  fieldId: FieldId;
  taxonomyGroup: string;
  proposedValue: string;
  rationale?: string;
}
export interface TaxonomyRedundancy {
  fieldId: FieldId;
  taxonomyGroup: string;
  firstItemValue: string;
  secondItemValue: string;
  rationale: string;
}
export interface TaxonomyReview {
  taxonomyItemRatings: TaxonomyItemRating[];
  missingItems: TaxonomyMissingItem[];
  redundantItems: TaxonomyRedundancy[];
}
export interface FieldSummaryRating {
  fieldId: FieldId;
  dominantCategories: Selection<string>[];
  overallAnalyticalRelevance: OrdinalRating5;
  informationSufficiency: OrdinalRating5;
  internalConsistencyOfEvidence: OrdinalRating5;
  consensusPriority: OrdinalRating5;
  reasoningSummary: string;
  extendedComments?: string;
}

export interface EvaluationSession {
  sessionId: string;
  evaluatorPseudonym: string;
  studyId: string;
  roundId: string;
  scenarioId: string;
  scenarioVersion: string;
  scenarioClass?: ScenarioClass;
  referenceSet?: boolean;
  studyAlignment?: string | null;
  instrumentVersion: string;
  frameworkVersion: string;
  fieldDefinitionVersions: Record<FieldId, string>;
  evaluationStatus:
    | "not_started"
    | "in_progress"
    | "submitted"
    | "returned_for_revision"
    | "resubmitted"
    | "locked"
    | "included_in_analysis"
    | "excluded_from_analysis"
    | "in_review"
    | "completed"
    | "abandoned";
  metadata: {
    appVersion: string;
    userAgent: string;
    viewportClass: "desktop" | "tablet";
    locale: string;
  };
  fieldResponses: FieldResponse[];
  nasaTlx: Record<
    | "mental"
    | "physical"
    | "temporal"
    | "performance"
    | "effort"
    | "frustration",
    number
  > | null;
  sus: { itemScores: number[] } | null;
  openFeedback: { burden: string; ambiguity: string; usefulness: string };
  fictionalScenarioConfirmed: boolean;
  startedAt: string;
  reviewedAt: string | null;
  finishedAt: string | null;
  abandonedAt: string | null;
  resumedAt: string[] | null;
  dataSchemaVersion?: "1.0" | "1.1" | "1.2";
  structuredItemSetVersion?: "0.1-exploratory";
  taxonomyItemRatings?: Partial<Record<FieldId, TaxonomyItemRating[]>>;
  taxonomyReview?: TaxonomyReview;
  submittedAt?: string | null;
  lockedAt?: string | null;
  exclusionReason?: string | null;
  assignedEvaluatorId?: string;
  evaluatorId?: string;
  institutionId?: string;
  coreVersion?: string;
  schemaVersion?: string;
  taxonomyVersion?: string;
  scientificStatus?: ScientificSessionStatus;
  completedAt?: string | null;
  excludedAt?: string | null;
  documentSnapshots?: DocumentSnapshot[];
}

export interface Institution {
  institutionId: string;
  studyId: string;
  institutionCode: string;
  displayName: string | null;
  active: boolean;
  createdAt: string;
}

export type DocumentScope = "instrument" | "study" | "scenario" | "field";
export type DocumentAccessMode =
  "external" | "packaged-local" | "metadata-only";
export interface SupportingDocument {
  documentId: string;
  title: string;
  documentType: string;
  version: string;
  uri: string;
  checksum: string;
  accessMode: DocumentAccessMode;
  scope: DocumentScope;
  studyId?: string;
  scenarioId?: string;
  fieldId?: FieldId;
  createdAt: string;
  active: boolean;
  supersedesDocumentId?: string;
}
export interface DocumentLink {
  documentLinkId: string;
  documentId: string;
  documentVersion: string;
  scope: DocumentScope;
  studyId?: string;
  scenarioId?: string;
  fieldId?: FieldId;
  createdAt: string;
}
export interface DocumentSnapshot {
  documentId: string;
  documentVersion: string;
  documentHash: string;
}

export type IssueType =
  | "scenario-clarification"
  | "taxonomy-question"
  | "field-ambiguity"
  | "supporting-document"
  | "methodological-note"
  | "data-quality"
  | "technical-problem"
  | "change-request"
  | "other";
export type IssueStatus =
  "open" | "under_review" | "resolved" | "rejected" | "deferred" | "closed";
export interface IssueSourceReference {
  sessionId: string;
  fieldResponseId?: string;
  snapshotHash: string;
}
export interface ReviewIssue {
  issueId: string;
  studyId: string;
  scenarioId?: string;
  fieldId?: FieldId;
  documentId?: string;
  issueType: IssueType;
  status: IssueStatus;
  priority: "low" | "normal" | "high";
  description: string;
  createdBy: string;
  createdAt: string;
  resolvedAt: string | null;
  resolution: string | null;
  sourceReference?: IssueSourceReference;
}
export interface IssueHistoryEntry {
  historyId: string;
  issueId: string;
  fromStatus: IssueStatus | null;
  toStatus: IssueStatus;
  changedBy: string;
  changedAt: string;
  note: string;
}

export interface SchemaMigrationRecord {
  migrationId: string;
  sourceSchemaVersion: string;
  targetSchemaVersion: string;
  simulatedAt: string;
  appliedAt: string | null;
  status: "simulated" | "applied" | "failed";
  warnings: string[];
}

export type FunctionalRole =
  | "system_administrator"
  | "study_coordinator"
  | "evaluator"
  | "consensus_reviewer"
  | "read_only_analyst";

export interface UserProfile {
  profileId: string;
  pseudonym: string;
  role: FunctionalRole;
  active: boolean;
  createdAt: string;
}

export interface EvaluatorAssignment {
  assignmentId: string;
  studyId: string;
  roundId: string;
  scenarioId: string;
  evaluatorProfileId: string;
  createdAt: string;
  status: "assigned" | "completed" | "withdrawn";
}

export interface ConsensusRecord {
  consensusId: string;
  studyId: string;
  roundId: string;
  scenarioId: string;
  fieldId: FieldId;
  sourceSessionIds: string[];
  reviewerProfileId: string;
  decision: "retain" | "revise" | "unresolved";
  rationale: string;
  createdAt: string;
  lockedAt: string | null;
}

export type AuditAction =
  | "creation"
  | "editing"
  | "submission"
  | "reopening"
  | "locking"
  | "exclusion"
  | "import"
  | "export"
  | "taxonomy_change"
  | "consensus_decision"
  | "role_change"
  | "archive"
  | "duplication";

export interface AuditEvent {
  auditEventId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  actorProfileId: string | null;
  occurredAt: string;
  details: Record<string, string | number | boolean | null>;
}

export interface FrameworkChangeLogEntry {
  entryId: string;
  fieldId: FieldId;
  previousDefinitionVersion: string;
  newDefinitionVersion: string;
  previousText: string;
  newText: string;
  changeType:
    | "wording"
    | "response-type"
    | "scale"
    | "merge"
    | "split"
    | "removal"
    | "addition"
    | "taxonomy_revision";
  rationale: string;
  approvedInRound: string;
  approvedBy: string;
  createdAt: string;
  breakingChange: boolean;
}

export interface WorkedExample {
  scenarioId: string;
  scenarioVersion: string;
  workedExampleVersion: string;
  status: "draft" | "editorially-approved";
  fieldCommentaries: Record<
    FieldId,
    {
      modelResponse: string;
      evaluatorNote: string;
      proposedChange: string;
    }
  >;
  keyInteractionFinding: string;
  evaluatorFeedbackSummary: {
    perceivedBurden: string;
    mainAmbiguity: string;
    perceivedUsefulness: string;
  };
}
