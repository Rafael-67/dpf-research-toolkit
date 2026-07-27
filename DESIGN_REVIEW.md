# Design Review — Delivered Protection Framework Research Toolkit

> **Architectural consolidation complete — 23 July 2026.** DPF-RP now has one
> structured hybrid instrument, one current workflow and one data model.
> Narrative-only material is retained solely for importing historical records.
> Functional profiles are local (not authentication); study assignments,
> consensus records, audit events, consolidated evaluation states,
> non-decisional consistency checks and non-interpretive statistical methods
> are implemented. Earlier dual-instrument conclusions below are historical.

> **Instrument v1.1 implementation complete — 23 July 2026.** The Structured
> Response Specification and Variable Dictionary are aligned, with no
> unresolved schema conflict. The complete F1-F6 observation model, F3 causal
> chains, evidence selections, evaluator certainty, taxonomy-item ratings,
> validation, persistence, JSON exchange, CSV exports, and merge compatibility
> are enabled. Instrument v1.0 behaviour and version isolation are preserved.
> Verification: 37 unit/integration tests and 15 Playwright/axe tests pass,
> together with strict TypeScript, ESLint, Prettier, and the production build.
>
> Sections below that describe earlier blockers are retained as review history
> only and do not represent the current implementation status. The current
> cross-document result is recorded in
> `specifications/V1_1_SCHEMA_CONSISTENCY_REPORT.md`.

> **Resolution audit — 23 July 2026.** The research team has explicitly
> resolved the four blockers recorded in the normative re-review below. The
> updated `CODING_RULES.md`, `DPF_VARIABLE_DICTIONARY.md`, and
> `CODEX_FIRST_TASK.md` were reread in full before this audit.

## Resolution status

### Resolved

1. **Instrument support:** DPF-RP v1.1 is authorised to execute Instrument
   v1.0 or Instrument v1.1, configured at Study level and constant within a
   Round.
2. **Taxonomy approval:** taxonomy `0.1-exploratory` is approved for the v1.1
   evaluator flow. Its provisional status must be visible wherever categories
   are selected, and categories are guides rather than a mandatory checklist.
3. **Rating set:** all seven variables are normative. `redundancy` and
   `applicability` now have definitions and four-point anchors in the Variable
   Dictionary.
4. **Scenario defaults:** imported JSON without `scenarioClass` becomes
   `reference`; administrator-created UI scenarios become `user`; an explicit
   imported value is preserved.
5. **Mandatory sign-off register:** `PROMPT_MASTER.md` is v3.0 and records all
   ten historical sign-off items as confirmed.

### Resolved structured-schema inconsistency (historical record)

The structured-response export vocabulary is still internally inconsistent:

| Concept | `DPF_STRUCTURED_RESPONSE_SPEC.md` | Instrument v1.1 / Variable Dictionary |
|---|---|---|
| Task phases | `taskPhase` containing strings | `taskPhases` containing `TaskPhaseSelection` objects |
| Certainty | `certainty` | `evaluatorCertainty` |
| F3 recovery deviation | `unscripted_recovery` | `unscripted_recovery_action` |
| CSV certainty column | `{field}_obs_{n}_certainty` | No matching canonical column name stated after the variable rename |

These four names were reconciled in `DPF_STRUCTURED_RESPONSE_SPEC.md`. The
Variable Dictionary was then extended to cover the complete structured schema,
including the additional object shapes and mappings required by the current
specification. No current implementation blocker remains.

### Non-blocking editorial drift

- `CODEX_FIRST_TASK.md` says “eleven documents” but retains the heading “eight
  specification documents,” references “four instrument documents,” and twice
  says there are nine mandatory sign-off items. `PROMPT_MASTER.md` correctly
  records ten.
- The roadmap paragraph in `CODEX_FIRST_TASK.md` still describes the current
  platform as “DPF-RP v1.1 / DPF Instrument v1.0,” although the updated coding
  rules authorise both v1.0 and v1.1.
- `DPF_INSTRUMENT_SPEC_v1.md` §8 lists five agreement-rating variables rather
  than the now-confirmed seven. The research team's explicit decision and the
  authoritative Variable Dictionary resolve implementation meaning, but that
  paragraph should be corrected.

## Current readiness conclusion

**No blocker remains for either Instrument v1.0 or the Instrument v1.1
structured observation data contract and its JSON/CSV exports.**

> **Normative re-review — 23 July 2026.** This section supersedes earlier
> readiness conclusions. It follows the current `CODEX_FIRST_TASK.md` against
> every specification file currently present. Historical findings are retained
> below for traceability.

