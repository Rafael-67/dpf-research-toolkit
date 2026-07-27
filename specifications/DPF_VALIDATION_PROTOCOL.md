# DPF Validation Protocol

> **Consolidated scope — 23 July 2026.** Validation applies to the single
> structured hybrid instrument. Any choice between narrative and structured
> entry below is superseded; legacy narrative data may be analysed only as
> explicitly identified historical records.

> **Instrument v1.1 quantitative extension — 23 July 2026.** Phase 0 keeps
> selection frequency, `other` use, missing-item proposals, five observation
> ratings, and taxonomy relevance/clarity/distinctiveness analytically
> separate. Only explicit taxonomy relevance ratings may support
> content-validity calculations. Ordinal summaries use frequency, missingness,
> median and interquartile range. Agreement method selection and interpretation
> remain the research team's responsibility. No total observation or field
> score is calculated.
## Delivered Protection Framework — Empirical Validation Programme

**Status:** Protocol specification, derived from manuscript Section 5.  
**Relationship to manuscript:** This document operationalises the staged validation agenda described in Section 5 of the accompanying manuscript ("From Certified Capability to Delivered Protection: A Human-Factors Framework for Biocontainment Laboratories"). The gate criteria in this document correspond to the phase descriptions in the manuscript and are pre-registered as acceptance thresholds before data collection begins.  
**Version:** 1.0  
**Scope:** Phase 0 through Phase 3. Phase 0 uses DPF Instrument v1.0 or v1.1 (version must be pre-registered and held constant within each primary analysis round). Phase 1 onward may use DPF Instrument v2.0 if Phase 0 confirms sufficient content validity and the v2.0 Phase 0 is also passed.

---

## 1. Overview of validation stages

```
Phase 0 — Content validation (prerequisite)
    ↓
    Gate: κ ≥ 0.60 on ≥ 4 of 6 fields
    ↓
Phase 1 — Mechanism testing (H3)
    ↓
    Gate: Association between F2 demand scores and precision outcomes
    ↓
Phase 2 — Framework–intervention comparison (H4)
    ↓
    Gate: Reduction in near-misses with framework-guided intervention
    ↓
Phase 3 — Instrument burden and usability study (H5)
    ↓
    Gate: Acceptable SUS + RTLX with Phase 2 benefit
    ↓
DPF Instrument v2.0 + validated DPI (if all gates passed)
```

At each gate, a null or mixed result triggers a **framework revision process**, not automatic abandonment. See Section 6 for interpretation of non-confirmatory results.

---

## 2. Phase 0 — Framework development and content validation

### 2.1 Purpose

To determine whether the six-field instrument has acceptable content validity and inter-rater reliability before any mechanism or effectiveness claim is tested. Phase 0 answers the question: *Do trained experts agree on how to characterise a task using this instrument?* It does not test whether the instrument predicts anything.

**Feasibility:** High. Phase 0 can be conducted entirely with fictional scenarios and without access to real laboratory data.

### 2.2 Study design

**Design:** Expert panel, multi-round content-validation study (Delphi-adjacent).  
**Platform:** DPF-RP v1.1 implementing DPF Instrument v1.0.  
**Panel size:** 5–10 evaluators minimum for meaningful Fleiss' κ and I-CVI/S-CVI computation. Target: 8–12.  
**Evaluator profiles:** Mixed panel including biosafety professionals, ergonomists, human-factors specialists, and laboratory operators. Record `professionalProfile` and `experienceLevel` for all evaluators.  
**Rounds:** Minimum two rounds. Round 1 identifies problems; Round 2 tests revisions.  
**Scenarios:** 5 aligned demonstration scenarios (E1–E5) as defined in Supplementary Materials S1 and S2 and implemented in DPF-RP v1.1. All fictional.  
**Blinding:** Evaluators complete scenarios independently. No discussion between evaluators during a round.

### 2.3 Outcome variables

**Instrument version used in Phase 0:**
Phase 0 may be conducted using DPF Instrument v1.0 (narrative only) or v1.1 (narrative + structured observations). The chosen version must be specified in the pre-registration and held constant across all evaluators within a round. Do not mix v1.0 and v1.1 responses within the same primary analysis round.

