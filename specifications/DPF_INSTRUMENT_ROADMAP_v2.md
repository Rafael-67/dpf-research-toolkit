# DPF Instrument Roadmap v2.0

> **Historical roadmap notice — 23 July 2026.** Structured observations, local
> profiles, assignments, consensus records, audit and non-interpretive
> statistics are current-platform capabilities. Future scope is limited to
> backend authentication, cloud/server/API services, central databases and
> distributed collaboration. Earlier narrative-to-structured staging below is
> superseded.
## Planned Evolution — Design Document

**Status:** Design specification for a future version. No implementation until Phase 0 validation is complete and results confirm which dimensions merit structured scaling.  
**Prerequisite:** All items in DPF Instrument v1.0 validation must be complete before v2.0 implementation begins. See `DPF_VALIDATION_PROTOCOL.md` for gate criteria.  
**Instrument version:** 2.0 (planned)  
**Implemented by:** DPF-RP v2.0 (future platform version)

---

## 1. Why v2.0

### 1.1 The reliability problem with narrative text

DPF Instrument v1.0 collects narrative text as the primary response to each field. Narrative responses are rich and flexible but produce low inter-rater agreement for reasons of *form rather than substance*: two evaluators may identify the same ergonomic demand using different vocabulary, producing different text that κ cannot recognise as agreement.

The per-field evaluator ratings (relevance, clarity, exhaustiveness) in v1.0 are ordinal and will produce κ values. But the substantive characterisation of the task — the field response itself — remains unquantified. This limits:
- the precision of Phase 0 content-validity analysis
- the data available for Phase 1 mechanism testing
- the statistical power achievable with a given panel size

### 1.2 The completion-time problem

Expert evaluator time is the primary resource constraint in any Phase 0 panel study. Narrative-based evaluation of a single scenario takes approximately 30–45 minutes per evaluator. Structured scales can reduce this to 8–12 minutes without losing the conceptual precision of the six-field structure. A 70–80% reduction in completion time, with equivalent or superior reliability, is the primary design goal of v2.0.

### 1.3 The data exploitability problem

Narrative text cannot be directly subjected to:
- distribution analysis across evaluators or scenarios
- principal component analysis across fields
- clustering of scenario types by demand profile
- predictive modelling linking field scores to instrument-burden outcomes

Ordinal variables from structured scales can. v2.0 is designed to produce a dataset that supports all of these analyses without changing the conceptual framework.

---

## 2. What changes

### 2.1 The measurement model changes; the framework does not

The six fields remain unchanged. The categories within each field remain unchanged. What changes is *how evaluators encode their observations*: from unstructured narrative to structured scales plus optional comment. This is a change to the measurement model, not to the theory.

This distinction matters for the manuscript: the six-field framework described in Section 2.3 is the same in v1.0 and v2.0. The paper does not need to be updated to accommodate v2.0.

### 2.2 Changes that require their own validation

Because v2.0 introduces ordinal scales, the following require fresh validation before the instrument is considered ready for Phase 1 use:
- Scale anchors must be tested for interpretability (cognitive interview round)
- ICC must be computed (v2 produces interval/ordinal data → ICC(2,k) appropriate)
- New content-validity analysis must be run for the structured items themselves
- Scale ranges must be justified against reference instruments (REBA, RULA for physical demand; existing NASA-TLX subscale structure for cognitive demand)

v2.0 is not a replacement for v1.0 — it is a new instrument version that requires its own Phase 0 before Phase 1 begins.

---

## 3. What stays qualitative

The following are never converted to scales, regardless of Phase 0 results:

| Element | Reason |
|---|---|
| Field 1 (critical task): narrative description | Cannot be coded without losing the task specificity that is the instrument's primary contribution |
| Field 3 (biological release consequence): narrative | Converting consequence severity to a score would produce a biological risk score — prohibited |
| Field 5 (control strategy): gap identification narrative | The absence of a control at a specific sub-step is a qualitative finding, not a score |
| Field 6 (candidate indicators): narrative and candidate list | Scaling indicators before Phase 1 validation is premature operationalisation |
| All open-comment fields | Qualitative data is always retained alongside structured data |
| Evaluator meta-commentary on field clarity | These are ratings of the instrument, not of the task |

---

## 4. What is NEVER automated (v1.0, v2.0, and beyond)

These prohibitions apply to all future versions of the instrument and platform:

- Biological risk score
- BSL assignment or recommendation
- Residual risk estimate
- Traffic-light risk classification
- Operational approval
- Regulatory compliance decision
- AI-generated safety recommendations
- Automatic validation claims

The instrument produces a *characterisation profile*, not a *risk level*. This must remain true regardless of how many structured variables are added.

---

## 5. Field-by-field changes in v2.0

### Field 1 — Critical task

**v1.0:** narrative text only  
**v2.0 addition:** structured task-type tags (multi-select):

