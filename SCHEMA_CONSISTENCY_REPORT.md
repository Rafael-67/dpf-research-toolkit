# DPF-RP v1.1 structured-quantitative schema consistency report

> **Consolidated interpretation — 23 July 2026.** The schema below is the
> single current instrument model. Statements about preserving v1.0 refer only
> to importing/exporting historical records, not to retaining a separate
> evaluation interface.

**Date:** 23 July 2026

## Result

No unresolved scientific conflict remains. The implementation brief is an
additive elaboration of Instrument v1.1. Instrument v1.0 remains
narrative-primary and unchanged. Instrument v1.1 is structured-primary with a
required concise `reasoningSummary` and optional `extendedComments`. Existing
F1-F6 values are retained and new catalogues extend them. The five observation
ratings remain analytically separate and are never summed or interpreted as a
biological-risk, containment, approval, or safety classification.

New records use data schema `1.2`; existing schema `1.0` and `1.1` records
remain readable. The taxonomy remains visibly `0.1-exploratory`.

## Scope boundary

Instrument v1.1 contains individual structured F1-F6 observations, candidate
taxonomies, independent ordinal ratings, concise reasoning, optional extended
comments, multiple observations, field summaries, taxonomy-item validation
ratings, versioned JSON, normalised CSV and validation-ready raw datasets.

The following are reserved for the future v2 platform and are not part of this
implementation: user roles; centralised/cloud study management; multicentre
coordination; evaluator assignment; formal consensus workflows; discrepancy
resolution; longitudinal dashboards; institutional taxonomies; predictive
models; automatic statistical interpretation; and automatic risk, containment,
approval or safety decisions.

All F1-F6 option lists are candidate, versioned, revisable taxonomies for
validation. They are not validated classifications.

## Taxonomy inventory and terminology classification

The complete machine-readable inventory is the union exported by
`structuredTaxonomy.ts`: `fieldTaxonomies`, `taskPhases`, `evidenceSources`,
and every group under `structuredCatalogues.F1` through `.F6`. This report
incorporates every value in those arrays by reference and records the following
non-destructive terminology audit:

### Exact duplicates

- Values repeated verbatim across a legacy primary taxonomy and an expanded
  catalogue (for example `omission`, `other`, `engineering`, `procedural`,
  `administrative`, `organisational`, `ppe`, and `recovery`) are stored once
  per catalogue by set union. This does not change any original stored value.

### Likely aliases — both preserved

- `sop_documentation` / `procedure_or_sop`
- `instrumental_measurement` / `measurement_or_instrument`
- `operator_interview` / `operator_report`
- `contain` / `contain_material`
- `reduce_contact` / `reduce_contact_probability`
- `detect_deviation` / `detect_deviations`
- `facilitate_recovery` / `enable_recovery`
- `not_determinable` / `not_determinable_from_scenario`
- `other` / field-specific `other_*` values

No alias is automatically merged. Import/export retains the source value.
Interfaces may show a preferred human-readable label while preserving the
machine value.

### Scientifically distinct terms

- `fatigue` and `cumulative_fatigue`
- `interruption` and `acute_interruption`
- `aerosol` as a release pathway and `inhalation` as an exposure route
- `closed`, `sealed`, `connected_closed_system`, and
  `closed_with_connections`
- `replication_defective` and `non_replication_competent`
- `relevance`, `clarity`, `distinctiveness`, selection frequency, and
  expected frequency of use
- `analyticalRelevance`, `evidenceStrength`,
  `expectedInfluenceOnDeliveredProtection`, `evaluatorCertainty`, and
  `consensusPriority`

### Unresolved terms retained for validation

- `unknown`, `not_determinable`, `not_observed`, and
  `insufficient_information` may overlap in some contexts but represent
  different missingness or epistemic states. They remain separate pending
  empirical validation.
