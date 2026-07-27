# DPF Instrument Specification v1.0

> **Historical import specification only — 23 July 2026.** This document now
> defines compatibility for previously collected narrative records. It does
> not define a current data-entry workflow. New evaluations use the single
> structured hybrid instrument.

> **Version distinction — 23 July 2026.** DPF Instrument v1.0 remains
> narrative-primary and unchanged. DPF Instrument v1.1 is a
> structured-primary hybrid: structured selections and independent ordinal
> ratings are the principal analysable data, a concise reasoning summary is
> required, and extended comments are optional. Both run in DPF-RP v1.1 with
> study/round version locking and without silent pooling across versions.
## Delivered Protection Framework — Instrument Specification

**Status:** Narrative response model. Implemented in DPF-RP v1.1.  
**Scope:** This document specifies DPF Instrument v1.0 exclusively. The semi-structured observation model (DPF Instrument v1.1) is specified in `DPF_INSTRUMENT_SPEC_v1_1.md`. Platform DPF-RP v1.1 can operate either instrument version depending on the study configuration.  
**Relationship to platform:** DPF Instrument v1.0 is the measurement model implemented by DPF-RP v1.1. Instrument versioning and platform versioning are independent: a platform update that does not change the measurement model does not change the instrument version number.  
**Relationship to manuscript:** This instrument is the operational implementation of the six-field matrix described in Section 2.3 of the accompanying manuscript. It is designed exclusively to support Phase 0 content-validation and reliability studies as described in Section 5.1.1.

---

## 1. Instrument identity

**Full name:** Delivered Protection Framework Instrument  
**Short name:** DPF Instrument  
**Version:** 1.0  
**Framework version:** 0.1.0-draft  
**Instrument type:** Structured expert-panel evaluation instrument  
**Measurement target:** Ergonomic–biological interaction at the task level in BSL-2/BSL-2+ recombinant viral-vector laboratory work  
**Validation phase:** Phase 0 (content validation, usability assessment, inter-rater reliability)

---

## 2. What the instrument does

The DPF Instrument v1.0 provides a standardised structure for expert evaluators to record their analysis of a laboratory task across six conceptually distinct fields. It:

- presents fictional task scenarios to trained evaluators;
- guides evaluators through a sequential six-field narrative-based response;
- captures evaluator confidence, uncertainty, and meta-commentary on each field;
- records instrument-burden data (Raw Task Load Index, System Usability Scale);
- exports pseudonymised evaluation data for offline analysis;
- enables computation of inter-rater agreement statistics (Cohen's κ, Fleiss' κ, percent agreement) across evaluator panels.

The instrument captures *how expert evaluators characterise a task* using the six-field structure. It does not interpret those characterisations, compute a score, or produce a recommendation.

---

## 3. What the instrument does NOT do

The following are prohibited regardless of how the instrument is used or how its outputs are interpreted:

- Calculate biological risk or estimate biological hazard level
- Assign a biosafety level (BSL) to any task, agent, or procedure
- Compute a residual risk score
- Generate containment-level recommendations
- Produce operational safety decisions or approvals
- Claim to replace institutional biosafety assessments
- Claim to be a validated measurement instrument (Phase 0 status)

These prohibitions must be enforced at the platform level (user interface, export files, documentation) and must never be overridden by any downstream analysis or display feature.

---

## 4. The six fields

### Instrument-level principles

All six fields apply to a **single, specific task** as actually performed — not to a procedure category or class of work. The evaluator is instructed to describe what they observe or would observe, not what a protocol specifies should happen. Each field has a defined *category role* within the framework: Fields 1–4 are **inputs** (characterising the task and its context); Field 5 is a **modifier** (characterising the control response); Field 6 is an **indicator** (proposing observable precursors).

---

### Field 1 — Critical task `[Input]`