```
Task type (select all that apply):
☐ Pipetting / liquid transfer
☐ Centrifugation / rotor handling
☐ Cell culture handling
☐ Microscopy / imaging
☐ Sample preparation / aliquoting
☐ Decontamination / waste handling
☐ Equipment loading / unloading
☐ Other: [text]

Sub-phase structure:
○ Single uniform phase
○ Multiple phases with different demand profiles (describe in narrative)

Duration:
○ < 15 min   ○ 15–30 min   ○ 30–60 min   ○ > 60 min

Session continuity:
○ Interruptible   ○ Non-interruptible (SOP constraint)
```

Narrative retained as optional: *"Additional description of the operation as actually performed."*

---

### Field 2 — Physical and cognitive performance demands

This is the field with the highest v2.0 improvement potential. Replace narrative with ordinal subscales plus optional comment.

**Physical demand subscales (each 0–3):**

| Subscale | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Postural load | Neutral throughout | Mild deviation | Sustained deviation | Severely forced |
| Repetitive load | Non-repetitive | Occasional (<2/min) | Frequent (2–10/min) | Continuous (>10/min) |
| Force demand | Negligible | Low | Moderate | High |
| Precision demand | Gross motor | Moderate | Fine motor | Micrometric |
| Tactile / proprioceptive demand | Full feedback | Mild attenuation | Moderate attenuation (e.g., single glove) | Severe attenuation (e.g., double glove + time) |

**Cognitive demand subscales (each 0–3):**

| Subscale | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Attentional demand | Low, routine | Moderate | High, sustained | Very high / continuous vigilance |
| Sequential complexity | Single step | Few steps, fixed order | Multi-step, fixed order | Multi-step, variable or time-constrained |
| Dual-task demand | Single task | Two concurrent tasks | Three or more concurrent tasks | — |
| Irreversibility / time pressure | Reversible, no deadline | Reversible with deadline | Irreversible, flexible timeline | Irreversible, hard deadline |

**Physical demand domain score:** sum of five subscales (0–15). Display as raw profile, not single composite.  
**Cognitive demand domain score:** sum of four subscales (0–12). Same.  

**Constraint:** domain scores are descriptive statistics of evaluator ratings. They are not biological risk indicators. The platform must never label them "risk score," "severity score," or equivalent.

Optional comment: *"Additional notes on demand profile."*

---

### Field 3 — Biological hazard / release consequence

**v2.0 change:** Limited structured addition. The constraint against biological risk scoring means this field changes less than the others in v2.0.

**Exposure route (multi-select, retained from v1.0):**
☐ Aerosol / ☐ Splash / ☐ Percutaneous / ☐ Surface contact / ☐ Environmental

**Release scenario type (select all that apply):**
☐ Motor-control error / ☐ Omission / ☐ Sequencing error / ☐ Identification error / ☐ Equipment failure

**Ergonomic-context severity (0–3):**  
*"How much does the ergonomic demand at this step increase the plausibility of the described release scenario?"*
- 0 = No link (the demand does not plausibly affect this release pathway)
- 1 = Weak link (demand could marginally increase probability)
- 2 = Moderate link (demand is a plausible contributing factor)
- 3 = Strong link (demand is central to the release pathway at this step)

**NOTE:** The `ergonomic-context severity` rating is NOT a biological risk rating. It rates the *ergonomic contribution* to the plausibility of a specific release scenario. It cannot be combined with Field 4 material characteristics to produce a risk score. This constraint must be enforced at display and export level.

Narrative retained as required: *"Describe the release scenario, mechanism, and exposure route."*

---

### Field 4 — Critical vector / material

**v2.0 change:** Convert the optional structured subfields to required categorical fields.

**Agent classification (required):**
```
Agent type:
○ Lentiviral vector   ○ AAV   ○ Adenoviral vector
○ Other viral vector  ○ Non-viral (specify)

Generation / design (if viral):
○ 3rd generation (self-inactivating)   ○ 2nd generation
○ 1st generation                        ○ Non-specified / other

Pseudotype (if applicable):
○ VSV-G   ○ Other: [text]   ○ Not applicable

Integration competence:
○ Integrating (retroviral)   ○ Non-integrating (AAV, adenoviral)   ○ Unknown

Transgene oncogenic potential:
○ None   ○ Low   ○ Moderate   ○ High / unknown (conservative)
```

**Concentration at critical step (ordinal):**
- 0 = Low (below standard working titer)
- 1 = Standard working concentration
- 2 = High (concentrated, ≥10× working titer)
- 3 = Very high (concentrated batch output, ≥100× working titer)

**Volume at critical step (ordinal):**
- 0 = Micro (< 10 µL)
- 1 = Low (10–200 µL)
- 2 = Moderate (200 µL – 1 mL)
- 3 = High (> 1 mL)

**Constraint:** concentration and volume ratings describe the material at the critical step. They do not produce a risk score when combined. Any feature that would multiply or combine these ratings to produce a risk index is prohibited.

Narrative retained as optional: *"Additional material characterisation."*

---

### Field 5 — Integrated control strategy

**v2.0 change:** Formalize the checklist (already optional in v1.0) as the primary structured input. Add gap identification as a required structured element.

**Control presence (multi-select, required):**

