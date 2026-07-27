# Phase B Design — Functional Skeleton (pre-implementation)

> **Superseded architecture notice — 23 July 2026.** Narrative-first and
> dual-instrument passages below are design history and must not be
> implemented. The current hierarchy is Study → Scenario → Evaluation Round →
> Evaluation → Field → Observation.

**Status:** Design specification only. No code, no `npm init`, no repository scaffolding yet.

**Revision:** v2. Six corrections incorporated after review — see §0. Scope is still v0.1 as fixed in `implementation-plan.md`, but §0.6 changes what v0.1 contains: Fleiss' κ moves in from v0.2.

---

## 0. Revision log (what changed from v1 and why)

1. **`Study` and `Round` are now explicit entities**, not a string field on the evaluation session. `Project` is renamed `Study` throughout — this matches the terminology the psychometric-validation literature actually uses, and makes clear that a Study can contain multiple Rounds, each with its own framework-version pointer and lock state.
2. **`evaluationStatus` and session metadata are now explicit**, not inferred from the presence/absence of timestamps. Inferring status from `finishedAt !== null` works until an abandoned-and-never-resumed session needs to be distinguished from a completed one, which is exactly the kind of ambiguity Phase 0 analysis cannot afford.
3. **A review screen is now required before final submission.** The evaluator can return to any of the six fields and edit before the session locks. Without this, a single mis-click ends a ~30–45 minute session irrecoverably, which is both a UX failure and a data-quality risk (a rushed, unreviewed submission is exactly the kind of "insufficient information" case Phase 0 is trying to distinguish from genuine field-design problems).
4. **An audit/migration layer is now first-class**, not a description field the administrator fills in optionally. The original design let `frameworkVersion` change on a Round without any structural check on what that means for previously collected data. This revision adds a `FrameworkChangeLogEntry` with a `breakingChange` flag, and the merge view must refuse to silently pool sessions across a breaking-change boundary.
5. **RTLX/SUS are now configurable per Study**, defaulting to on. Some Phase 0 rounds are pure content-validation passes (relevance/clarity/redundancy only) where burden measurement isn't the question being asked yet; forcing every round through the full closing survey conflates two different research questions.
6. **Fleiss' κ moves into v0.1.** This is a correction to a real inconsistency in the v1 plan, not scope creep: `implementation-plan.md` already states Phase 0 panels are "realistically 3–6 people," but v1 only implemented Cohen's κ, which is defined for exactly two raters. A v0.1 that can only compute agreement for a 2-evaluator panel does not serve the panel size the plan itself calls realistic. Weighted κ and ICC remain deferred to v0.2 — those are needed for ordinal/continuous fields, which are not the default response type for the six fields at v0.1.0-draft (narrative-first, see §2.1).

---

## 1. Project scaffolding decisions

Unchanged from v1:

- **Vite + React + TypeScript**, `strict: true`.
- **Hash-based routing** (GitHub Pages has no server-side rewrite).
- **React Context + `useReducer` per mode** — still no cross-mode shared live state, so still no need for a global store.
- **Plain CSS with custom properties**, one stylesheet per component.
- **No risk-calculator visual language** (no gauges, no traffic-light severity, no prominent numeric score) — this now also applies to the new round-agreement summary view (§3, §5): a κ value is displayed as a number with its standard interpretive band label (Landis & Koch, 1977, already cited in the manuscript), never as a colored gauge.

---

## 2. Data model

### 2.1 The six framework fields (versioned)

```
FrameworkFieldDefinition {
  fieldId: "F1" | "F2" | "F3" | "F4" | "F5" | "F6"
  name: string
  promptText: string
  responseType: "narrative" | "categorical" | "ordinal"
  categoricalOptions?: string[]
  ordinalScale?: { min: number, max: number, labels: string[] }
  frameworkVersion: string
  fieldDefinitionVersion: string
}
```