**Prompt text:**  
*"Describe the operation as it is actually performed, not the procedure category it belongs to. Where relevant, consider the following: distinct sub-phases with different demand profiles; interruptions or resumptions that alter how the procedure is executed; transitions between PPE states; changes in task ownership; and any other aspect of actual execution that may be relevant to the analysis. You are not limited to these dimensions — include any that apply."*

**Response format v1.0:** Narrative text (primary). No structured scales.  
**Required:** Yes.  
**Notes:** This field is foundational — all other fields reference the task as described here. Evaluators are explicitly instructed to avoid category labels (e.g., "pipetting") and to describe the actual motion sequence, duration, and physical context.

---

### Field 2 — Physical and cognitive performance demands `[Input]`

**Prompt text:**  
*"Consider, where relevant, the following dimensions of performance demand — you may identify additional dimensions not listed here. For each dimension included, specify the task phase, the nature and intensity of the demand, and the basis for your assessment. Prioritise the point in the task where demand is highest, not an average across the whole task.

Dimensions to consider: postural and static loading; repetitive load; force demand; precision and fine-motor control; tactile and proprioceptive demand; visual demand; attentional and cognitive demand; temporal and organisational demand; other."*

**Response format v1.0:** Narrative text (primary). No structured scales.  
**Required:** Yes.  
**Demand categories to address:** postural load, repetitive load, force demand, precision demand, attentional demand, tactile/proprioceptive demand, cognitive complexity.  
**Notes:** Evaluators must identify whether the dominant demand is physical or cognitive. This distinction has direct implications for Field 5 control strategy and Field 6 indicator type. Evaluators should identify the **temporal peak** of demand, not the average.

---

### Field 3 — Performance deviation and potential release pathway `[Input]`

**Prompt text:**  
*"Describe the material that could be released or transferred following a performance deviation; the release mechanism; and the plausible exposure route. Consider motor-control errors, omissions, sequencing errors, and misidentification — not only loss of motor control."*

**Response format v1.0:** Narrative text (primary). Exposure-route checklist (secondary, optional):  
- ☐ Aerosol  
- ☐ Splash / droplet  
- ☐ Percutaneous  
- ☐ Surface contact / transfer  
- ☐ Environmental (ambient)  

**Required:** Yes.  
**CRITICAL CONSTRAINT:** Field 3 describes the *context of potential exposure* — it does not score or rate the biological risk of the agent. Evaluators describe what could be released, how, and via which route. They do not assign a severity rating to the agent. The exposure-route checklist captures the pathway, not a risk level. Any feature that would convert Field 3 responses into a biological risk score is prohibited in v1.0 and is deferred to a separate, future assessment model.

---

### Field 4 — Critical vector / material `[Input]`

**Prompt text:**  
*"Describe the specific agent and, where relevant, its titer, concentration, volume, and design characteristics that affect the consequence of exposure — including vector design (integration competence, pseudotype, tropism). Agent identity alone is insufficient."*

**Response format v1.0:** Narrative text (primary). Optional structured fields:  
- Agent type: [free text or dropdown: lentiviral / AAV / adenoviral / other]  
- Titer/concentration: [free text, e.g., "fictional ~10¹² vg/mL"]  
- Volume at critical step: [free text]  
- Pseudotype / tropism (if applicable): [free text]  

**Required:** Yes.  
**Notes:** The structured subfields are optional metadata that improve downstream analysis. The narrative remains the primary response.

---

### Field 5 — Integrated control strategy `[Modifier]`

**Prompt text:**  
*"Describe the layered response across elimination/substitution, engineering, procedural, organisational, and PPE controls, together with recovery and emergency measures. For each layer, note its specific failure mode — what it does NOT prevent and under what conditions it fails."*

**Response format v1.0:** Narrative text (primary). Optional control-presence checklist (secondary):

**Engineering controls:**  
☐ Class II BSC / ☐ Class III cabinet / ☐ Sealed centrifuge rotor / ☐ Closed-system handling / ☐ Secondary containment / ☐ Other: [text]

**Administrative / procedural controls:**  
☐ SOP in use / ☐ Trained operator / ☐ Buddy system / ☐ Operator rotation / ☐ Scheduled pause / ☐ Other: [text]