Engineering:
☐ Class II BSC / ☐ Class III cabinet / ☐ Sealed system / ☐ Closed containment / ☐ Secondary containment / ☐ HEPA filtration / ☐ Centrifuge containment / ☐ Other: [text]

Administrative:
☐ Validated SOP / ☐ Trained operator / ☐ Buddy system / ☐ Operator rotation / ☐ Scheduled pause / ☐ IBC oversight / ☐ Other: [text]

PPE:
☐ Single gloves / ☐ Double gloves / ☐ Respirator / ☐ Eye protection / ☐ Gown / ☐ Face shield / ☐ Other: [text]

Recovery:
☐ Spill kit / ☐ Emergency SOP / ☐ Decontamination protocol / ☐ Incident reporting / ☐ Other: [text]

**Gap identification (required structured element):**
```
Is there at least one sub-step where no engineering control addresses
the precision-failure release pathway?
○ Yes   ○ No   ○ Uncertain

If yes — describe the gap: [required text, ≤ 500 characters]
```

**Control robustness domain score (0–12):**  
Based on presence of controls across four layers (engineering, administrative, PPE, recovery), 0–3 per layer based on evaluator rating of layer completeness. Defined anchors in DPF Variable Dictionary. Not a risk score — a completeness characterisation.

Optional comment retained.

---

### Field 6 — Candidate performance-degradation indicators

**v2.0 — partially structured, conditioned on Phase 0 results.**

**Condition:** The specific indicators scaled in v2.0 must be selected based on Phase 0 findings. Only indicators that (a) achieved sufficient content-validity index (I-CVI ≥ 0.78) in Phase 0 and (b) showed reasonable consensus across evaluators should be promoted to structured scales in v2.0. Indicators that evaluators consistently marked as "protective adaptation ambiguity" should remain narrative only.

**Indicative structure (subject to Phase 0 selection):**

For each candidate indicator identified in Phase 0:
```
[Indicator name, e.g., "Per-task duration relative to baseline"]
Type: ○ Physical   ○ Cognitive   ○ Behavioural   ○ Temporal
Plausibility: 0 (no link) → 3 (strong link to this task's demand profile)
Observability: ○ Direct   ○ Video   ○ Instrumented   ○ Post-task
Ambiguity risk: ○ Low (clear signal)   ○ Moderate   ○ High (confounded with protective adaptation)
```

**Performance state domain score (0–12):** sum of plausibility ratings for up to four selected indicators. Subject to Phase 0 gate — this score may not exist if Phase 0 does not confirm sufficient indicators.

Narrative retained as required: *"Propose any candidate indicators not covered by the structured list above."*

---

## 6. The Delivered Protection Profile

v2.0 produces a **multi-domain profile**, not a single score. The profile has four components:

| Domain | Variables | Maximum | Caution |
|---|---|---|---|
| Physical demand | F2 physical subscales (sum) | 15 | Not a risk score |
| Cognitive demand | F2 cognitive subscales (sum) | 12 | Not a risk score |
| Control robustness | F5 layer completeness (sum) | 12 | Not a completeness certificate |
| Performance state | F6 indicator plausibility (sum) | 12 | Subject to Phase 0 gate |

**Display format:**
```
Physical demand     ████████░░   8/15
Cognitive demand    █████░░░░░   5/12
Control robustness  ██████████  10/12
Performance state   ███░░░░░░░   3/12
```

**Prohibited labels for this display:**
- "Risk level"
- "Safety score"
- "Delivered Protection score"
- Any single composite number combining the four domains
- Any traffic-light colour system

**Permitted labels:**
- "Demand profile"
- "Characterisation profile"
- "Evaluator consensus profile"

---

## 7. Statistical implications of v2.0

The shift from narrative to ordinal scales changes the appropriate agreement statistics:

| Statistic | v1.0 | v2.0 |
|---|---|---|
| Cohen's κ | Rating variables (relevance, clarity…) | Rating variables + new subscale items |
| Fleiss' κ | Same | Same |
| ICC(2,k) | Not applicable (no continuous data) | Domain scores, subscale scores |
| I-CVI / S-CVI | Per-field ratings | Per-item ratings for new structured variables |

v2.0 should be validated with a separate Phase 0 pass before Phase 1 use. The v1.0 Phase 0 validates the fields; the v2.0 Phase 0 validates the structured items within those fields.

---

## 8. Implementation gate

v2.0 implementation begins only when ALL of the following are confirmed:

1. Phase 0 with v1.0 is complete (minimum one full panel round, locked)
2. κ ≥ 0.60 achieved for at least four of six fields on at least one rating dimension
3. Field-level I-CVI analysis identifies which sub-dimensions merit structured scaling
4. Field 6 Phase 1 mechanism study has identified which candidate indicators have empirical support
5. Research team has confirmed the v2.0 structured items against the Variable Dictionary
6. A new Phase 0 with v2.0 is planned and resourced

**Codex must not implement v2.0 features in v1.0 or v1.1.** The platform version DPF-RP v1.1 implements DPF Instrument v1.0 exclusively. Any v2.0 feature introduced before the above gate is cleared would compromise the validity of the Phase 0 data being collected with v1.0.
