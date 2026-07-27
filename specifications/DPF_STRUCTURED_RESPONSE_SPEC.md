# DPF Structured Response Specification

> **Consolidated authority — 23 July 2026.** This is the response model for the
> single current DPF-RP instrument. Structured observations are primary,
> concise reasoning is required, and extended comments are optional. There is
> no separate narrative entry workflow.

> **Structured-primary quantitative extension — 23 July 2026.** Instrument
> v1.1 observations contain four layers: structured characterisation, five
> separate ordinal ratings, required concise `reasoningSummary`, and optional
> `extendedComments`. The additive F1-F6 catalogues and interfaces in the
> current implementation brief are normative, while every existing taxonomy
> value remains valid. Long catalogues use grouped searchable controls and
> progressive disclosure. No rating is summed or converted into a
> biological-risk, containment, approval, or safety decision.
## Provisional Taxonomies and Semi-Structured Observation Format

**Status:** Exploratory / provisional. All category lists in this
document are subject to Phase 0 validation. They are starting points,
not validated items. `Other — specify` must always be available.

**Instrument version:** DPF Instrument v1.1  
**Schema version:** 1.1  
**Taxonomy set version:** `0.1-exploratory`  
**Relationship to other specs:**
- Schema: `DPF_VARIABLE_DICTIONARY.md` Part J
- Gate conditions: `DPF_VALIDATION_PROTOCOL.md` §2
- Roadmap context: `DPF_INSTRUMENT_ROADMAP_v2.md` §5

---

## 1. Design principles

### 1.1 The observation as the unit of response

Each field response consists of one or more `BaseObservation` records
(with field-specific extensions) plus an optional overall synthesis.
The primary narrative (`narrativeAnswer`) is retained in all versions.

**An observation is not a sentence — it is a structured record:**
- what was identified (`category`)
- when in the task it applies (`taskPhases[]`)
- how important it is (`analyticalRelevance`)
- what supports it (`evidenceSources[]`)
- how certain the evaluator is (`evaluatorCertainty`)
- why it matters (`rationale`)

Multiple observations per field are expected and encouraged when the
task has distinct sub-phases or multiple relevant mechanisms.

### 1.1b Obligation rule (v1.1 mode)

When `responseMode = "structured_narrative"`:
- `observations[]` must contain **at least one** record per field, OR
- `noObservationReason` must be set to `"insufficient_information"` or `"field_not_applicable"`

An empty observations array with no reason is a **validation error**.
The platform must prevent form submission in this state.

### 1.2 Category lists as guides, not checklists

Present categories to evaluators as:

> *"Consider, where relevant, the following — you may identify additional
> items not listed. For each item included, specify the task phase, its
> analytical relevance, the evidence supporting it, your level of
> certainty, and a brief rationale."*

Do **not** present them as a mandatory checklist. Do **not** require
the evaluator to address every category. The goal is structured recall
support, not forced response.

### 1.3 `Other — specify` is a primary data source

See `DPF_VARIABLE_DICTIONARY.md` Part J for handling rules. Every
`Other — specify` entry must be stored, exported, and reviewed.
The frequency of `Other` entries per field is a primary Phase 0 output.

---

## 1.4 Canonical property names

The following names are canonical for schema, TypeScript, JSON, and CSV mappings:

- `taskPhases: TaskPhaseSelection[]`
- `evaluatorCertainty: EvaluatorCertainty`
- `unscripted_recovery_action`
- CSV: `{field}_obs_{n}_evaluator_certainty`

Each `TaskPhaseSelection` is an object with:

```json
{
  "value": "whole_task",
  "otherText": null
}
```

`otherText` is required only when `value = "other"`.

---

## 2. Shared response elements (all six fields)

### 2.1 Task phase options

```
pre_task_preparation  — before the main procedure begins
initial_phase         — early execution phase
intermediate_phase    — mid-task execution
final_phase           — late execution (including finish steps)
critical_sub_step     — a specific step identified as the key moment
transition            — movement between sub-phases, equipment, or PPE states
interruption          — any break in the procedural sequence
resumption            — return to the procedure after interruption
whole_task            — applies throughout, not phase-specific
other                 — free text required
```