**PPE:**  
☐ Single gloves / ☐ Double gloves / ☐ Respirator / ☐ Eye protection / ☐ Gown / ☐ Other: [text]

**Recovery controls:**  
☐ Spill kit available / ☐ Emergency SOP / ☐ Decontamination protocol / ☐ Other: [text]

**Required:** Yes.  
**Notes:** The gap identification is mandatory in the narrative — evaluators must identify at least one step where no engineering control addresses the precision-failure release pathway. The checklist captures presence; the narrative captures function and failure mode.

---

### Field 6 — Candidate performance-degradation indicators `[Indicator]`

**Prompt text:**  
*"Propose observable precursors that precede, rather than record, a performance incident. For each candidate, specify what observable measurement or criterion would distinguish a degradation signal from a protective adaptation. These are candidates to be validated, not confirmed indicators."*

**Response format v1.0:** Narrative text (primary). Optional candidate list with observability tag:

For each candidate indicator, the evaluator records:
- Indicator description: [text]
- Type: ☐ Physical / ☐ Cognitive / ☐ Behavioural / ☐ Temporal
- Observability: ☐ Direct observation / ☐ Video review / ☐ Instrumented measurement / ☐ Post-task measurement
- Ambiguity note: ☐ Could be protective adaptation (specify)

**Required:** Yes.  
**CRITICAL CONSTRAINT:** Field 6 indicators are candidates proposed by evaluators during Phase 0. They are explicitly NOT validated, NOT confirmed, and NOT to be treated as established degradation signals. No scoring, weighting, or aggregation of Field 6 responses is permitted in v1.0. Evaluators propose; Phase 1 tests.

---

## 5. Cross-field evaluator ratings

After completing each field, the evaluator rates the **field itself** (not their answer) on four dimensions. These ratings are the primary input to κ statistics and content-validity analysis:

| Rating variable | Scale | What it measures |
|---|---|---|
| `relevance` | 1–4 | Is this field relevant to assessing the described task? |
| `clarity` | 1–4 | Is the field prompt clear and unambiguous? |
| `exhaustiveness` | 1–4 | Does the field capture all important aspects of this domain? |
| `interpretationDifficulty` | 1–4 | How difficult was this field to interpret and complete? |

Additional per-field metadata:
- `confidenceRating` (1–4): evaluator's confidence in their own response
- `insufficientInformation` (boolean): if true, this field response is excluded from κ computation
- `openComment` (text): notes on the field
- `changeProposal` (text): proposed revision to the field prompt or structure

Scale anchors (all four-point scales):
- 1 = Not at all / Very low / Very unclear / Not difficult
- 2 = Slightly / Low / Somewhat unclear / Slightly difficult
- 3 = Moderately / Moderate / Mostly clear / Moderately difficult
- 4 = Highly / High / Very clear / Very difficult

---

## 6. Scenario format

Each evaluation is conducted on a **fictional task scenario**. Scenarios must never contain real agent names, real institutional identifiers, real protocol numbers, or any information traceable to an actual laboratory. Each scenario must include:

| Field | Description |
|---|---|
| `title` | Short descriptive label (e.g., "E2: Lentiviral vector concentration by ultracentrifugation") |
| `taskDescription` | What the operator does, step by step |
| `operatingConditions` | Posture, duration, environment, PPE worn |
| `availableInformation` | What SOPs, certifications, or assessments are on file |
| `vectorMaterialDescription` | The biological material involved (fictional) |
| `volumeOrConcentration` | Quantity at the critical step (fictional) |
| `existingControls` | Controls in place before the evaluator's assessment |
| `contextualConstraints` | Scheduling, staffing, or organisational constraints |
| `intendedEvaluatorGroup` | Target evaluator background |

The five aligned demonstration scenarios (E1–E5) are fully specified in Supplementary Material S1 (condensed) and, for E2–E4, in Supplementary Material S2 (narrative).

---