## 1. Executive summary

The implemented v1.0 platform has a sound local-first architecture and its
existing quality gates pass. However, the specification set is no longer
internally coherent enough to begin the newly described structured-response
work. Three conflicts affect instrument identity, scientific variables, and
backward-compatible data classification:

1. `CODING_RULES.md` §5 says DPF-RP v1.1 implements **DPF Instrument v1.0
   only** and excludes structured observations. In contrast,
   `DPF_INSTRUMENT_SPEC_v1.md`, `DPF_INSTRUMENT_SPEC_v1_1.md`, and
   `DPF_INSTRUMENT_ROADMAP_v2_REVIEWERS.md` say the same platform can select
   Instrument v1.0 or the exploratory Instrument v1.1 and describe v1.1 as
   designed for use before or during Phase 0.
2. `DPF_INSTRUMENT_SPEC_v1.md` authorises five quantitative per-field
   variables (relevance, clarity, exhaustiveness, interpretation difficulty,
   and confidence), while `phase-b-design.md` and the generated schema require
   two additional variables, `redundancy` and `applicability`. Those two
   variables are absent from the authoritative Variable Dictionary.
3. `phase-b-design.md` says an absent `scenarioClass` defaults to `user`;
   `DPF_VARIABLE_DICTIONARY.md` simultaneously states a general default of
   `user` and a legacy native-import default of `reference`. The implementation
   currently applies the safe contextual interpretation—native legacy
   configurations become reference; flexible/user-created cases become
   user—but the normative documents do not express that distinction
   consistently.

These are blocking under `CODEX_FIRST_TASK.md` because implementing either
instrument path would change research-data compatibility and potentially the
Phase 0 measurement model. No structured-observation code has been added.

## 2. Overall assessment

### Sufficiently specified and implemented

- Scientific prohibitions are consistent: no biological-risk calculation,
  BSL assignment, residual-risk score, automated acceptance decision, or
  operational recommendation.
- Study, Round, RoundScenario, Scenario, EvaluationSession, append-only
  completion, version snapshots, local storage, audited merge provenance,
  pseudonyms, and human-mediated exchange are well defined.
- E1–E5 are consistently identifiable as the primary reference set. ORG-01
  and INC-01 are correctly described as a separate research-extension set.
- RTLX/SUS wording, missing-value handling, descriptive agreement display,
  and published-example correctness gates are sufficiently explicit.
- WorkedExample isolation is scientifically justified and structurally
  specified.

### Not yet sufficiently specified

- Which instrument versions the current production platform is authorised to
  run.
- Whether the provisional v1.1 taxonomy is approved production instrument
  content or review-only material.
- The definitive per-field rating-variable set.
- A single, unambiguous classification-default rule.
- Migration and aggregation rules between Instrument v1.0 sessions and
  structured Instrument v1.1 sessions.

## 3. Internal inconsistencies and invalid references

1. **Instrument-version scope (blocking).** `CODING_RULES.md` §5.1 and the
   implementation gate in `DPF_INSTRUMENT_ROADMAP_v2.md` say DPF-RP v1.1
   implements v1.0 exclusively. The v1.0 instrument specification now says the
   platform can operate either v1.0 or v1.1, and the reviewer roadmap places
   v1.1 before/during Phase 0.
2. **Provisional versus required structured content (blocking).**
   `DPF_STRUCTURED_RESPONSE_SPEC.md` and `DPF_INSTRUMENT_SPEC_v1_1.md` call the
   taxonomy exploratory/provisional but also make at least one observation
   mandatory per field and prescribe export fields. The approval state needed
   to turn provisional categories into evaluator-facing instrument content is
   not recorded.
3. **Rating-variable cardinality (blocking).** Instrument v1.0 specifies 30
   agreement outputs per round (five variables × six fields).
   `phase-b-design.md` specifies 42 (seven × six), adding `redundancy` and
   `applicability`. Current schemas and UI follow the latter.
4. **Undefined variables (blocking).** `redundancy` and `applicability` violate
   `CODING_RULES.md` §6 because they are not defined in the current Variable
   Dictionary.
5. **Scenario classification defaults.** `scenarioClass` is described as
   defaulting to `user`, yet the legacy import rule mandates `reference`.
   Contextual defaults are defensible but must be stated explicitly in the
   normative definition.
6. **Schema optionality mismatch.** The dictionary describes classification
   fields as optional with defaults, while the generated study-config JSON
   Schema requires all three fields.