- `engineering` versus `primary_engineering`/`secondary_engineering`, and
  `recovery` versus `recoveryControlStatus`, remain separate because one is a
  broad candidate layer and the others are more specific characterisations.
- Legacy F3 outcome values such as `spill_or_splash` overlap with separate
  deviation/pathway values. They remain unchanged because their original
  construct placement must be reviewed scientifically rather than migrated.

## Conflict matrix and compatibility decisions

| Area            | Previous implementation         | Required schema                           | Additive resolution                                                        |
| --------------- | ------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------- |
| Identifier      | `id`                            | `observationId`                           | New records use `observationId`; import normalises legacy `id`.            |
| Narrative       | `rationale`                     | `reasoningSummary`, `extendedComments?`   | New canonical names; legacy property remains import-compatible.            |
| Ratings         | categorical relevance/certainty | five separate 1–5 ratings                 | Add `ratings`; never total or classify.                                    |
| Evidence        | provisional eight-value set     | sixteen-value catalogue                   | Preserve old values and add every new value.                               |
| Fields          | partial extensions              | complete F1-F6 interfaces                 | Add every property and catalogue without removing old data.                |
| Taxonomy review | one 1–4 rating                  | three required 1–5 ratings plus optionals | Extend object; normalise legacy rating records on import.                  |
| Field synthesis | free synthesis                  | `FieldSummaryRating`                      | Add structured summary; retain legacy synthesis.                           |
| CSV             | wide observation record         | three normalised outputs                  | Retain existing export and add observation, selection and taxonomy tables. |

## Common observation variables

| Variable           | Dictionary definition               | TypeScript / JSON                | CSV mapping                 | Validation                                       |
| ------------------ | ----------------------------------- | -------------------------------- | --------------------------- | ------------------------------------------------ |
| `observationId`    | immutable identifier                | `string`                         | observation key             | required, non-empty                              |
| `fieldId`          | DPF field                           | `F1`…`F6`                        | every output                | required; matches parent                         |
| `taskPhases`       | applicable phases                   | `Selection<TaskPhase>[]`         | one selection row/value     | ≥1; `otherText` for `other`                      |
| `category`         | primary category                    | `Selection<string>`              | observation + selection row | required; conditional `otherText`                |
| `evidenceSources`  | evidence basis                      | `EvidenceSourceSelection[]`      | one selection row/value     | ≥1; enum; conditional `otherText`                |
| `ratings`          | five independent ordinal judgements | `QuantitativeObservationRatings` | five columns                | required 1–5 except optional `consensusPriority` |
| `reasoningSummary` | concise reasoning link              | `string`                         | observation column          | required, maximum 500; 80–300 recommended        |
| `extendedComments` | exceptional nuance                  | `string?`                        | observation column          | optional, maximum 2,000                          |

## Field-specific variables

Arrays of selections are JSON arrays of `{value, otherText?}` and create one
row per item in the selection CSV. Scalar selections use the same object shape.
All enum values are the union of the Structured Response Specification,
Variable Dictionary, and implementation brief.