### 2.2 Analytical relevance scale

```
low           — may be real but has little bearing on this field's analysis
moderate      — contributes to the analysis but not a determining factor
high          — directly relevant to the ergonomic–biological interaction
undetermined  — insufficient information to assess
```

**UI label:** "Analytical relevance within this field"
**Help text:** "This is not a biological-risk or protection score."

### 2.3 Evidence source options

```
scenario_information      — stated in the scenario description
sop_documentation         — referenced SOP or protocol
operator_interview        — would require direct operator input (not in scenario)
electronic_record         — log, timestamp, or audit trail
instrumental_measurement  — sensor, wearable, or video measurement
evaluator_inference       — reasoned from available information
insufficient_information  — key information is missing from the scenario
other                     — free text required
```

### 2.4 Certainty scale

```
high      — directly observable or documentable from scenario information
moderate  — plausible inference from available information
low       — speculative; limited supporting information
```

---

## 3. Per-field provisional taxonomies

### 3.1 Field 1 — Critical task `[Input]`

**Extension type:** `BaseObservation` (no field-specific extension in v1.1)

**Category list (provisional):**

```
single_step_operation       — one discrete action, no sub-phase structure
repetitive_sequence         — repeated identical or similar actions
multi_step_linear_sequence  — ordered steps, no branching
time_gated_procedure        — constrained by an external deadline or window
multi_window_procedure      — two or more separated contact windows (e.g., pre/post-spin)
interrupted_resumed         — one or more interruptions and resumptions within the task
ppe_state_transition        — mid-task change in PPE layer or type
material_state_transition   — change in container state, concentration, or volume
operator_handover           — change of operator mid-task
documentation_dependent     — maintenance of a linked physical–documentary record
static_observation          — sustained observation without active manipulation
post_incident_resumption    — return to a procedure following an incident-related interruption
other
```

**Sub-structure for multi_step and multi_window scenarios:**

When a multi-step or multi-window category is selected, prompt the
evaluator to describe each sub-phase briefly:

```
Sub-phase name: [text]
Actions: [text]
Material state: open / closed / not applicable
Duration: < 5 min / 5–15 min / 15–30 min / > 30 min
Critical sub-phase: yes / no
```

This is entered as one observation per sub-phase (using the task-type
category `multi_step_linear_sequence` or `multi_window_procedure`) with
different `taskPhases` values. The `rationale` field describes why this
sub-phase is or is not the critical one.

---

### 3.2 Field 2 — Physical and cognitive performance demands `[Input]`

**Extension type:** `BaseObservation` (no field-specific extension in v1.1;
structured subscales deferred to v2.0 — see Roadmap §5, Field 2)

**Physical demand categories (provisional):**

```
static_postural_load      — sustained posture without movement
repetitive_motion         — repeated joint motion (specify joint and rate)
force_demand              — grip, pinch, push, or pull force required
fine_motor_precision      — high positional accuracy required at tip/tool level
reduced_tactile_feedback  — gloves, vibration, or other attenuation
visual_demand             — sustained focus, low light, or small target
prolonged_standing        — static leg and trunk loading over extended period
cumulative_fatigue        — demand accumulates over the task duration
other_physical
```

**Cognitive demand categories (provisional):**

```
sustained_attention       — continuous vigilance without interruption
divided_attention         — simultaneous monitoring of multiple sources
prospective_memory        — remembering to perform a future action
sequential_tracking       — maintaining position in an ordered sequence
task_state_reconstruction — determining the current state after interruption
source_monitoring         — distinguishing completed from planned actions
decision_demand           — real-time judgment required without clear criterion
time_pressure             — external deadline constrains pace or completeness
irreversibility_salience  — awareness that error cannot be corrected
dual_clock_monitoring     — tracking two or more independent time constraints
organisational_demand     — competing priorities, coordination, or role ambiguity
recovery_demand           — cognitive effort of reconstructing procedural state
other_cognitive
```

**Dominant demand type (single-select primary + multi-select secondary):**

```
Primary (select one):
  physical / cognitive / perceptual / temporal / organisational /
  recovery_related / mixed / indeterminate

Secondary (select all that apply):
  [same list as primary]
```

