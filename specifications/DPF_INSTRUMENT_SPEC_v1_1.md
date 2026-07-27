# DPF Instrument Specification v1.1

> **Current consolidated instrument — 23 July 2026.** This is not a parallel
> instrument. It is the single structured hybrid DPF-RP evaluation workflow.
> Comparative descriptions below are historical migration context only.

> **Scope boundary — 23 July 2026.** This version is the individual
> structured-primary assessment instrument. It includes candidate searchable
> F1-F6 taxonomies, separate ordinal ratings, mandatory concise reasoning,
> optional extended comments, multiple observations, field summaries,
> taxonomy-item validation, versioned JSON and normalised CSV. User roles,
> cloud or multicentre management, evaluator assignment, consensus/discrepancy
> workflows, dashboards, institutional taxonomies, predictive models and
> automatic interpretation remain reserved for v2. All candidate taxonomy
> values remain provisional and revisable, not validated classifications.
## Delivered Protection Framework — Semi-Structured Observation Model

**Status:** Exploratory extension of DPF Instrument v1.0. Adds
structured observations alongside the retained primary narrative.
Taxonomy lists are provisional and subject to Phase 0 validation.

**Instrument version:** DPF Instrument v1.1  
**Platform:** DPF-RP v1.1.x (same platform as v1.0; instrument version
is selected at study configuration time)  
**Data schema version:** 1.1  
**Taxonomy set version:** 0.1-exploratory  
**Prerequisite:** DPF Instrument v1.0 specification
(`DPF_INSTRUMENT_SPEC_v1.md`) — read first. This document specifies
only the differences and additions.

---

## 1. What changes from v1.0

DPF Instrument v1.1 adds a **structured observation layer** to each
field response. The primary narrative (`narrativeAnswer`) is retained
without change. No v1.0 variable is removed or replaced.

| Element | v1.0 | v1.1 |
|---|---|---|
| `narrativeAnswer` | Required; primary response | Retained; required |
| `observations` | Not present | Required ≥ 1 per field (or `noObservationReason`) |
| `overallSynthesis` | Not present | Optional (≤ 200 words) |
| `responseMode` | Not present | `"structured_narrative"` |
| `structuredItemSetVersion` | Not present | `"0.1-exploratory"` |
| Category lists | Not present | Provisional; subject to Phase 0 validation |
| Taxonomy review screen | Not present | Required at end of round |

What does NOT change from v1.0:
- The six conceptual fields and their definitions
- The framework version (`0.1.0-draft`)
- The per-field evaluator ratings (relevance, clarity, exhaustiveness,
  interpretationDifficulty, confidenceRating)
- All scientific prohibitions (no biological risk score, no BSL
  assignment, no operational recommendation)
- The κ/Fleiss' κ computation on structured ratings
- The closing survey (RTLX, SUS)
- The backwards-compatible import rule for v1.0 sessions

---

## 2. The observation as unit of response

Each field response in v1.1 consists of:

1. **`narrativeAnswer`** — required free-text primary response
2. **`observations[]`** — one or more structured observation records
3. **`overallSynthesis`** — optional brief integrative summary

An **observation** is a structured record of one identified element
within a field. Multiple observations per field are expected and
encouraged when the task has distinct phases or multiple mechanisms.

### Obligation rule

When `responseMode = "structured_narrative"` (v1.1):
- `observations` must contain **at least one** record, OR
- `noObservationReason` must be set to `"insufficient_information"` or
  `"field_not_applicable"`

An empty `observations` array with no `noObservationReason` is a
**validation error** in v1.1 mode. The platform must prevent submission
in this state.

### Category lists as guides, not checklists

Evaluators must be instructed:

> *"Consider, where relevant, the following — you may identify
> additional items not listed. For each item included, specify the task
> phase, its analytical relevance, the evidence supporting it, your
> certainty, and a brief rationale."*

Do NOT present categories as a mandatory checklist. `Other — specify`
must always be visible and its usage is recorded as primary data.

---

## 3. BaseObservation and field extensions

Full schema in `DPF_VARIABLE_DICTIONARY.md` Part J. Summary:

```typescript
interface BaseObservation {
  id: string;
  fieldId: "F1"|"F2"|"F3"|"F4"|"F5"|"F6";
  category: string;
  isOtherCategory: boolean;
  otherCategoryText?: string;
  taskPhases: TaskPhaseSelection[];        // {value: TaskPhase; otherText?}
  analyticalRelevance: AnalyticalRelevance;
  evidenceSources: EvidenceSourceSelection[]; // {value: EvidenceSource; otherText?}
  evaluatorCertainty: EvaluatorCertainty;  // evaluator's confidence, not doc availability
  rationale: string;                       // ≤ 500 chars; required
  createdAt: string;
}
```