| Field | Variables                                                                                                                                                             | Type / JSON shape                      | Validation and CSV                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| F1    | `taskFamily`, `taskOperations`, `workMode`, `systemOpenness`, `materialPhysicalState`, `vesselOrDevice`                                                               | required selections/selection arrays   | enum, non-empty arrays, conditional other text             |
| F1    | `subPhase`, `taskDurationBand`, `repetitionPattern`, `automationLevel`, `personnelConfiguration`, `locationWithinLaboratory`, `taskCriticality`                       | optional structured scalars/selections | enum/range when present                                    |
| F2    | `demandDomains`, `demandFactors`                                                                                                                                      | required selection arrays              | each non-empty                                             |
| F2    | `bodyRegions`, `ppeContributors`, `environmentalContributors`                                                                                                         | optional selection arrays              | enum/other text                                            |
| F2    | `demandIntensity`, `exposureDuration`, `frequencyPattern`, `variabilityPattern`, `recoveryAvailability`                                                               | rating/enums                           | required                                                   |
| F2    | `temporalLocation`, two coincidence variables, `peakDemand`                                                                                                           | selections/enums/object                | required except peak                                       |
| F3    | `initiatingConditions`, `deviationTypes`, `operationalOutcomes`, `releasePathways`                                                                                    | required selection arrays              | old and new F3 values preserved                            |
| F3    | `exposureRoutes`, `affectedTargets`                                                                                                                                   | optional selection arrays              | enum when present                                          |
| F3    | `causalChain`                                                                                                                                                         | four identifier arrays + summary       | required; identifiers refer to selections; exported intact |
| F3    | `detectability`, `reversibility`                                                                                                                                      | `OrdinalRating5`                       | required 1–5; descriptive only                             |
| F4    | `materialCategories`, `biologicalMaterialStatus`, `manipulationCharacteristics`                                                                                       | required selection arrays              | non-empty                                                  |
| F4    | `concentration`                                                                                                                                                       | raw value/unit + relative band         | optional; no cross-unit calculation                        |
| F4    | `volumeBand`, two comparisons, `containerState`, `informationSufficiency`, `missingInformation`                                                                       | selections/enums                       | required                                                   |
| F4    | `vectorOrConstructFeatures`                                                                                                                                           | optional selection array               | descriptive only                                           |
| F5    | `controlLayer`, `controls`, `controlFunctions`, `humanPerformanceDependencies`, `failureConditions`, `gapStatus`, `gapTypes`, `recoveryControlStatus`                 | selection(s)/enums                     | required; every historical F5 alias retained               |
| F5    | `verificationEvidence`                                                                                                                                                | optional selection array               | enum when present                                          |
| F6    | `indicatorName`, `constructTypes`, `measurementForms`, `expectedDirection`, `interpretationAmbiguity`, `observationMethods`, `feasibility`, `disambiguationCriterion` | strings/selections/rating              | required                                                   |
| F6    | `sensitivityExpected`, `specificityExpected`, `standardisationPotential`, `intrusiveness`, `resourceBurden`                                                           | optional ratings                       | 1–5 if present                                             |

Every field-specific scalar is present as an observation CSV column or in
`extensionJson`; every selection is additionally represented in the normalised
selection table using `selectionGroup`, `selectionIndex`, `value`, and
`otherText`, so no nested value is lost.

## Field summary and taxonomy review

| Variable                   | Type / JSON                    | CSV                       | Validation                                       |
| -------------------------- | ------------------------------ | ------------------------- | ------------------------------------------------ |
| `fieldSummary`             | `FieldSummaryRating`           | field-response export     | field matches parent                             |
| `dominantCategories`       | `Selection<string>[]`          | normalised selection rows | ≥1                                               |
| four field-summary ratings | independent `OrdinalRating5`   | four columns              | required 1–5; never totalled                     |
| summary reasoning/comments | strings                        | columns                   | reasoning required ≤500; comments ≤2,000         |
| `taxonomyItemRatings[]`    | full rating objects            | one evaluator × item row  | relevance, clarity, distinctiveness required 1–5 |
| `missingItems[]`           | structured proposals           | JSON + taxonomy CSV       | proposed text/value required                     |
| `redundantItems[]`         | structured item-pair proposals | JSON + taxonomy CSV       | pair and rationale required                      |

## JSON, persistence, merge and analysis

JSON preserves nested structures, identifiers, versions, `value`/`otherText`,
and unknown forward-compatible properties. Local persistence stores the same
session object. Merge retains all records, provenance and version mismatches.
The normalised CSV set is:

1. one row per observation;
2. one row per observation selection;
3. one row per evaluator × taxonomy item;
4. the existing field-response convenience CSV.

Analysis-ready output retains frequencies, missingness, `other` use and raw
ordinal inputs. Median/IQR and agreement inputs are descriptive only; the
software does not automatically select or interpret κ/ICC.