**Point of peak demand (required when not whole_task):**

```
Phase: [taskPhases selection]
Demand category: [from list above]
Basis: [evidence source]
Coincides with material handling: yes / no / uncertain
```

---

### 3.3 Field 3 — Performance deviation and potential release pathway `[Input]`

**Extension type:** `F3Observation`

**Primary category list — performance deviation type (provisional):**

```
motor_error             — loss of grip, tremor, or imprecise tip placement
omission                — a required step or action is not performed
duplication             — a completed action is repeated (status uncertainty)
sequencing_error        — correct actions in incorrect order
identification_error    — wrong sample, tube, label, or instrument used
documentation_error     — mismatch between physical sequence and records
loss_of_resumption_point — uncertain restart location after interruption
transition_failure      — PPE change, BSC entry/exit, or handover creates gap
unscripted_recovery_action — operator attempts an action not in the SOP to compensate
other_deviation
```

**Initiating condition (provisional, multi-select):**

```
cumulative_fatigue          — accumulated physical or cognitive load
acute_interruption          — sudden demand for attention shift
time_pressure               — compression of checking or verification steps
reduced_tactile_feedback    — glove layers, vibration, or cold
reduced_visibility          — dim light, small target, condensation
sop_ambiguity               — procedure specification is incomplete or unclear
workspace_reorganisation    — change in spatial layout mid-task
ppe_change                  — mid-task alteration to PPE state
communication_failure       — information transfer error between people or systems
residual_emotional_activation — post-incident stress or concern persists
other_initiating_condition
```

**Operational outcome (provisional, multi-select):**

```
spill_or_splash             — liquid release onto work surface or operator
aerosolisation              — liquid becomes airborne within BSC or room
surface_contamination       — transfer of material to non-target surface
misidentification           — wrong sample or material handled
traceability_loss           — inability to link physical item to record
incomplete_procedure        — task ends without full completion of required steps
unplanned_repetition        — a step is repeated unnecessarily
workspace_contamination     — area around task becomes contaminated
documentation_mismatch      — records do not reflect actual sequence
other_outcome
```

**Release pathway (OPTIONAL — complete only when supported by scenario
information):**

```
aerosol / splash_droplet / percutaneous / surface_contact /
environmental / not_determinable_from_scenario
```

**Causal chain (brief structured summary):**
```
[condition or demand] → [deviation type] → [operational outcome]
```

Free text, ≤ 200 chars. Required when a release pathway is specified.

---

### 3.4 Field 4 — Critical vector / material `[Input]`

**Extension type:** `BaseObservation` (no field-specific extension in v1.1)

**Category list — material aspect being characterised (provisional):**

```
source_material_description  — type, state, container, and relevant design features
concentration_relative       — concentration at this phase relative to other task phases
volume_relative              — volume at this phase relative to other task phases
material_state_transition    — change in concentration, volume, or container state
open_vs_closed               — whether material is in an open or closed container
procedural_state_certainty   — operator's knowledge of which material was last handled
consumable_status            — whether consumables are known to be replaced or unchanged
information_sufficiency      — whether sufficient material information is available
other_material_aspect
```

**Concentration — intratask comparison (select one):**

```
lower_than_other_phases    — lower concentration than other phases of this task
unchanged                  — concentration does not change within this task
higher_than_other_phases   — higher concentration than other phases
not_comparable             — single-phase task or not determinable
```

**Do NOT use absolute thresholds** (e.g., "≥10× working titer") — these imply
agent-independent risk classifications that risk displacing the instrument
toward conventional risk assessment. Intratask comparison only.

**Volume — intratask comparison (select one):**

```
lower_than_other_phases
unchanged
higher_than_other_phases
not_comparable
```

Same rationale — intratask comparison only, no absolute volume thresholds.

**Container state (select one):**

```
open_vessel          — material accessible; manipulation in open air or under BSC
closed_sealed        — material in sealed container; no direct access
transitioning        — changing from open to closed or vice versa during this phase
variable             — container state varies across sub-phases
not_applicable
```

**Information sufficiency for this field (required):**