7. **Bootstrap inventory is stale.** `CODEX_FIRST_TASK.md` says there are eight
   specification documents; there are currently fifteen Markdown/JSON
   specification files plus the schema directory.
8. **Mandatory-item count is stale.** `CODEX_FIRST_TASK.md` says nine mandatory
   sign-off items, while `PROMPT_MASTER.md` and the two resolution logs record
   ten.
9. **Missing manuscript reference.** The first-task/repository history refers
   to `2_Manuscript_Anonymized_TRACKED_CHANGES__12_final.docx`, but that file is
   not currently present under `specifications/`.
10. **Duplicate normative drafts.** `phase-b-design.md` and
    `phase-b-design-vNext.md`, and the two Variable Dictionary files, coexist
    without an explicit rule saying which is current. Their content differs in
    scientifically relevant places.
11. **Status text is obsolete.** `implementation-plan.md` and
    `phase-b-design.md` still describe a greenfield/no-code repository although
    the release candidate is implemented and tested.
12. **WorkedExample availability.** `phase-b-design.md` says built-in
    WorkedExample records are shipped, but no approved WorkedExample fixture
    exists. The code correctly defines isolated storage only and does not
    invent example content.

## 4. Missing definitions

1. An explicit approval/status field for the Instrument v1.1 taxonomy and the
   authority that may promote it into evaluator-facing production content.
2. Exact compatibility rules for importing, merging, and comparing v1.0 and
   v1.1 sessions.
3. Whether a Study can mix instrument versions across rounds and, if so, which
   comparisons are prohibited.
4. Authoritative definitions and anchors for `redundancy` and `applicability`,
   or an explicit decision to remove them.
5. A contextual default table for native legacy, flexible-file, built-in, and
   administrator-created scenarios.
6. Approved WorkedExample data, if the post-export view is intended for the
   current release.
7. A migration from schema `1.0.0` to the v1.1 document's stated data schema
   `1.1`, including downgrade/refusal behavior.

## 5. Ambiguous requirements

- Whether “v1.1” refers to the platform release, the instrument, the data
  schema, or all three; the documents use all meanings.
- Whether the minimum viable category-only observation mode is scientifically
  authorised or merely a contingency proposal.
- Whether `narrativeAnswer` remains required in every v1.1 field; the
  structured specification says yes, while roadmap language says narrative is
  always retained but some future descriptions call it optional.
- Whether provisional category agreement may be displayed with κ before the
  taxonomy itself has passed content validation.
- Whether Spanish scientific prompts are a separately approved instrument
  version or only an interface translation; the coding rules require the
  former.

## 6. Implementation risks

1. **Scientific validity:** exposing provisional categories can anchor
   evaluators and constrain the Phase 0 conceptual space.
2. **Data compatibility:** silently combining v1.0 and v1.1 sessions would
   compare different response models.
3. **Construct drift:** retaining undefined ratings changes the instrument
   beyond its authoritative dictionary.
4. **Schema fragmentation:** platform, instrument, framework, taxonomy, and
   envelope versions can diverge without a migration matrix.
5. **Priming bias:** WorkedExample content must remain unavailable during an
   active evaluation and excluded from exports.
6. **False-reference classification:** a broad default can incorrectly promote
   user cases into the primary reference set.

## 7. Suggested engineering improvements

1. Publish one normative “active versions” table covering platform,
   instrument, framework, schema, and taxonomy versions.
2. Mark each specification file as `normative`, `provisional`, `historical`,
   or `generated`, and remove ambiguous `vNext` duplicates from the normative
   set.
3. Add a machine-tested compatibility matrix for session imports and merged
   statistics.
4. Generate TypeScript/Zod/JSON Schema constants from one approved variable
   registry to prevent the dictionary and schema from drifting.
5. Add conformance tests asserting that no WorkedExample key or field can
   appear in evaluator routes or research exports.
6. Add import tests for each contextual scenario-classification default.
7. Update the bootstrap inventory, cross-references, repository status, and
   mandatory sign-off count.

## 8. Readiness confirmation

**The existing Instrument v1.0 application can continue to be tested and
maintained, but the specification is not sufficiently consistent to begin
Instrument v1.1 structured-response implementation.**

Before that feature begins, the research team must explicitly resolve:

1. whether DPF-RP v1.1 is authorised to run Instrument v1.1;
2. whether the provisional taxonomy is approved for evaluator-facing Phase 0
   use;
3. whether the rating set contains five or seven variables, including
   definitions for any retained additions; and