**If v1.1 is used, the Phase 0 validates two levels:**
1. The six fields (content validity of the field-level instrument)
2. The structured observation taxonomies (content validity of the category lists)

This is an implementation of **Strategy B (hybrid Phase 0)**: taxonomies are provided as provisional structured items and evaluated empirically during Phase 0 rather than derived inductively from free-text coding. Strategy B must be declared in the pre-registration.

**Primary outcomes (field-level):**
- Cohen's κ (pairwise) per rating variable (`relevance`, `clarity`, `exhaustiveness`) per field
- Weighted Cohen's κ is preferred over unweighted κ for the 4-point ordinal rating scales
- Fleiss' κ (panel-wide) per rating variable per field
- I-CVI: proportion of evaluators rating each field as relevant (score ≥ 3 on the 4-point scale)
- S-CVI/Ave: mean I-CVI across all six fields

**Additional primary outcomes for v1.1 (taxonomy-level):**
- Frequency of each structured category per field across evaluators
- Proportion of observations using `Other — specify` per field
- Category selection frequency per field (proportion of sessions in which each category was selected ≥1 time)
- Category-level I-CVI: computed from the **taxonomy review screen** ratings (not from selection frequency — see §2.4)
- Binary identification agreement per category (all evaluators; Level A — see §2.4)
- Agreement on `analyticalRelevance` rating per category (where selected by ≥2 evaluators)
- Categories not selected by any evaluator (candidates for removal)
- `Other — specify` entries: qualitative review for incorporation, merging, or retention

**2.4 Taxonomy review screen (v1.1 only)**

At the end of each v1.1 round, evaluators complete a taxonomy review screen (specified in `DPF_INSTRUMENT_SPEC_v1_1.md §4`). This screen presents every category in the field taxonomies and asks each evaluator to rate its relevance (1–4 scale). I-CVI per category is computed from these explicit ratings, not from selection frequency during scenario evaluation. The two measures (selection frequency and taxonomy-review I-CVI) capture different constructs and must be reported separately.

**Phase 0 taxonomy decisions (post-round review):**
For each structured category, the research team must decide:
- `incorporate`: sufficient frequency and clarity → retain in v1.1 taxonomy
- `revise`: concept valid but label or definition unclear → revise label
- `merge`: overlaps with another category → combine
- `split`: category is too heterogeneous → separate into subcategories
- `remove`: insufficient frequency or relevance → remove from v1.1
- `promote`: frequent `Other` text that warrants a new formal category

These decisions are made before Phase 1 begins and must be logged in the `FrameworkChangeLogEntry` system with `changeType: "taxonomy_revision"` and full rationale.

**Secondary outcomes:**
- Percent agreement per field per rating variable
- Mean `interpretationDifficulty` per field
- Mean `confidenceRating` per field
- Field completion time (`fieldDurations`)
- RTLX subscale scores (instrument burden)
- SUS score (platform usability)

### 2.4 Gate criteria (pre-registered)

The following thresholds are set before data collection. They are not adjusted after seeing the data.

**Primary gate variable:** `relevance` rating (I-CVI per field).  
**Secondary indicators (revision criteria, not gate):** `clarity` and `exhaustiveness`.

| Criterion | Threshold | Statistic | Basis |
|---|---|---|---|
| Field relevance (I-CVI) | ≥ 0.78 | Proportion rating ≥3 | Lynn (1986), panel ≥5 |
| Fields passing relevance gate | ≥ 4 of 6 | — | Conservative acceptance |
| S-CVI/Ave | ≥ 0.90 | Mean I-CVI | Polit & Beck (2006) |
| Category identification agreement (v1.1) | Report only | % agreement + κ + AC1 | Gwet (2008) |
| Category I-CVI (taxonomy review screen) | ≥ 0.78 per retained category | Lynn (1986) | Taxonomy validation |
| Weighted κ on `relevance` (multi-rater) | ≥ 0.60 as secondary check | Landis & Koch (1977) | Weighted preferred for ordinal |

**A field "passes"** when its I-CVI ≥ 0.78. `clarity` and `exhaustiveness` below a threshold trigger revision, not rejection. Cohen's κ and Fleiss' κ are computed and reported for all rating variables but are secondary to I-CVI for the gate decision. Fleiss' κ (unweighted) does not exploit ordinality — this limitation must be noted in any publication reporting Phase 0 results. Gwet AC1 is recommended as a prevalence-robust complement where implemented.

