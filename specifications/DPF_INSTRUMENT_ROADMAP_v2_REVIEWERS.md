# DPF Instrument — Development Roadmap
## From Narrative to Structured Response: Planned Evolution

**Purpose of this document:** to describe the intended development
trajectory of the DPF Instrument, from its current narrative-only
version (v1.0) toward a more structured future version (v2.0). This
is a planning document, not a finalised specification. All structured
elements described here are provisional and will be retained, revised,
or discarded according to empirical findings from Phase 0 validation.

> **Design note for reviewers.** The categories, scale anchors, and
> analysis options below illustrate the intended development pathway —
> they are not final instrument items. No v2.0 feature will be
> implemented before Phase 0 results are available. The six conceptual
> fields of the DPF framework do not change between versions; only the
> response format and measurement model evolve.

---

## 1. Why a development roadmap?

DPF Instrument v1.0 collects free-text narrative responses to six
conceptual fields. This approach is appropriate for an initial
content-validation study (Phase 0): it preserves response richness,
avoids premature closure of the conceptual space, and allows evaluators
to identify dimensions not anticipated by the instrument designers.

However, free-text responses pose a challenge for systematic agreement
analysis. Two evaluators may identify the same ergonomic demand using
different vocabulary, producing responses that are semantically
equivalent but not directly comparable using standard agreement
statistics. Narrative agreement can only be estimated after responses
have been independently coded into common categories — a process that
is time-consuming, potentially subjective, and difficult to standardise
across sites.

The development roadmap describes how the instrument will evolve, if
Phase 0 results support it, toward a format that reduces this
variability while retaining the analytical richness of the six-field
approach.

---

## 2. What the framework does NOT do — in any version

These constraints apply to v1.0, v1.1, v2.0, and any future version:

- Calculate biological risk or estimate biological hazard level
- Assign a biosafety level (BSL) to any task, agent, or procedure
- Compute a residual risk score
- Generate containment-level recommendations
- Produce operational safety decisions or approvals
- Replace institutional biosafety assessments
- Claim to be a validated measurement instrument before validation
  is complete

Any feature that would produce a biological risk score is prohibited
and will not be introduced in any future version.

---

## 3. Three development stages

### Stage 1: DPF Instrument v1.0 (current)

**Response format:** narrative text (primary); checklist and
categorical items are optional supplements.  
**Agreement statistics:** Cohen's κ and Fleiss' κ on per-field
evaluator ratings (relevance, clarity, exhaustiveness) — not on
narrative text.  
**Purpose:** content validation of the six fields and their conceptual
definitions.  
**Status:** implemented in DPF-RP v1.1; Phase 0 study pending.

---

### Stage 2: DPF Instrument v1.1 (exploratory addition)

**What changes:** adds a structured observation layer alongside the
retained primary narrative. Each field response includes one or more
observations, each specifying:

- A category (from a provisional taxonomy or "Other — specify")
- The task phase to which the observation applies
- Its analytical relevance (low / moderate / high)
- The evidence source(s) supporting it
- The evaluator's certainty level
- A brief rationale

**What does NOT change:** the six conceptual fields, the narrative
response, or any scientific prohibition.

**Why this helps:** it produces directly comparable categorical
variables across evaluators without requiring post-hoc coding of free
text, enabling item-level frequency and agreement analysis in Phase 0.

**Provisional taxonomy note:** the category lists are provisional
starting points. Phase 0 will assess which categories are clearly
relevant, which need revision, and which "Other — specify" entries
merit promotion to formal categories. The taxonomy is expected to
evolve between rounds and across the v1.0-to-v2.0 transition.

**Status:** designed; taxonomy at version 0.1-exploratory.

---

### Stage 3: DPF Instrument v2.0 (planned, gated on Phase 0)

**What changes:** the primary response format becomes structured
scales (ordinal subscales per field) with the narrative as an optional
supplement. Agreement statistics will shift accordingly — weighted κ
or an appropriate ICC model, depending on the scale structure and
study design confirmed at protocol finalisation.

**What this enables:** inter-rater agreement on the substantive
content of field responses (not only on meta-ratings of field quality),
without requiring manual post-hoc coding.

**Gate conditions:** v2.0 development begins only when:
1. Phase 0 with v1.0 (or v1.1) is complete
2. Phase 0 identifies which field dimensions have sufficient evaluator
   agreement and content-validity index to warrant structured scaling
3. Phase 0 identifies which candidate performance-degradation indicators
   (Field 6) have empirical support from Phase 1 mechanism testing
4. A fresh Phase 0 with v2.0 items is planned and resourced before
   Phase 1 use

**Scale anchors and subscale structure** will be designed after Phase
0 findings are available and will be specified in a future version of
this document. They are illustrative at this stage.

**Status:** planned; no implementation before Phase 0 gate.

---

## 4. What remains qualitative — in all versions

The following will not be converted to scales or aggregated into scores
regardless of Phase 0 results:

- **Field 1** (critical task): task description requires specificity
  that category labels cannot capture
- **Field 3** (performance deviation): narrative description of the
  deviation mechanism and its ergonomic initiating conditions
- **Field 5** (control strategy): identification of the specific
  sub-step where no engineering control addresses the precision-failure
  pathway
- **Field 6** (candidate indicators): indicators remain candidates
  until Phase 1 provides empirical support
- The **overall synthesis** of each field response
- All **evaluator comments** on field clarity and proposed revisions

---

## 5. What will never be automated

Regardless of how structured the instrument becomes:

- **No biological risk score** — not from any combination of field
  responses
- **No BSL assignment** — the instrument does not assess agent risk
  levels
- **No operational approval** — the instrument does not determine
  whether a procedure may proceed
- **No traffic-light classification** — no automatic pass/fail or
  colour-coded output
- **No AI-generated safety recommendation** — outputs are evaluator
  characterisations, not machine decisions

The result of a completed evaluation is always a structured
characterisation, not a rating of safety or risk.

---

## 6. Why this approach

The staged development reflects three principles:

**Empirical grounding over premature closure.** The v2.0 scale
structure will be determined by what Phase 0 evaluators actually agree
on, not by what the instrument designers anticipated. Categories that
evaluators consistently mark as irrelevant or unclear will be removed;
dimensions they consistently flag under "Other — specify" will be
promoted to formal items.

**Retained richness.** The narrative response is never replaced.
Structured items are always additive — they improve comparability
without eliminating the qualitative detail that is the instrument's
primary contribution.

**Strict limits on automation.** The transition from narrative to
structured response is specifically designed to improve reliability and
data quality, not to move the instrument toward a risk-scoring function.
The prohibitions in Section 2 are permanent.

---

## 7. Naming conventions

| Version | Response format | Platform | When |
|---|---|---|---|
| v1.0 | Narrative (primary) | DPF-RP v1.1 | Now (Phase 0) |
| v1.1 | Narrative + structured observations (exploratory) | DPF-RP v1.1 | Before or during Phase 0 |
| v2.0 | Structured scales (primary) + narrative (optional) | DPF-RP v2.0 | After Phase 0 gate |
| v3.0 | Validated psychometric instrument | Future | After Phase 2 |