```
complete     — all relevant material information is available from the scenario
partial      — some key information is missing but assessment is possible
insufficient — insufficient information to characterise the material for this field
              (triggers insufficientInformation flag)
```

**What information is absent (multi-select, if partial or insufficient):**

```
concentration / volume / vector_design_features / tropism / integration_competence /
stability_over_time / inactivation_status / container_type / other
```

---

### 3.5 Field 5 — Integrated control strategy `[Modifier]`

**Extension type:** `F5Observation`

**Primary category — control layer (select one; becomes F5_controlLayer):**

```
engineering       — BSC, sealed systems, containment equipment
procedural        — SOP, defined sequence, closure, verification
administrative    — training, staffing, scheduling, communication
organisational    — workload allocation, interruption policy, supervision
ppe               — gloves, gowns, eye protection, respirators
verification      — checking, reconciliation, confirmation steps
recovery          — spill response, emergency procedures, restart protocols
task_resumption   — structured method for returning to a procedure after interruption
other
```

**Control function (multi-select; becomes F5_controlFunction):**

```
prevent_release             — engineering barrier against material escape
contain_material            — secondary containment if primary fails
reduce_contact_probability  — reduce likelihood of operator contact
maintain_sequence           — preserve correct order of procedural steps
prevent_misidentification   — ensure correct sample/material/instrument used
detect_deviations           — identify when something has gone wrong
facilitate_recovery         — enable safe and reliable return after deviation
preserve_procedural_state   — maintain knowledge of last confirmed completed step
verify_completion           — confirm that a step has been performed correctly
other
```

**Human performance dependency (select one):**

```
low       — control is effective independent of operator state
moderate  — control is partially dependent on operator attention or precision
high      — control effectiveness is primarily determined by operator performance
undetermined
```

**Gap status (select one; becomes F5_gapStatus):**

```
identified    — at least one sub-step where the control layer is absent or insufficient
not_identified — no gap found for this layer and phase
uncertain     — insufficient information to determine gap status
```

**Recovery control status (select one):**

```
exists_and_adequate     — a defined recovery pathway exists and is sufficient
exists_but_incomplete   — a pathway exists but does not cover all relevant cases
absent                  — no recovery control for this type of deviation
unknown                 — not described in the scenario
not_applicable          — no deviation requiring recovery applies to this layer
```

---

### 3.6 Field 6 — Candidate performance-degradation indicators `[Indicator]`

**Extension type:** `F6Observation`

Each observation in Field 6 represents one candidate indicator.
Use a separate observation record per indicator.

**Indicator name** (required, ≤ 100 chars): [brief label]

**Indicator type (select one):**

```
physical     — measurable physical action or output
cognitive    — measurable cognitive performance
behavioural  — observable change in strategy or checking behaviour
temporal     — measurable change in timing or duration
procedural   — deviation from or adherence to defined sequence
other        — specify
```

**Observation method (multi-select):**

```
direct_observation  — trained observer in real time
video_review        — post-hoc video analysis
instrumented        — sensor or wearable
electronic_log      — timestamp or audit trail
post_task           — gravimetric, volumetric, record-based
self_report         — evaluator or operator interview
other
```

**Expected direction:** increase / decrease / deviation / irregular_pattern / unknown

**Protective adaptation ambiguity:** yes / no / uncertain

**Rationale** (required, ≤ 500 chars): Must include the disambiguation criterion.

## 4. F1 and F4 field-specific extensions (deferred)

F1 and F4 use `BaseObservation` in v1.1. Field-specific extensions
will be defined after Phase 0 data reveal which observation properties
are systematically missing from `BaseObservation` for these fields.

Candidates for F1 extension:
- `subPhaseStructure`: array of sub-phase records (name, actions, material state, duration, critical flag)

Candidates for F4 extension:
- `materialChangeType`: none / concentration / volume / container / state / certainty
- `phaseOfMaximumMaterialRelevance`: TaskPhase selection

These will be specified in `DPF_STRUCTURED_RESPONSE_SPEC v0.2` after
Phase 0 review.

---

## 5. UI design requirements for the observation entry form

### 5.1 Add observation flow (progressive disclosure)

Each field screen has an **"Add observation"** button. The form uses
**progressive disclosure** — do not present all inputs simultaneously.