4. the normative contextual defaults for scenario classification.

Under the mandatory workflow, these blockers require stopping the affected
implementation after documenting the review. Routine maintenance outside
those scientific/data-model decisions may continue.

> **Conformance audit addendum — 22 July 2026.** The original pre-implementation
> conclusion below is retained as historical context. All formerly open sign-off
> items are now recorded as resolved in the governing specifications. The audit
> has been expanded to include `CODING_RULES.md`, `DPF_INSTRUMENT_SPEC_v1.md`,
> `DPF_VARIABLE_DICTIONARY.md`, `DPF_VALIDATION_PROTOCOL.md`, and
> `DPF_INSTRUMENT_ROADMAP_v2.md`.

## 0. 2026 conformance findings

### Release closure - v0.1.0-rc.2

This closure supersedes the pre-implementation readiness conclusion and the
historical defect list below. The supplied instrument specification, variable
dictionary, validation protocol, roadmap, coding rules, aligned study
configuration, and explicit user decisions resolved the blocking questions.

- Scope: v0.1 covers collection, versioned exchange, merge, descriptive
  agreement, bilingual UI, and local case import; deferred analyst statistics
  remain v0.2.
- Instrument: unweighted Raw TLX uses six 0-100 step-5 dimensions. SUS uses all
  ten items and visibly declares its per-scenario administration non-standard.
- Assignment: `RoundScenario` explicitly binds scenario versions to rounds;
  evaluators see only assigned cases.
- Demonstrations: exactly five fictional cases (E1-E5) are authoritative; the
  obsolete simulated-spill case is absent.
- Scientific responses: ratings, RTLX, and SUS have no substantive defaults.
  Draft values remain null until explicitly answered, and completion is gated.
- Lifecycle: active drafts resume, drafts older than 24 hours become
  `abandoned`, and completed/abandoned sessions never resume. Completed records
  are immutable.
- Exchange: imports are Zod-validated; evaluation exports require exactly six
  field responses and retain instrument/framework/field versions, provenance,
  and append-only merge logs. JSON Schemas are generated in
  `specifications/schema/`.
- Import formats: case/study import accepts JSON, CSV, DOCX, and PDF locally,
  with MIME checks, a 10 MB limit, and explicit structural errors.
- Verification: 32 unit/integration/statistical tests, 14 Playwright/axe tests,
  strict TypeScript, ESLint, Prettier, and the production build pass.

**Current decision:** ready for anonymous peer review as a research prototype
using fictional/demo information only. It remains unsuitable for real-study
deployment until institutional data-protection and research-governance review.
All later statements that implementation is blocked are retained solely as the
historical baseline and are not the current release status.

### Blocking specification conflicts

1. **Demo dataset conflict — resolved 22 July 2026.** `phase-b-design.md` section 4 and its confirmed
   sign-off item 5 define the original five demonstrations, including the
   simulated-spill case. The current application was subsequently changed by
   explicit user request to E1-E5 from `study-config-aligned.json`. The governing
   demo specification was revised to make E1-E5 authoritative.
2. **Spanish instrument version — resolved 22 July 2026.** The application contained ad-hoc Spanish
   translations of the six evaluator prompts and SUS items. `CODING_RULES.md`
   section 7 requires a separately approved translated instrument version.
   Navigation may remain bilingual, but scientific prompts, RTLX, SUS and scale
   anchors were aligned with the approved Spanish SUS source and INSST NTP 544,
   with the Raw TLX distinction documented.
3. **Duplicate-session merge policy — resolved 22 July 2026.** `phase-b-design.md` section 8.8
   says that duplicate `sessionId` records use last-imported-wins with a warning.
   `CODING_RULES.md` section 9.3 says a merge must never overwrite one imported
   record with another, must preserve non-identifying source-file identity, and
   was revised to follow `CODING_RULES.md`: every record is retained, each file
   receives a non-identifying `importId`, and merged exports include provenance
   plus an append-only merge log.

### Confirmed implementation defects (not methodological decisions)

1. `ClosingSurvey.tsx` paraphrases SUS items 4 and 7 instead of using the
   verbatim wording in the Variable Dictionary.
2. RTLX renders only short subscale labels; the required verbatim prompt text
   and low/high anchors are absent.
3. RTLX and SUS start at substantive defaults (50 and 3). The dictionary and
   coding rules require missing responses to remain missing until selected.
4. Imported native study envelopes are checked only at the envelope level and
   cast to TypeScript types; entity-level schema validation is absent.