Field-specific extensions:
- **F3:** `F3Observation` adds `deviationType[]`, `initiatingConditions[]`, `operationalOutcome[]`, optional `releasePathway[]`
- **F5:** `F5Observation` adds `controlLayer[]`, `controlFunction[]`, `humanPerformanceDependency`, `gapStatus`, `recoveryControlStatus`
- **F6:** `F6Observation` adds `indicatorName`, `indicatorType`, `observationMethod[]`, `expectedDirection?`, `protectiveAdaptationAmbiguity`
- **F1, F4:** Use `BaseObservation` directly in v1.1

---

## 4. Taxonomy review screen (required in v1.1)

At the end of each evaluation round, after all field responses are
complete, the platform must present a **taxonomy review screen** before
the session is exported. This screen enables I-CVI computation for
category-level content validation.

### What the screen shows

For each field, display every category that appears in the field's
taxonomy (including `Other — specify` items entered in this session):

> *"After completing this evaluation, please rate the relevance of each
> category below to the six-field framework in general (not to the
> specific scenario you evaluated). This helps us improve the category
> lists."*

Rating scale per category:
- 1 = Not relevant to this field
- 2 = Somewhat relevant
- 3 = Quite relevant
- 4 = Highly relevant — should always be in this field's list

### What the screen produces

- `taxonomyItemRating[]` per field: `{ categoryId, rating: 1|2|3|4 }`
- Stored separately from `observations` (not mixed with scenario data)
- Used to compute I-CVI per category: proportion of evaluators rating
  ≥3 (I-CVI ≥ 0.78 for n≥5 = acceptance threshold; Lynn, 1986)

### Do NOT show during evaluation

The taxonomy review screen must appear only AFTER all six fields are
completed. It must not be accessible during the evaluation session. It
is a post-completion instrument-improvement step, not part of the
scenario evaluation itself.

---

## 5. Category-level agreement analysis (v1.1 addition to Phase 0)

Agreement analysis in v1.1 has two levels:

### Level A — Identification agreement

For each scenario × field × category:

```
0 = not identified by this evaluator
1 = identified (present in ≥1 observation)
```

Computed across all evaluators. Produces binary agreement matrix.
Statistics: percent agreement, κ (with prevalence caution),
Gwet AC1 (more robust to prevalence extremes).

### Level B — Valuation agreement

Only among evaluators who identified the same category (Level A = 1):
compare `analyticalRelevance`, `taskPhases`, `evaluatorCertainty`.

These two levels must be reported separately. Computing only Level B
(agreement among identifiers) produces an artificially favourable
picture by excluding identification disagreements.

### Prevalence caution

Categories selected by almost all evaluators (high prevalence) or
almost none (low prevalence) will produce low κ despite high percent
agreement. Always report:
- Percent agreement
- κ
- Gwet AC1 (where implemented)
- Selection prevalence per category

The platform must export per-category prevalence in the round summary.

---

## 6. What `Other — specify` produces analytically

`Other — specify` entries are **primary analytic data**, not residual
text. After each Phase 0 round, the research team reviews all `Other`
entries and decides for each:

| Decision | Action |
|---|---|
| `incorporate` | Add to taxonomy in next version (`0.1 → 0.2`) |
| `revise` | Keep concept; improve label or definition |
| `merge` | Assign to existing category with documented rationale |
| `split` | Separate heterogeneous category |
| `remove` | Insufficient frequency or relevance |
| `promote` | Frequent `Other` text → new formal category |

Each decision is logged with rationale. The `structuredItemSetVersion`
increments with each taxonomy change.

---

## 7. Naming conventions

| Entity | Name |
|---|---|
| Framework | DPF Framework 0.1.0-draft |
| Instrument (narrative only) | DPF Instrument v1.0 |
| Instrument (semi-structured) | DPF Instrument v1.1 |
| Platform | DPF-RP v1.1.x |
| Data schema (v1.0 sessions) | dataSchemaVersion: "1.0" |
| Data schema (v1.1 sessions) | dataSchemaVersion: "1.1" |
| Taxonomy set | taxonomySetVersion: "0.1-exploratory" |

DPF-RP platform version (1.1.x) and DPF Instrument version (1.0 or
1.1) are independent. The same platform can run studies using either
instrument version. The instrument version is set at study
configuration time and held constant within a round.

---

## 8. Export additions for v1.1 sessions

Every v1.1 session export must add to the envelope:

```json
{
  "dataSchemaVersion": "1.1",
  "instrumentVersion": "1.1.0",
  "structuredItemSetVersion": "0.1-exploratory",
  "taxonomyItemRatings": {
    "F1": [{ "categoryId": "repetitive_sequence", "rating": 4 }, ...],
    "F2": [...],
    "F3": [...],
    "F4": [...],
    "F5": [...],
    "F6": [...]
  }
}
```

`taxonomyItemRatings` contains the taxonomy review screen results.
They are exported alongside the session but must never be mixed with
`observations` in analysis — they rate the instrument, not the scenario.