**Step 1 — Category selection**
- Show 6–8 most common categories for this field
- "Show more" expander + text search for full taxonomy
- "Other — specify" always visible
- Definitions shown on hover only, not inline

**Step 2 — Task phase** (after category selected)
- Multi-select from shared phase list; store each selection as a `TaskPhaseSelection` object
- "Whole task" as quick-select default

**Step 3 — Field-specific extensions** (F3, F5, F6 only; collapsed by default)
- Expand on tap/click

**Step 4 — Relevance / evidence / certainty** (one compact screen)
- Radio buttons or segmented controls

**Step 5 — Rationale** (required last step)
- Text area ≤ 500 chars with live counter
- F6 prompt: "Describe what distinguishes degradation from protective adaptation"

**Save** → returns to field screen with summary card per observation.
Maximum 8 categories visible in step 1; rest under expander.

### 5.2 Observation summary card

Each saved observation should display:

```
[Category] · [Phase(s)] · Relevance: [level] · Certainty: [level]
[First 100 chars of rationale...]  [Edit] [Delete]
```

### 5.3 Overall synthesis

Below the observation list, an optional text area:

> **Overall field synthesis** (optional, ≤ 200 words)
> Summarise your observations for this field as a whole. Complement
> rather than repeat the individual observation rationales.

### 5.4 Narrative answer placement

`narrativeAnswer` is retained as the primary response. In v1.1 it
should be positioned above the observation list with the label:

> **Narrative response** (required in v1.0; supplemented by structured
> observations in v1.1)

### 5.5 Minimum viable implementation

If full observation entry forms cannot be delivered in the first v1.1
release, the minimum viable implementation is:

1. Category multi-select (from field taxonomy) alongside the narrative field
2. `Other — specify` text alongside category "Other"
3. Store selections in `observations` with:
   - `category` from selection
   - `analyticalRelevance` = null (not collected at minimum)
   - `taskPhases` = [{ "value": "whole_task" }] (default)
   - `evidenceSources` = ["evaluator_inference"] (default)
   - `evaluatorCertainty` = null (not collected at minimum)
   - `rationale` = "" (not collected at minimum)

This captures frequency data for category validation without full
observation records. It is not the target state — it is the fallback
if the full form creates unacceptable time burden.

---

## 6. Export requirements for structured observations

### 6.1 JSON export

Each `FieldResponse` in the evaluation session JSON must include:

```json
{
  "fieldId": "F2",
  "narrativeAnswer": "...",
  "responseMode": "structured_narrative",
  "observations": [
    {
      "id": "uuid",
      "fieldId": "F2",
      "category": "prospective_memory",
      "isOtherCategory": false,
      "taskPhases": [
        { "value": "resumption" },
        { "value": "final_phase" }
      ],
      "analyticalRelevance": "high",
      "evidenceSources": ["scenario_information", "evaluator_inference"],
      "evaluatorCertainty": "moderate",
      "rationale": "The operator must reconstruct the last completed aliquot after interruption; this requires prospective memory for the planned but potentially uncompleted action.",
      "createdAt": "2025-01-22T10:00:00Z"
    }
  ],
  "overallSynthesis": "..."
}
```

### 6.2 CSV export columns

For each field and each observation slot (n = 1, 2, 3, …):

```
{field}_obs_{n}_category
{field}_obs_{n}_is_other
{field}_obs_{n}_other_text
{field}_obs_{n}_phase_1 ... {field}_obs_{n}_phase_k
{field}_obs_{n}_relevance
{field}_obs_{n}_evaluator_certainty
{field}_obs_{n}_evidence_1 ... {field}_obs_{n}_evidence_k
{field}_obs_{n}_rationale
```

Plus field-level summaries:
```
{field}_obs_count
{field}_has_other_category
{field}_overall_synthesis
```

### 6.3 Taxonomy version in every export

Every exported file must include:

```json
{
  "dataSchemaVersion": "1.1",
  "instrumentVersion": "1.1.0",
  "structuredItemSetVersion": "0.1-exploratory"
}
```

This enables future analyses to identify which taxonomy version was
active when data were collected, which is essential if taxonomy changes
are made between rounds.