5. The export/session metadata lacks a distinct `instrumentVersion`, although
   `CODING_RULES.md` requires platform, instrument, framework, scenario, and
   per-field definition versions.

### Required disposition

Engineering defects 1-4 can be corrected directly from the governing text.
The demo dataset and Spanish scientific wording require specification updates
or explicit approved sources before further scientific-content changes.

**Review date:** 20 July 2026  
**Review status:** Pre-implementation design review  
**Documents reviewed:** `specifications/CODEX_FIRST_TASK.md`, `specifications/PROMPT_MASTER.md`, `specifications/implementation-plan.md`, `specifications/phase-b-design.md`, and the manuscript found in `specifications/` (`2_Manuscript_Anonymized_TRACKED_CHANGES__12_final.docx`).

## 1. Executive summary

The specification establishes a coherent high-level purpose, a sensible client-side architecture, explicit scientific limits, and a useful division between the v0.1 data-collection workflow and deferred v0.2 analysis. The Study/Round/Scenario/EvaluationSession model, append-only versioning intent, hash routing, local-only persistence, pseudonymous evaluator identity, and separation of scientific, study, statistics, and presentation layers provide a strong foundation.

The specification is **not sufficiently complete to begin implementation**. All nine mandatory sign-off items remain explicitly unresolved and are blocking by definition. In addition, several missing data definitions would require the implementer to invent scientific or data-compatibility decisions: `FieldResponse` is referenced but never defined; the six actual framework-field records are absent; the categorical variables needed for agreement and future content-validity analysis are not specified; and the four demo scenarios are named but their content is not supplied. These are not routine engineering gaps.

There are also internal inconsistencies and broken cross-references. The most consequential are inconsistent `Study`/`Project` terminology and JSON filenames, conflicting source paths for merge components, a nonexistent reference to `phase-b-design.md` §3.2, and uncertainty over whether statistical summaries belong to Fase B or Fase D. The repository currently contains only documentation and no Git metadata or application scaffold, consistent with its stated greenfield status but insufficient to execute the required feature-branch workflow without initialization.

Implementation must therefore stop after this review and await explicit research-team decisions plus specification corrections. No application code should be written yet.

## 2. Overall assessment of the specification

### Strengths

- Authority is divided by domain rather than by a misleading global precedence order.
- The product boundary is explicit: the tool supports research and must not calculate Delivered Protection, biological risk, BSL, laboratory recommendations, or scientific conclusions.
- The v0.1 data flow acknowledges the limits of a static, backend-free application and makes human-mediated JSON exchange explicit.
- Core technology choices are mutually compatible with GitHub Pages: Vite, React, strict TypeScript, hash routing, `localStorage`, and client-side export/import.
- Version pinning at Round, Scenario, session, and field-definition levels is directionally sound and supports traceability.
- The permanent prototype warning, no-network/no-telemetry rules, pseudonyms, and delete-all action create an appropriate privacy baseline for a research prototype.
- The statistical correctness gate is unusually concrete and testable.
- The manuscript supports the tool's Phase 0 purpose and confirms that the six-field framework is unvalidated, that categorical classifications are the basis for kappa, and that instrument burden must itself be evaluated.

### Weaknesses

The documents are stronger as an architectural brief than as an implementable software design specification. Several sections say content is “unchanged from v1,” but v1 is not included and the current document does not reproduce that content. Consequently, the design contains interface shells without the scientific fields, response records, coding anchors, validation rules, import/export envelopes, or demo fixtures needed to implement them safely.

The phase boundaries are also under-specified. The Phase Summary gives only one-line completion criteria, while the Phase B design inventory includes features that the plan otherwise associates with later workflow and scientific-quality phases. This prevents an objective determination of what must exist at the end of each milestone.

## 3. Internal inconsistencies and invalid cross-references

### 3.1 Same entity or workflow described differently

1. **Study versus Project terminology and filenames.** `phase-b-design.md` renames `Project` to `Study` throughout and specifies `StudyImport` / `StudyExportImport`. `implementation-plan.md` §2 still requires `project-config.json`, says the administrator creates a “project,” and describes a project/scenario set. The canonical exchange filename and payload entity are therefore inconsistent. Use `Study` consistently and define a stable filename such as `study-config.json`, or explicitly preserve a legacy filename with a compatibility rationale.

2. **Merge component path.** `implementation-plan.md` §6 specifies `src/modes/merge/`. `phase-b-design.md` §2.6 and §5 specify `src/modes/admin/merge/`. The authoritative component inventory points to the latter, but the repository-structure authority points to the former. The documents must be reconciled rather than silently choosing one.