## 7. Closing survey (per evaluation session)

After completing all six fields, the evaluator completes:

**Raw Task Load Index (RTLX):** six subscales, 0–100 each, standard published wording verbatim (no lab adaptation):
- Mental demand / Physical demand / Temporal demand / Performance / Effort / Frustration

**System Usability Scale (SUS):** ten items, 1–5 Likert, standard published wording verbatim. Note: SUS is administered per scenario in v1.0, which is a non-standard use of the instrument (SUS was designed as a single end-of-experience measure). This limitation must be visible to evaluators via an in-app notice and reported in any publication using these data.

**Open feedback:** three text fields:
- Perceived burden: overall experience of completing the instrument
- Main ambiguity: the most unclear aspect encountered
- Perceived usefulness: whether the instrument surfaced information not otherwise captured

**Fictional scenario confirmation:** evaluator confirms they understood the scenario as fictional before the session data is exported.

---

## 8. Inter-rater agreement statistics (v1.0 scope)

Agreement is computed on the **per-field evaluator ratings** (relevance, clarity, exhaustiveness, interpretationDifficulty, confidenceRating) — not on narrative text. Free-text narrative responses are not directly amenable to κ computation: two evaluators who describe the same ergonomic demand using different vocabulary produce no comparable categorical variable over which κ can be defined. Narrative agreement can only be estimated after responses have been independently coded into common categories or units of meaning by the research team. In v1.1, the structured observation layer (see `DPF_VARIABLE_DICTIONARY.md` Part J) provides directly comparable categorical variables per field, enabling item-level frequency and agreement analysis without requiring post-hoc coding of free text.

**Cohen's κ:** pairwise, for any two-evaluator comparison, per rating variable per field.  
**Fleiss' κ:** panel-wide, for panels of three or more evaluators, per rating variable per field.  
**Percent agreement:** reported alongside κ as a descriptive statistic.

**Unit of analysis:** one κ value per rating variable per field per round. A six-field round with five rating variables produces 30 κ values, not one.

**Pre-registered acceptance threshold:** κ ≥ 0.60 ("substantial agreement", Landis & Koch, 1977). This threshold is a research-protocol decision, not a software decision. The platform displays κ values with their Landis & Koch interpretive band label; it does not apply the threshold automatically or convert κ values into accept/reject decisions.

**Exclusion rule:** sessions with `insufficientInformation: true` for a given field are excluded from that field's κ computation. Sessions with `evaluationStatus ≠ "completed"` are excluded entirely.

**Correctness gate:** both Cohen's κ and Fleiss' κ implementations must reproduce the published worked examples exactly before being considered correct (Landis & Koch, 1977; Fleiss, 1971). See `specifications/implementation-plan.md §4`.

---

## 9. Data model summary

Full data model defined in `specifications/phase-b-design.md §2`. Key entities:

- `Study` → `Round` → `RoundScenario` → `Scenario` (configuration, managed by Administrator)
- `EvaluationSession` → `FieldResponse[6]` (evaluation data, captured by Evaluator)
- `FrameworkChangeLogEntry` (audit trail for framework revisions)

All data stored in `localStorage` (key prefix `dpft:`). No server transmission. No telemetry. Export/import via JSON files shared out-of-band.

---

## 10. Relationship to DPF Instrument v2.0

DPF Instrument v1.0 must be fully validated before v2.0 development begins. Specifically:
- Phase 0 must confirm which fields and sub-dimensions have sufficient inter-evaluator reliability (κ ≥ 0.60) to merit structured scaling
- Field 6 (candidate indicators) must not be converted to ordinal scales until Phase 1 has identified which indicators are empirically associated with performance changes
- Field 3 (biological release consequence) must remain narrative-only in v1.0 to avoid any feature that could be interpreted as biological risk scoring

The semi-structured observation model is specified in `DPF_INSTRUMENT_SPEC_v1_1.md`. See `DPF_INSTRUMENT_ROADMAP_v2.md` for the planned v2.0 evolution.