**Fields that fail the κ gate** are candidates for revision in a subsequent round, not for removal. The pattern of failure (which fields, which rating dimensions) informs the revision.

**Revision trigger:** If fewer than four fields pass the κ gate in Round 1, a structured revision process is initiated before Round 2. The revision must be documented in the `FrameworkChangeLogEntry` system with `changeType` and `rationale`.

### 2.5 Instrumentation and data management

- All data collected via DPF-RP v1.1
- Export: pseudonymised JSON per evaluator per scenario
- Merge: administrator imports all JSON files into DPF-RP v1.1 merge view
- Output: merged dataset (JSON + CSV) for offline statistical analysis
- Agreement statistics: computed within DPF-RP v1.1 (κ, Fleiss' κ, percent agreement) and verified externally
- Archive: merged dataset and all individual evaluation files stored securely, linked to the registered protocol

### 2.6 Cognitive interviews (companion study)

Alongside the rating study, conduct cognitive interviews with a subset of evaluators (n = 3–5) to understand how they interpret each field prompt and (in v1.1) each structured category. Specifically:
- Which prompts are interpreted differently by different evaluators?
- Are any field boundaries ambiguous (content that evaluators are unsure which field to put in)?
- Does Field 6 (candidate indicators) require a worked example to produce consistent responses?
- (v1.1 only) Are the structured category labels clear and unambiguous?
- (v1.1 only) Do evaluators understand the distinction between `category` and `rationale`?
- (v1.1 only) Is the `Other — specify` pathway easy to use and appropriately triggered?
- (v1.1 only) Does the multi-observation structure increase or decrease perceived burden?
- (v1.1 only) Do evaluators find the task-phase taxonomy adequate and exhaustive?

Cognitive interview data are qualitative and inform Round 2 revisions. They do not contribute to κ computation.

### 2.7 Phase 0 outputs

1. Round 1 agreement statistics report (from DPF-RP v1.1 export)
2. Round 2 agreement statistics report (post-revision)
3. Cognitive interview summary
4. Phase 0 summary document: which fields passed, which were revised, what revision was made, and the evidence base for each revision
5. Decision: proceed to Phase 1 with the validated instrument version used in the final Phase 0 round (v1.0 or v1.1), or return to Phase 0 with a revised version

---

## 3. Phase 1 — Mechanism testing (Hypothesis H3)

### 3.1 Purpose

To test whether the ergonomic demand characterised in Field 2 is empirically associated with observable precision outcomes during actual laboratory tasks. Phase 1 is the first empirical test of the framework's central causal claim.

**Hypothesis H3:** Increasing postural and cognitive demand (Field 2) is associated with decreasing manual-precision performance (as measured by field-level precision indicators identified in Phase 0's Field 6 evaluation), controlling for task complexity and site-level factors.

**Prerequisite:** Phase 0 gate passed. Phase 1 proceeds regardless of whether DPF Instrument v1.0 or v2.0 is used, but the Field 2 and Field 6 data collection must be consistent with the version used in Phase 0.

**Feasibility:** Moderate. Phase 1 requires access to real (or realistically simulated) BSL-2 laboratory settings and measurement instruments (e.g., wearable sensors, video capture for movement analysis).

### 3.2 Study design

**Design:** Observational, cross-sectional or repeated-measures, multiple BSL-2/BSL-2+ sites.  
**Participants:** Laboratory operators performing routine recombinant viral-vector procedures (with fictional or decontaminated material for measurement purposes, per local biosafety approvals).  
**Tasks:** Three to five tasks selected from the five aligned scenarios (E1–E5), confirmed as appropriate for real-world study by local institutional biosafety officers.  
**Covariates:** Task complexity (Field 1 characterisation), site-level controls (Field 5 characterisation), operator experience.

### 3.3 Measurement

**Field 2 (ergonomic demand) — measurement method:**
- If DPF Instrument v1.0 is used: expert evaluator assessment of the task using the six-field instrument (Phase 0-validated)
- If DPF Instrument v2.0 is used: structured subscale ratings (F2_physicalDemandScore, F2_cognitiveDemandScore) supplemented by wearable sensors (EMG, IMU) where feasible

**Field 6 (precision outcomes) — candidate indicators from Phase 0:**
- Pipetting-related: per-cycle fill duration, fill-volume variance across a sequence
- Postural: sustained shoulder-elevation duration (IMU or video goniometry)
- Behavioural: self-reported fatigue VAS, verbalization rate, pause frequency
- To be confirmed by Phase 0 Field 6 evaluations

**Note:** Phase 1 tests *candidate indicators* selected from Phase 0 output. Only indicators that achieved I-CVI ≥ 0.78 in Phase 0 are included in Phase 1 measurement. Indicators flagged as "protective adaptation ambiguity" require a separate disambiguation protocol before inclusion.

### 3.4 Gate criteria

**H3 confirmed:** Statistically significant association (p < 0.05, two-tailed) between F2 demand scores and ≥ 1 precision outcome variable, after controlling for task complexity and site.

**H3 not confirmed:** No association found. This means the central causal claim of the framework is not supported. This is a **pre-specified revision trigger** — see Section 6. H3 non-confirmation does not mean Phase 2 is impossible, but it requires a formal framework revision before proceeding.

---

## 4. Phase 2 — Framework–intervention comparison (Hypothesis H4)

### 4.1 Purpose

To test whether framework-guided interventions (changes to task design, scheduling, ergonomic setup, or control strategy informed by Field 2 and Field 5 analyses) reduce observable near-misses or precision errors compared to standard practice.

**Hypothesis H4:** Laboratories that implement interventions guided by the DPF framework will show a significant reduction in precision-failure near-misses at the task level compared to matched controls using standard biosafety assessments alone.

**Prerequisite:** Phase 1 gate passed (H3 confirmed).

**Feasibility:** Moderate. Phase 2 requires a controlled comparison design, access to multiple sites, and near-miss reporting that is sufficiently granular to detect task-level events.

### 4.2 Study design

**Design:** Quasi-experimental, pre-post with matched controls (intervention sites vs. sites using standard assessment only), or randomised controlled if resources permit.  
**Intervention:** Task-level assessment using the DPF six-field instrument, followed by an ergonomic redesign consultation informed by Field 2 (demand reduction) and Field 5 (control gap closure).  
**Outcome:** Near-miss rate (per 1,000 task-hours) at the task level; precision-failure incident rate; operator-reported fatigue at task completion.  
**Duration:** Minimum 6 months post-intervention observation period.

### 4.3 Gate criteria

**H4 confirmed:** Statistically significant reduction in near-miss rate in intervention sites vs. controls.

**H4 not confirmed — process evaluation required:** Non-confirmation triggers a process evaluation to determine whether failure was due to implementation fidelity (the intervention was not delivered correctly), statistical power (underpowered study), or genuine lack of benefit (the framework does not improve outcomes). Only the third interpretation warrants framework revision. The manuscript explicitly states this distinction (Section 5.6).

---

## 5. Phase 3 — Instrument burden and usability study (Hypothesis H5)

### 5.1 Purpose

To test whether the DPF instrument can be used at scale without creating an unacceptable cognitive burden, and to determine whether a simplified version should be developed.

**Hypothesis H5:** The DPF six-field instrument can be completed with RTLX total load ≤ [pre-specified threshold, to be set based on Phase 0 RTLX data] and SUS score ≥ 68 (above average usability), such that its routine deployment does not introduce the cognitive overload it is designed to prevent (see manuscript §4.4).

**Prerequisite:** Phase 2 gate passed (H4 confirmed for at least one task type). Phase 3 is only initiated if Phase 2 demonstrates benefit — without benefit, increased burden would mean the instrument should not be recommended in its current form regardless of usability.

**Feasibility:** High (once Phase 2 is complete; data partially collected in earlier phases via RTLX/SUS in DPF-RP).

### 5.2 Study design

Use Phase 0 and Phase 2 RTLX and SUS data from DPF-RP v1.1 (and v2.0 if used) as the primary data source. Supplement with structured usability interviews.

**Primary analysis:**
- Mean RTLX total score across six subscales
- Mean SUS score per scenario per evaluator
- Distribution of `fieldDurations` (completion time proxy)
- Proportion of evaluators rating ≥ 1 field with `interpretationDifficulty` ≥ 3

### 5.3 Gate criteria

**H5 confirmed:** RTLX total load ≤ threshold AND SUS ≥ 68.  
**H5 not confirmed:** If RTLX > threshold without Phase 2 benefit being achieved, the six-field instrument in its current form should NOT be recommended for adoption. A simplified version (reduced field count, structured scales replacing narrative) should be designed and tested from Phase 0.

---

## 6. Interpretation of positive, null, and mixed results (pre-specified)

This section is pre-specified before any data collection begins. It follows the manuscript Section 5.6 directly and ensures that non-confirmatory results are not interpreted as implementation failures unless evidence supports that interpretation.

### H3 null result
*No association between F2 demand and precision outcomes.*  
**Interpretation:** The central causal claim of the framework is not supported. This is a theoretical revision trigger, not a measurement failure. Before proceeding, the research team must determine whether: (a) the candidate indicators were insufficiently sensitive (→ revise Phase 1 indicators); (b) the measured tasks did not have sufficient demand variance (→ replicate with higher-demand tasks); or (c) the mechanism is genuinely absent (→ revise or abandon the theoretical framework).

### H4 null result after H3 confirmation
*Association between demand and precision, but intervention does not reduce near-misses.*  
**Interpretation:** Process evaluation first. If fidelity is confirmed, consider: (a) the intervention was not targeted correctly (→ refine the translation from assessment to intervention); (b) near-miss rate is an insufficiently sensitive outcome (→ seek different Phase 2 outcomes); or (c) there is genuine lack of benefit despite the mechanism being present (→ revise the intervention model, not the framework).

### H5 null result after H4 confirmation
*Unacceptable burden despite Phase 2 benefit.*  
**Interpretation:** The instrument should not be recommended for adoption as-is. A simplified version must be designed (fewer fields, structured scales) and retested from Phase 0. The Phase 2 benefit finding is retained as evidence of concept validity even if the instrument form requires revision.

### Full positive result (H3 + H4 + H5 confirmed)
**Interpretation:** Proceed to DPF Instrument v3.0 development — a fully validated psychometric instrument with a Delivered Protection Profile (DPP) derived from v2.0 subscales, with normative data from Phase 1–2 samples, and a formal reliability and validity study (multi-site ICC, convergent validity with REBA/RULA, predictive validity against Phase 2 outcomes).

---

## 7. Ethical and biosafety constraints specific to this protocol

- Phase 1 and Phase 2 studies involving real laboratory tasks require institutional ethics review and institutional biosafety committee (IBC) approval at every site
- Sensor equipment (IMU, video) introduced into BSC or BSL-2+ workspace must be assessed for contamination risk and approved by the local biosafety officer before use
- Near-miss data collected in Phase 2 must be managed under appropriate confidentiality protections; individual operators must not be identifiable in any publication
- Any Phase 2 intervention at a real site must not compromise existing biosafety controls. The DPF framework is advisory — no control may be removed or reduced without IBC approval
- Phase 1 and Phase 2 must use appropriate fictional, inactivated, or authorised materials per local regulations. No live viral vector material is introduced specifically for the study

---

## 8. Pre-registration

Before data collection begins at any phase:
1. Register the study design, hypotheses, primary outcome variables, and gate criteria on an appropriate registry (e.g., OSF, ClinicalTrials.gov for any Phase 2 human subjects component)
2. File the pre-registration link in the study's DPF-RP Study metadata
3. Any deviation from the pre-registered protocol must be documented as a protocol amendment before analysis

---

## 9. References

- Landis, J.R., & Koch, G.G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159–174.
- Fleiss, J.L. (1971). Measuring nominal scale agreement among many raters. *Psychological Bulletin*, 76(5), 378–382.
- Lynn, M.R. (1986). Determination and quantification of content validity. *Nursing Research*, 35(6), 382–385.
- Polit, D.F., & Beck, C.T. (2006). The content validity index: Are you sure you know what's being reported? Critique and recommendations. *Research in Nursing & Health*, 29(5), 489–497.
- Bangor, A., Kortum, P., & Miller, J. (2009). Determining what individual SUS scores mean: Adding an adjective rating scale. *Journal of Usability Studies*, 4(3), 114–123. [SUS ≥ 68 = above average]
- Manuscript Section 5: "Proposed Empirical Validation Study" (see accompanying paper for full theoretical rationale)