3. **Statistics in Fase B versus Fase D.** `phase-b-design.md` requires `RoundAgreementSummary.tsx`, `cohensKappa.ts`, and `fleissKappa.ts` in its Fase B design. `implementation-plan.md`'s Phase Summary defines Fase B as navigation/data model/storage and Fase D as “validated statistics.” It is unclear whether Fase B must include working statistics, UI placeholders only, or no statistics until Fase D. This also affects the definition-of-done gate, because `PROMPT_MASTER.md` requires the statistical validation suite for every milestone.

4. **Merge workflow timing.** `implementation-plan.md` makes merge a first-class v0.1 feature, but the Phase Summary assigns import/export and merge operation to Fase C. `phase-b-design.md` includes merge components in the Phase B inventory. The expected Fase B behavior for these components is not defined.

5. **Round locking behavior.** `phase-b-design.md` defines Round status as `open | locked`, but its navigation description says “lock/unlock.” Unlocking implies a transition from locked back to open, while the audit and comparison logic suggests lock might be final. The allowed transition model and effects on completed sessions are unspecified.

6. **Agreement eligibility and timing.** The round summary is described as available “once locked,” but no rule states whether a round may be locked with incomplete sessions, fewer than two evaluators, fewer than three evaluators for Fleiss' kappa, missing categorical responses, or mixed field-definition versions. The statistics scope is therefore not operationally defined.

7. **Framework change comparison key.** `FrameworkChangeLogEntry` is defined per `fieldId` with previous/new definition versions, while `EvaluationSession` stores one scalar `fieldDefinitionVersion` for all six `FieldResponse` records. The design does not explain whether all six fields share a single version or have independent versions. The merge rule “between two sessions' `fieldDefinitionVersion` values” cannot be applied reliably if fields evolve independently.

8. **Scenario/framework audit coverage.** Scenario content is append-only and carries a `frameworkVersion`, but `FrameworkChangeLogEntry` only describes changes to framework fields. No rule defines whether scenario-version changes can make sessions non-comparable, despite scenarios being part of the rated stimulus.

9. **Phase 0 acceptance threshold versus tool presentation.** The manuscript specifies pre-registration of κ ≥ 0.60 as an acceptance threshold. `PROMPT_MASTER.md` requires the tool never to convert agreement into an accept/reject decision. These statements can coexist only if the threshold remains an external research-protocol decision and the application displays descriptive values and labels without applying it. That boundary should be stated explicitly in the governing specifications.

### 3.2 Invalid or inaccurate cross-references

1. `PROMPT_MASTER.md` mandatory sign-off item 4 points to `phase-b-design.md` §3.2 for the ICC model. No §3.2 exists in that document; ICC is discussed in `implementation-plan.md` §3.2.

2. `phase-b-design.md` §2.5 says `scenarioVersion` is copied at session start and points to §0.4. Section 0.4 discusses the audit/migration layer, not this snapshot rule. The closest substantive sections are §2.3–2.5.

3. `PROMPT_MASTER.md` refers to “content-validity analysis” and “inter-rater agreement” sections in `implementation-plan.md`. Those named sections do not exist. Related material appears under “Clarification: Agreement Statistics,” §1, and §4.

4. `phase-b-design.md` says `FieldResponse` is “unchanged from v1,” but no v1 document or definition exists in the repository. This is not a valid implementable reference.

5. `phase-b-design.md` says the four demo scenarios are “unchanged from v1,” but no v1 scenario definitions exist. Only their short names are present.

6. `implementation-plan.md` §1 refers to the manuscript's §4.4. A manuscript exists, but the plan does not name its path and two copies appear in different repository folders. The intended source-of-truth copy is ambiguous.

7. The opening instruction says to read every document under `specifications/`, then says the folder contains three documents. The actual folder contains the three governing Markdown files, the first-task instruction, and a manuscript DOCX. The manuscript's authority is not defined.

8. `implementation-plan.md`'s proposed repository tree omits `CODEX_FIRST_TASK.md` and the manuscript that actually exist under `specifications/`. If these are intentionally non-governing bootstrap/reference files, the tree and document policy should say so.

## 4. Missing definitions

### Blocking scientific/data definitions

1. **`FieldResponse`.** Its complete shape, required variables, per-field identifiers, response value representation, relevance/clarity measures, confidence, redundancy/completeness inputs, missing/insufficient-information semantics, comments, and timestamps are absent.