**The six records at `frameworkVersion "0.1.0-draft"`**, `promptText` drawn from the
manuscript §2.3 wording (not newly invented — this is the field-by-field content
that was missing from earlier drafts of this document, which said "unchanged
from v1" without a v1 to point to). All six are `responseType: "narrative"` at
this version — the manuscript describes the framework as narrative-first, and
no `categoricalOptions` are defined yet. **Choosing categorical options for any
of these fields is explicitly a Phase 0 outcome, not a pre-implementation
decision** (implementation-plan.md §3.4) — leaving `categoricalOptions`
undefined for all six is a deliberate absence, not an oversight to fill in
during Fase B.

| fieldId | name | promptText | Category (manuscript) |
|---|---|---|---|
| F1 | Critical task | "Describe the operation as it is actually performed, not the procedure category it belongs to." | Input |
| F2 | Physical and cognitive performance demands | "Describe the specific postural, repetitive, force-related, or attentional demand (e.g., static forearm loading, cubital deviation, doubled-glove tactile attenuation, sustained vigilance)." | Input — performance demand |
| F3 | Biological hazard / release consequence | "Describe the material that could be released or transferred following a performance deviation (not limited to loss of motor control, but including omissions, sequencing errors, or misidentification), the release mechanism, and the plausible exposure route (aerosol, surface contamination, percutaneous exposure)." | Input — hazard/consequence |
| F4 | Critical vector / material | "Describe the specific agent and, where relevant, its titer — consequence severity depends on agent characteristics, vector design, transgene, concentration, volume, and plausible exposure route, not just agent identity." | Input — material/agent |
| F5 | Integrated control strategy | "Describe the layered response across elimination/substitution, engineering, procedural, organizational, and PPE controls, together with recovery and emergency measures, rather than only PPE-based." | Modifier |
| F6 | Candidate performance-degradation indicators | "Describe observable precursors (e.g. movement variability, volumetric error rate, sequence deviation, unplanned pauses, self-reported fatigue) that precede, rather than record, an incident. Not every deviation from baseline is degradation — an unplanned pause may instead reflect protective adaptation. Treat these as candidate signals to be validated, not confirmed indicators of decline." | Indicator |

### 2.2 Study (was: Project)

```
Study {
  studyId: string
  title: string
  description: string
  createdAt: string
  status: "draft" | "active" | "closed"
  config: StudyConfig
}

StudyConfig {
  includeRtlx: boolean               // default true — §0.5
  includeSus: boolean                 // default true — §0.5
  confidenceScalePoints: number       // default 4
  relevanceClarityScalePoints: number // default 4
}
```

### 2.3 Round (new explicit entity)

```
Round {
  roundId: string
  studyId: string
  roundNumber: number
  label: string                        // e.g. "Round 1 — initial six-field draft"
  frameworkVersion: string              // which framework version this round tests
  status: "open" | "locked"
  evaluatorGroup: string
  openedAt: string
  lockedAt: string | null
}

RoundScenario {
  roundId: string
  scenarioId: string
  scenarioVersion: string               // pins which version of the scenario this round uses
}
```

**Lock/unlock transition rule (proposed engineering default, not a research
decision — flagged here because it was previously ambiguous, resolvable
without new methodology):** locking a Round is reversible only while it has
zero `EvaluationSession` records with `evaluationStatus: "completed"`. Once at
least one session under that round is completed, `RoundForm.tsx` disables
unlock entirely — there is no code path to reverse it. Rationale: allowing
unlock after real data exists would let a round's `frameworkVersion` or
scenario assignments change underneath already-collected sessions, silently
invalidating the version-snapshot guarantees in §2.5. If the research team
needs a different transition model (e.g., unlock always allowed with a
forced re-versioning of affected sessions), that is a sign-off-worthy change
to this default, not an assumption to carry into Fase B silently.

**Agreement-eligibility rule for `RoundAgreementSummary.tsx` (§5), same
status as above:** the summary view computes and displays statistics only
when a Round is `locked` **and** has at least two `completed` sessions
(minimum for Cohen's κ) or at least three (minimum for Fleiss' κ, shown
separately). Below those thresholds, the view states the shortfall in plain
language ("2 completed sessions; Fleiss' κ requires at least 3") rather than
computing a statistic on an underpowered sample or hiding the screen
silently. Sessions with `evaluationStatus` other than `"completed"` (in
particular `"abandoned"`) are excluded from the input set entirely, not
counted as a rating.

A scenario's content can be revised between rounds (see §2.6, audit layer) while `RoundScenario` keeps each round's data tied to the exact scenario text evaluators actually saw.

### 2.4 Scenario

Unchanged fields from v1, with `scenarioVersion` now understood as append-only (a new version is a new record, never an in-place edit):

```
Scenario {
  scenarioId: string
  scenarioVersion: string
  title: string
  taskDescription: string
  operatingConditions: string
  availableInformation: string
  vectorMaterialDescription: string
  volumeOrConcentration?: string
  existingControls: string
  contextualConstraints: string
  intendedEvaluatorGroup: string
  frameworkVersion: string
  adminNotes: string
  isDemo: boolean

  // Classification fields (v1.1+, optional with defaults)
  // See DPF_VARIABLE_DICTIONARY.md Appendix B for full specification
  scenarioClass?: "reference" | "research-extension" | "user"  // default: "user"
  referenceSet?: boolean                               // default: true
  studyAlignment?: string                             // default: null; informational only
}
```

**Scenario classification (v1.1 addition):** `scenarioClass` and `referenceSet`
are optional fields that classify scenarios into three tiers: `"reference"`
(E1–E5, aligned across S1, S2, and DPF-RP), `"research-extension"` (ORG-01,
INC-01, and any future exploratory scenarios), and `"user"` (any
administrator-created scenario not belonging to either canonical set). The
default when `scenarioClass` is absent is `"user"` — never `"reference"`. The
platform must display a visible label on the scenario-selection screen.
Import of configs without these fields must succeed silently, applying
defaults. A scenario with `referenceSet: true` and `scenarioClass:
"research-extension"` or `"user"` is a validation error on import.
Full field specifications in `DPF_VARIABLE_DICTIONARY.md` Appendix B.

### 2.4b WorkedExample entity

A `WorkedExample` stores the model six-field analysis for a given
scenario. It is a **separate entity from `Scenario`** and from
`EvaluationSession`. It must never be shown to an evaluator during an
active evaluation session. Its contents must never be included in any
export file that could be accessed before the evaluator completes and
exports their own responses.

```
WorkedExample {
  scenarioId: string              // links to the parent Scenario
  scenarioVersion: string         // version of the scenario this example was written for
  workedExampleVersion: string    // e.g. "1.0"
  status: "draft" | "editorially-approved"
  fieldCommentaries: {
    F1: WorkedFieldCommentary
    F2: WorkedFieldCommentary
    F3: WorkedFieldCommentary
    F4: WorkedFieldCommentary
    F5: WorkedFieldCommentary
    F6: WorkedFieldCommentary
  }
  keyInteractionFinding: string
  evaluatorFeedbackSummary: {
    perceivedBurden: string
    mainAmbiguity: string
    perceivedUsefulness: string
  }
}

WorkedFieldCommentary {
  modelResponse: string           // the model evaluator's substantive answer
  evaluatorNote: string           // meta-commentary on the field prompt
  proposedChange: string          // proposed revision to the field
}
```

**Display rules (mandatory):**

1. `WorkedExample` content must never appear on any screen accessible
   during an active `EvaluationSession` (i.e., while `evaluationStatus`
   is `not_started`, `in_progress`, or `in_review`).
2. It may be displayed only in:
   - a dedicated **Worked example** view, accessible outside of any
     active round session;
   - an administrator-only view;
   - a post-submission comparison view, unlocked only after
     `evaluationStatus === "completed"` and the session has been
     exported.
3. `WorkedExample` must never be included in any `EvaluationSession`
   export JSON or merged dataset CSV.
4. `WorkedExample` data must be stored under a separate `localStorage`
   key prefix (e.g., `dpft:workedexample:`) and must not be readable
   by the evaluator flow components.

**Storage:**
`WorkedExample` records are shipped with the platform as built-in
fixtures (not user-created). They are not part of `study-config.json`
exports and cannot be imported or overwritten via the standard import
flow. The canonical worked examples for E2, E3, E4 (from Supplementary
Material S2) and ORG-01, INC-01 (from research-extension documentation)
are the initial fixture set.



### 2.5 Evaluation session (revised)

```
EvaluationSession {
  sessionId: string
  evaluatorPseudonym: string
  studyId: string
  roundId: string
  scenarioId: string
  scenarioVersion: string               // copied at session start, not a live pointer — §2.6
  frameworkVersion: string               // copied at session start; the overall framework
                                          // release label (e.g. "0.1.0-draft") — distinct
                                          // from the per-field versions below
  fieldDefinitionVersions: {             // §2.6 correction: was a single scalar; changed to
    F1: string, F2: string, F3: string,  // per-field because FrameworkChangeLogEntry already
    F4: string, F5: string, F6: string   // versions changes per fieldId, not per framework
  }                                       // release. A single scalar could not represent
                                          // "F3 revised to v2, F5 still at v1" — copied at
                                          // session start, one value per field, not a live
                                          // pointer.

  evaluationStatus: "not_started" | "in_progress" | "in_review" | "completed" | "abandoned"  // §0.2

  metadata: SessionMetadata

  fieldResponses: FieldResponse[6]

  nasaTlx: { mental: number, physical: number, temporal: number, performance: number, effort: number, frustration: number } | null
    // null if StudyConfig.includeRtlx is false for this study — §0.5
  sus: { itemScores: number[10] } | null
    // null if StudyConfig.includeSus is false — §0.5

  openFeedback: { burden: string, ambiguity: string, usefulness: string }
  fictionalScenarioConfirmed: boolean

  startedAt: string
  reviewedAt: string | null             // §0.3 — timestamp of entering the review screen
  finishedAt: string | null
  abandonedAt: string | null
  resumedAt: string[] | null
}

SessionMetadata {
  appVersion: string
  userAgent: string         // browser string, non-identifying — usability-analysis context only
  viewportClass: "desktop" | "tablet"    // coarse bucket, not raw pixel dimensions
  locale: string
}
```

```
FieldResponse {
  fieldId: "F1" | "F2" | "F3" | "F4" | "F5" | "F6"

  // Substantive content — qualitative only. Never used to compute Cohen's/
  // Fleiss' κ or I-CVI/S-CVI; these are read narratively by the research
  // team, not statistically aggregated by the tool.
  narrativeAnswer: string
  categoricalAnswer?: string           // populated only if this field's
                                         // FrameworkFieldDefinition.responseType
                                         // is "categorical" or "ordinal"
  openComment: string
  changeProposal: string

  // Rating variables — these ARE the categorical/ordinal inputs to Cohen's/
  // Fleiss' κ (v0.1) and to I-CVI/S-CVI (v0.2, per implementation-plan.md
  // §3.4: the "relevant" threshold over `relevance` is analyst-configurable,
  // e.g. top-2-of-4, never hardcoded). All are ordinal, 1..N, no free text.
  confidenceRating: number             // 1..StudyConfig.confidenceScalePoints
  relevance: number                    // 1..StudyConfig.relevanceClarityScalePoints
                                         // — primary I-CVI/S-CVI input
  clarity: number                      // 1..StudyConfig.relevanceClarityScalePoints
  exhaustiveness: number               // 1..4 — fixed scale; if the research
                                         // team wants this independently
                                         // configurable, that is a StudyConfig
                                         // extension to confirm, not assumed here
  redundancy: number                   // 1..4
  applicability: number                // 1..4
  interpretationDifficulty: number     // 1..4

  // Missing-data flag, not a rating value. When true, this field-response is
  // EXCLUDED from κ/I-CVI computation for this field/evaluator/scenario
  // combination — never coded as a category. The statistics module must
  // filter on this flag before computing any agreement statistic; silently
  // treating "insufficient information" as a substantive rating would bias
  // agreement for reasons unrelated to genuine field-design disagreement.
  insufficientInformation: boolean

  // Auto-recorded, not evaluator-entered
  timeSpentSeconds: number
  revisionCount: number
  helpAccessedCount: number
}
```

**Unit of analysis for agreement statistics:** one Cohen's/Fleiss' κ value per rating variable (`confidenceRating`, `relevance`, `clarity`, `exhaustiveness`, `redundancy`, `applicability`, `interpretationDifficulty`) per field per round — seven statistics per field, forty-two per six-field round, not one omnibus agreement number. `RoundAgreementSummary.tsx` (§5) presents this as a table, not a single figure.

### 2.6 Audit and migration layer (new)

```
FrameworkChangeLogEntry {
  entryId: string
  fieldId: string
  previousDefinitionVersion: string
  newDefinitionVersion: string
  previousText: string
  newText: string
  changeType: "wording" | "response-type" | "scale" | "merge" | "split" | "removal" | "addition"
  rationale: string
  approvedInRound: string         // roundId
  approvedBy: string               // pseudonymous/coded responsible party, never a real name
  createdAt: string
  breakingChange: boolean
}
```

**What `breakingChange` controls, concretely, per field (corrected — was described per-session, but versions are now per-field per §2.5):** the merge view (`src/modes/admin/merge/ConflictResolver.tsx`) reads the changelog for the studies being merged. For each of the six fields independently, if any `FrameworkChangeLogEntry` for that `fieldId` with `breakingChange: true` falls between two sessions' recorded `fieldDefinitionVersions[fieldId]` values, **that field's responses** across those two sessions are flagged as not directly comparable — not the whole session. A session pair can therefore be partially comparable: e.g. F1–F4 poolable, F5 not, because only F5 had a breaking wording change between rounds. The merge view surfaces this at field granularity (a per-field comparability matrix in the merge conflict report), not as a single session-level accept/reject. The administrator can still export everything; the tool does not silently combine incomparable field data into a single agreement calculation for that field.

**What counts as breaking is a judgment call, not something this design can decide.** A wording clarification is usually non-breaking; a response-type change (narrative → categorical) or a scale change almost always is. This distinction is flagged as an open question in §7, not resolved here, per the project's own instruction not to invent scientific rules inside the implementation.

### 2.7 localStorage schema (revised)

```
dpft:study:<studyId>
dpft:round:<roundId>
dpft:roundScenario:<roundId>:<scenarioId>
dpft:scenario:<scenarioId>:<scenarioVersion>
dpft:evaluation:<sessionId>
dpft:changelog:<entryId>
dpft:currentEvaluatorPseudonym
```

---

## 3. Navigation map (revised)

```
/#/                          Landing — mode selection, permanent prototype banner

/#/admin                     Administrator dashboard — study list
/#/admin/study/new
/#/admin/study/:studyId               Study detail — rounds, config, scenarios
/#/admin/study/:studyId/round/new
/#/admin/study/:studyId/round/:roundId          Round detail — lock/unlock, assigned scenarios
/#/admin/study/:studyId/round/:roundId/summary  Round agreement summary (new — §5): Cohen's κ
                                        pairwise matrix + Fleiss' κ overall, once locked
/#/admin/study/:studyId/scenario/new
/#/admin/study/:studyId/scenario/:scenarioId/edit   // creates a new scenarioVersion, never
                                                       // overwrites the version in use by a round
/#/admin/study/:studyId/changelog/new    Record a FrameworkChangeLogEntry
/#/admin/merge

/#/evaluator
/#/evaluator/import
/#/evaluator/session/:scenarioId                 six fields, one at a time (unchanged from v1)
/#/evaluator/session/:scenarioId/review           NEW — §0.3: full read-back of all six field
                                                    responses, each with an Edit link back to
                                                    its field screen
/#/evaluator/session/:scenarioId/closing          RTLX (if StudyConfig.includeRtlx) → SUS (if
                                                    StudyConfig.includeSus) → open feedback →
                                                    fictional-scenario confirmation → export
```

The review screen sits between the six field screens and the closing survey, not after it — the evaluator reviews their substantive answers before the burden-measurement questions, so reviewing content isn't itself contaminated by however tired they are after the survey.

---

## 4. Demo scenarios

The canonical scenario sets are defined externally as JSON files, not
embedded in this document. Do not reconstruct scenario text from any
example found in this design document — use the JSON files as the sole
authoritative source.

**Reference scenarios (E1–E5):**
Defined in `data/study-config-aligned.json`.
These five scenarios are shared across Supplementary Materials S1 and
S2 of the accompanying manuscript and DPF-RP v1.1. They constitute the
primary Phase 0 content-validation set. Identifiers: `demo-E1` through
`demo-E5`.

**Research-extension scenarios (ORG-01, INC-01):**
Defined in `data/study-config-exploratory.json`.
These two scenarios are exploratory extensions that test the six-field
instrument in organisational-disruption and post-incident-recovery
domains. They are not part of the E1–E5 reference set and must be
stored in a separate study (`study-exploratory-001`) with a separate
round. Identifiers: `ORG-01`, `INC-01`.

**User-created scenarios:**
Any scenario created by an administrator via the platform UI that is
not one of the above. These carry `scenarioClass: "user"` (or the
absence of `scenarioClass`, which defaults to `"user"`). They are never
treated as part of the reference set.

Any earlier versions of this section that listed four inline scenario
blocks (`demo-1` through `demo-4`) are superseded by the above. Those
identifiers and their content must not be used in any implementation.


## 5. Component inventory (revised)

```
src/modes/administrator/
  StudyList.tsx                    // renamed from ProjectList.tsx
  StudyForm.tsx                    // renamed from ProjectForm.tsx, includes StudyConfig toggles
  RoundList.tsx                    // new
  RoundForm.tsx                    // new — create/lock a round
  RoundAgreementSummary.tsx        // new — §0.6: Cohen's κ pairwise + Fleiss' κ overall for a
                                    //   locked round. NOT the deferred Analyst panel — no
                                    //   filtering, no SUS/NASA-TLX aggregation, no export
                                    //   beyond a CSV of the κ table itself.
  ScenarioList.tsx
  ScenarioForm.tsx                  // writes a new scenarioVersion, never edits in place
  ChangeLogEntryForm.tsx            // new — §0.4
  StudyExportImport.tsx             // renamed from ProjectExportImport.tsx

src/modes/evaluator/
  PseudonymEntry.tsx
  StudyImport.tsx                   // renamed from ProjectImport.tsx
  FieldQuestion.tsx
  SessionProgress.tsx
  SessionReview.tsx                 // new — §0.3
  ClosingSurvey.tsx                 // now reads StudyConfig to conditionally render RTLX/SUS
  FictionalConfirmation.tsx
  SessionExport.tsx

src/modes/admin/merge/
  MergeImport.tsx
  ConflictResolver.tsx              // now also checks FrameworkChangeLogEntry.breakingChange
                                     //   before allowing a pooled merge — §2.6
  MergedDatasetExport.tsx

src/statistics/
  cohensKappa.ts                    // pairwise, unchanged
  fleissKappa.ts                    // new — moved in from v0.2, §0.6

src/shared/
  PrototypeBanner.tsx
  KeyboardNavGuard.tsx
```

---

## 6. What Fase B will still NOT include

Confirmed exclusions, revised from v1:

- No full Analyst panel (filtering by field/evaluator-type, SUS/NASA-TLX aggregate dashboards, qualitative-comment export) — `RoundAgreementSummary.tsx` is a narrow, round-scoped view, not this.
- No weighted κ, no ICC, no I-CVI/S-CVI — these apply to ordinal/categorical and continuous fields, which are not the v0.1.0-draft default (narrative-first, per §2.1).
- No i18n string extraction yet.
- No `docs/methodology.md` / `data-dictionary.md` / `privacy.md` content yet — Fase D deliverables; this document only fixes the schema they will describe.

**Fleiss' κ is no longer in this exclusion list** — see §0.6.

---

## 7. Sign-off resolution log (items 5–10, formerly "Points requiring sign-off")

**Status: confirmed by the research team.** These six items were enforced
as mandatory stop conditions in `PROMPT_MASTER.md` § MANDATORY SIGN-OFF
ITEMS (items 5–10 there) while open. They are resolved as of this version;
`PROMPT_MASTER.md` has been updated accordingly. If any of these is
reopened or revised later, restore it to `PROMPT_MASTER.md`'s mandatory
list in the same change.

5. **Demo scenarios (§4): confirmed adequate as drafted.**
6. **Evaluator flow: confirmed one-field-at-a-time**, not a single scrollable form.
7. **RTLX/SUS wording: confirmed standard published wording verbatim** — no lab-adapted phrasing. Any lab-specific clarification is delivered as separate help-text, never by editing the instrument item text itself.
8. **`breakingChange` default (§2.6): confirmed.** Response-type and scale changes are breaking; wording-only changes are non-breaking.
9. **`StudyConfig` defaults: confirmed `includeRtlx: true`, `includeSus: true`.**
10. **SUS granularity (§9): confirmed — stays per-scenario.** `sus` remains on each `EvaluationSession`, measuring the burden of applying the six-field instrument to that specific task — the question Phase 0 is actually asking. `ClosingSurvey.tsx` must display a visible note that this is a non-standard, per-scenario use of SUS and results should be interpreted accordingly; a separate session-level global-usability SUS may be added later as an additional measure, not a replacement.

With items 1–10 now confirmed across both governing documents, Fase B implementation may begin per `PROMPT_MASTER.md`.

---

## 8. Engineering and schema definitions (added per Design Review findings 8–24)

All decisions below are engineering-level and do not require research-team
sign-off — they define *how* the already-specified data model is stored and
moved, not *what* is being measured. One exception is flagged explicitly in
§8.16.

### 8.1 JSON Schema generation and location

Define validation schemas with `zod`, colocated with each TypeScript
interface (e.g. `src/framework/fields.schema.ts` next to `fields.ts`).
Generate JSON Schema files via `zod-to-json-schema` as a build step into
`specifications/schema/*.schema.json` (generated output, not hand-authored —
the TypeScript interfaces in §2 remain the single source of truth, per
`PROMPT_MASTER.md` § STORAGE: "the schema follows the design document, not
the other way around").

### 8.2 Export envelope

```
ExportEnvelope {
  schemaVersion: string        // envelope format version — independent of
                                 // frameworkVersion, versions the envelope
                                 // shape itself
  exportType: "study-config" | "evaluation-session" | "merged-dataset"
  appVersion: string
  generatedAt: string           // ISO 8601 UTC — see §8.5
  entities: { ... }             // payload; shape depends on exportType
}
```

No checksums in v0.1 — a human-mediated, out-of-band file exchange (email,
shared drive) doesn't have a corresponding tamper threat model that
checksums would address; revisit only if the team introduces a channel where
integrity is genuinely uncertain. On import, if `schemaVersion` is newer than
the importing app supports, refuse with an error naming both versions
explicitly; if older, attempt import only for envelope-shape differences
that are additive (new optional fields), never for removed/retyped fields.

### 8.3 Import validation and error taxonomy

Validate against the JSON Schema (§8.1) on import. Distinguish, in the
user-visible error, three failure classes rather than one generic message:
(a) not valid JSON at all, (b) valid JSON but wrong shape — show the
field path and expected vs. actual type, not a raw exception, (c) valid
shape but unrecognized `schemaVersion` — see §8.2.

### 8.4 Merged-dataset schema and CSV columns

The merged dataset is one JSON object: `{ studies, rounds, scenarios,
sessions, changelog, comparabilityMatrix }`, where `comparabilityMatrix` is
the per-field, per-round-pair comparability result from the corrected §2.6
merge rule. The primary CSV export is one row per `FieldResponse`, columns:
`sessionId, roundId, scenarioId, evaluatorPseudonym, fieldId,
narrativeAnswer, categoricalAnswer, confidenceRating, relevance, clarity,
exhaustiveness, redundancy, applicability, interpretationDifficulty,
insufficientInformation, timeSpentSeconds, revisionCount,
helpAccessedCount`. This becomes the canonical source for
`docs/data-dictionary.md` (Fase D) — that document should describe these
columns, not define new ones.

### 8.5 Identifier generation

`crypto.randomUUID()` for every entity ID (native, no dependency). Every ID
is opaque; human-readable labels (`title`, `roundNumber`) are separate
fields, never derived from or parsed out of an ID.

### 8.6 Version-string format and ordering

Version strings follow a loose semantic-versioning shape (`"0.1.0-draft"`,
`"1.0"`, `"2"`). Ordering compares dot-separated segments numerically; a
non-numeric suffix (e.g. `-draft`) sorts before the same numeric prefix
without one. Exact ordering matters only for the `breakingChange`
comparability check (§2.6) — implement as one small, directly unit-tested
comparator function, not ad hoc string comparison at each call site.

### 8.7 Date/time representation

All timestamps are ISO 8601 UTC (`new Date().toISOString()`), everywhere a
field is typed `string` and described as a timestamp in §2. Stated once
here rather than repeated at each field.

### 8.8 Duplicate handling in merge

Two imported files containing the same `sessionId` — last-imported wins,
with a visible warning naming the duplicate, never a silent overwrite.
Two different `sessionId`s sharing the same `(evaluatorPseudonym, roundId,
scenarioId)` are **not** auto-merged or auto-picked-latest — automatically
choosing one would be a silent methodological decision (which attempt
counts). They are surfaced to the administrator as a "possible duplicate
attempt" list for a human decision.

### 8.9 Cardinality and uniqueness

- `EvaluationSession` per `(evaluatorPseudonym, roundId, scenarioId)`:
  multiple attempts are allowed by the schema (not deduplicated — see §8.8);
  the tool does not assume "one session per assignment."
- `RoundScenario`: one row per `(roundId, scenarioId)`, enforced — a round
  cannot reference the same scenario twice.
- `roundNumber`: unique within a `studyId`, enforced.

### 8.10 Referential integrity on delete/close

Closing a Study (`status: "closed"`) is a workflow/visibility state, not a
destructive action — no data is removed. There is no per-entity delete for
Study, Round, or Scenario once created in v0.1, only status changes. The
only destructive action in v0.1 is "Delete all local data" (§8.12). This
avoids dangling-reference bugs by construction rather than by cleanup logic.

### 8.11 `localStorage` indexing and quota handling

Maintain one index key per entity type (e.g. `dpft:index:studies` → array of
`studyId`s, `dpft:index:rounds:<studyId>` → array of `roundId`s), written
**after** the entity record on every create, so a crash between the two
writes leaves an orphaned-but-recoverable entity (repairable by a full-key
scan) rather than an index pointing at nothing. All writes are wrapped in
try/catch; on `QuotaExceededError`, the action is blocked and the user is
shown how to free space (export and clear completed sessions) — never a
silent data drop.

### 8.12 "Delete all local data" scope

Deletes every key with the `dpft:` prefix and nothing else in the origin's
storage. Confirmation requires typing the word `DELETE` into a text field,
not a plain OK/Cancel dialog, given the action is destructive and
irreversible.

### 8.13 `evaluationStatus` transitions and autosave

```
not_started → in_progress      on first field answered
in_progress → in_review          on reaching SessionReview.tsx
in_review  → in_progress          on "Edit" from the review screen
in_review  → completed            on final submit from the closing survey
in_progress/in_review → abandoned  set on next app load if the session was
                                     left open beyond a configurable window
                                     (proposed default: 24h) without reaching
                                     completed — not set by a live timer
                                     while the tab remains open
completed  → (terminal — immutable, no further transitions or edits)
```

Autosave writes to `localStorage` on every field blur/change, no explicit
"save" step — consistent with the local-only, crash-tolerant design already
implied by client-side-only storage.

### 8.14 Browser support and `viewportClass`

Last two versions of Chrome, Firefox, Edge, and Safari — no legacy/IE
support. `viewportClass`: `"desktop"` ≥ 1024px logical width, `"tablet"`
600–1023px. Below 600px is out of scope for v0.1 (not phone-optimized; the
six-field evaluator form is long enough that phone use would need its own
design pass, not a squeeze of the tablet layout).

### 8.15 Accessibility beyond axe

Playwright coverage must also verify, not just axe-core's static checks:
focus moves to the incoming field's heading on every `FieldQuestion`
transition (not left on the previous "Next" button); form-validation errors
are announced via an `aria-live` region, not conveyed by color alone;
`SessionReview.tsx` edit-links return focus to the corresponding field on
click, not to the top of the page.

### 8.16 License, citation metadata, GitHub Pages base path

License: MIT, per the original brief. `CITATION.cff`: create now with
placeholder author/repository/DOI fields as already specified, to be filled
in before release. **GitHub Pages base path in `vite.config.ts`
(`base: '/<repo-name>/'`) needs the actual repository name — this is not
decidable from the specification alone and is the one item in this section
that needs a one-line answer from whoever creates the GitHub repository,
though it is a naming detail, not a scientific or methodological one.**

---

## 9. Resolved ambiguities from Design Review §5 (engineering-level only)

- **Distribution unit:** the administrator distributes a whole `Study`
  (matches `implementation-plan.md` §2's existing `study-config.json` flow).
  Round-only or filtered exports are a v0.2 nicety, not needed for v0.1.
- **Evaluator flow:** one import surfaces every `RoundScenario` assigned to
  the evaluator's `evaluatorGroup` as a queue; the evaluator completes them
  one at a time within a single continuous flow, not one manual import per
  scenario.
- **"Basic descriptives" (v0.1 scope):** mean, median, mode, range, and
  interquartile range per rating variable, per field, per round — this
  restates, in v0.1 terms, what the original brief's deferred Analyst-panel
  section already specified for these statistics.
- **Landis & Koch band labels at boundaries and for κ < 0:** use the
  standard extended table, which already defines "poor" for κ < 0 — no
  special-casing needed at implementation time.

**Not resolved here, now formally tracked as §7 sign-off item 6:** whether SUS is measuring
the burden of rating *one scenario* with the six-field instrument (the
current model — `sus` lives on each `EvaluationSession`) or the burden of
the *tool overall* across a sitting (would need a session-independent SUS,
separate from any one scenario). This is not purely an engineering
question — SUS was designed as a single-use, end-of-experience measure, and
administering it repeatedly per scenario is a departure from its standard
use that affects what the resulting score actually means. **Confirmed
resolution (§7 item 10): stays per-scenario**, with a visible in-app note
that this is a non-standard use of the instrument.