2. **The six framework-field records.** The interface exists, but the six `name`, `promptText`, `responseType`, categorical options or ordinal scales, `frameworkVersion`, and `fieldDefinitionVersion` values do not. The manuscript supplies conceptual field names, not validated UI prompts or coding anchors.

3. **Variables required for future I-CVI/S-CVI.** The plan requires v0.1 to collect every necessary variable but does not enumerate them, define their scales, or specify the relationship between relevance/clarity ratings and each field response.

4. **Agreement input variables.** The documents state that kappa applies only to categorical field-level variables, yet the six fields are described as narrative-first and no categorical classifications/options are defined. The unit of analysis and missing-data treatment are absent.

5. **Demo scenario content.** Only four labels are supplied. The required `Scenario` fields, fictional details, versions, and explicit safety redactions are missing, so sign-off item 5 cannot be meaningfully answered from the present specification.

6. **Instrument text and scoring contract.** RTLX versus NASA-TLX is unresolved; SUS/RTLX wording is unresolved; allowed score ranges, integer/step constraints, nullability during partial sessions, and whether scores are computed or merely stored are not fully specified.

7. **Breaking-change classification.** This is intentionally open and mandatory. Until confirmed, merge compatibility cannot be implemented.

### Engineering and schema definitions

8. JSON Schema generation tool and canonical schema location.
9. Export envelope: schema version, export type, app version, generated timestamp, entity collections, checksums if any, and forward/backward compatibility behavior.
10. Import validation behavior and user-visible error taxonomy.
11. Merged-dataset schema and CSV column definitions.
12. Duplicate key definition and conflict-resolution outcomes. The plan mentions duplicate scenario/evaluator/round combinations, but does not define whether `scenarioVersion`, session status, or export identity participates.
13. Identifier generation and normalization rules.
14. Version-string format and ordering semantics for framework, field, and scenario versions.
15. Date/time representation beyond `string` (expected ISO 8601 UTC should be stated if intended).
16. `evaluationStatus` transition rules, autosave behavior, abandonment/resumption triggers, and completed-session immutability.
17. Cardinality and uniqueness constraints: one session per evaluator/round/scenario or multiple attempts; one RoundScenario per version; round-number uniqueness per study.
18. Referential-integrity behavior when deleting or closing studies, scenarios, rounds, or local data.
19. Full set of `localStorage` indexes/listing strategy. Per-record keys exist, but no index or discovery/migration strategy is defined.
20. Storage quota and failed-write behavior.
21. Exact “Delete all local data” key scope and confirmation behavior.
22. Browser support and the meaning of the absent mobile viewport class.
23. Accessibility acceptance details beyond axe: keyboard workflow, focus restoration, error summaries, and screen-reader announcements for multi-step forms.
24. License, citation metadata, and target GitHub Pages repository/base path.

## 5. Ambiguous requirements

- Whether v0.1 is intended to run a real study or only a demo/prototype. The privacy banner says it must not be used for real studies without institutional review, while the data-flow section describes the actual study workflow.
- Whether the administrator distributes a whole Study, one Round, or a filtered Study/Round/scenario package.
- Whether evaluators rate all scenarios in one imported package through one continuous workflow or create a separate session per scenario manually.
- Whether `nasaTlx` is deliberately named generically when RTLX is selected, and how the model changes if full NASA-TLX is approved.
- Whether SUS is administered per scenario, per round, or once per overall tool-use session. It currently resides on each scenario-specific `EvaluationSession`.
- Whether RTLX is measuring the burden of rating one scenario, using the six-field instrument, or the underlying laboratory task described in that scenario.
- What “basic descriptives” includes in v0.1.
- Which categorical response values feed Cohen's/Fleiss' kappa and how “insufficient information,” missing, and not-applicable responses are handled.
- Whether Landis–Koch band labels are required for negative kappa values and values at exact boundaries.
- Whether an unlocked or reopened Round invalidates prior exports or agreement summaries.
- Whether the review timestamp updates on every review entry or only the first.
- Whether `resumedAt` should be an empty array rather than nullable, and what event creates a resume record.
- Whether `fictionalScenarioConfirmed` is a required completion gate and what happens when the evaluator cannot confirm it.
- Whether `userAgent` is truly required for research and how it aligns with data-minimization claims.
- What documentation constitutes an acceptable out-of-band distribution channel and associated data-protection controls.

## 6. Risks for implementation

1. **Scientific validity risk — blocking.** Inventing response fields, scales, categorical options, missing-data rules, or instrument wording would change the study instrument.
2. **Research-data compatibility risk — blocking.** Undefined export envelopes, version semantics, and merge keys could produce incompatible datasets or silent pooling of incomparable sessions.
3. **Methodological integrity risk — blocking.** Unclear statistical inputs and phase placement could lead to kappa being computed on unsuitable variables or presented as a decision rule.
4. **Sign-off risk — blocking.** All nine mandatory items remain unresolved.
5. **Privacy/legal risk — potentially blocking.** Out-of-band transfer and intended real-study use require an explicit institutional workflow; browser metadata and free text increase the data-governance surface.
6. **Irrecoverable local-data risk.** `localStorage` has limited quota and no transactional writes; without recovery and validation rules, partial or corrupt records may be exported.
7. **Merge integrity risk.** Per-field version evolution cannot be checked using the current single session-level version field.
8. **Scope and schedule risk.** The feature inventory and phase summary disagree about when merge and statistics must be complete.
9. **Testability risk.** Published-example citations are named but exact tables/cases, expected values, precision, and allowed tolerance are not recorded in the specification.
10. **Repository workflow risk.** The required feature-branch and pull-request workflow cannot begin until a Git repository and remote/deployment target exist.
11. **Accessibility risk.** Automated axe checks alone will not verify the complex keyboard and focus behavior implied by a multi-step form.
12. **Terminology migration risk.** Continued `Project` names in filenames and payloads could become permanent compatibility debt after the intended `Study` rename.

## 7. Suggested improvements

These are engineering/documentation improvements only; they do not propose new scientific methodology.

1. Publish a corrected specification revision that resolves every inconsistency and broken reference identified in §3.
2. Add a normative data dictionary containing every interface, field, type, cardinality, required/optional rule, invariant, and status transition.
3. Replace all “unchanged from v1” statements with the complete current definitions or include the referenced v1 source explicitly.
4. Add the six actual `FrameworkFieldDefinition` records and four full demo `Scenario` fixtures after research-team approval.
5. Define versioned import/export envelopes and include valid, invalid, duplicate, old-version, and breaking-change fixtures.
6. Add a traceability matrix mapping every phase completion criterion to routes, components, domain services, storage behavior, tests, and documentation.
7. Expand the Phase Summary into objective per-phase acceptance criteria, explicitly locating merge and statistics work.
8. Define state-transition diagrams for Study, Round, and EvaluationSession, including immutability and reopening rules.
9. Define merge behavior as deterministic decision tables covering duplicates, incomplete sessions, version conflicts, and non-comparable groups.
10. Specify exact statistical test fixtures, source table/page, expected output, precision, and tolerance while preserving the existing correctness gate.
11. State explicitly that any manuscript acceptance threshold belongs to the external research protocol and is not an automated application decision, if that is the intended boundary.
12. Add storage schema versioning, migrations, quota-error handling, backup/export reminders, and corruption recovery behavior.
13. Define a privacy data inventory for every stored/exported field, including the justification and retention expectation for `userAgent`, locale, and free text.
14. Name the authoritative manuscript copy or move reference material outside `specifications/`; update the “three documents” wording accordingly.
15. Initialize Git only after blockers are resolved, then create the required phase branch before scaffolding.

## 8. Confirmation of readiness to begin implementation

**No. The specification is not sufficiently complete to begin implementation.**

The following blockers must be resolved first:

- Explicit research-team answers to all nine mandatory sign-off items.
- A complete definition of `FieldResponse` and all categorical/content-validity variables required in v0.1.
- Approved definitions and prompts for the six framework fields.
- Complete demo scenario content sufficient for the required realism/fictionality sign-off.
- A confirmed agreement-variable and missing-data contract that does not require inventing methodology.
- Reconciliation of version semantics needed to prevent incompatible data pooling.
- Clarification of the external κ acceptance threshold versus the application's descriptive-only behavior.

After those scientific and data-compatibility blockers are resolved, the remaining engineering gaps can be closed in the specification without further methodological invention. Only then should Fase B begin.

## Appendix A — Mandatory sign-off register

All items are currently **unconfirmed / blocking**:

1. v0.1/v0.2 scope split.
2. RTLX versus full NASA-TLX.
3. Acceptability of the out-of-band JSON distribution channel.
4. Whether every evaluator rates every scenario or only a subset.
5. Adequacy of the four fictional demo scenarios.
6. One-field-at-a-time evaluator flow versus a single scrollable form.
7. Definition of `breakingChange`.
8. Standard published versus lab-adapted RTLX/SUS wording.
9. Default values for `includeRtlx` and `includeSus`.
