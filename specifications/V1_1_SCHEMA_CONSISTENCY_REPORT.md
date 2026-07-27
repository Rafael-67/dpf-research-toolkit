# DPF Instrument v1.1 — Cross-document schema consistency report

**Status:** No unresolved conflicts after the normative Dictionary alignment
of 23 July 2026. The Structured Response Specification supplies complete
content; the Variable Dictionary supplies canonical names and types.

| Variable/property | Dictionary definition | TypeScript type | JSON shape | CSV mapping | Validation |
|---|---|---|---|---|---|
| responseMode | Response modality | `legacy_narrative \| structured_narrative` | string | `responseMode` | fixed by instrument |
| observations | Structured field observations | `Observation[]` | array | one observation row each | >=1 or reason |
| noObservationReason | Reason for no observations | enum/null | string/null | field summary | required if empty |
| overallSynthesis | Integrative summary | string/null | string/null | `overallSynthesis` | <=200 words |
| id | Observation ID | string | string | included | non-empty UUID |
| fieldId | Field identity | F1–F6 | string | `fieldId` | matches response |
| category | Provisional taxonomy value | string | string | `category` | defined taxonomy or other |
| isOtherCategory | Other flag | boolean | boolean | `isOtherCategory` | consistent with category |
| otherCategoryText | Other text | string? | string/absent | `otherCategoryText` | required for other |
| taskPhases | Applicable phases | `TaskPhaseSelection[]` | object array | `taskPhasesJson` | >=1; other text conditional |
| analyticalRelevance | Within-field relevance | enum | string | `analyticalRelevance` | required |
| evidenceSources | Evidence bases | `EvidenceSourceSelection[]` | object array | `evidenceSourcesJson` | >=1; other text conditional |
| evaluatorCertainty | Combined evaluator certainty | high/moderate/low | string | `evaluatorCertainty` | required |
| rationale | Observation rationale | string | string | `rationale` | required; <=500 chars |
| createdAt | Creation timestamp | ISO string | string | `createdAt` | ISO 8601 |
| F1 extension | Sub-phase structure | `F1Observation` | named properties | `extensionJson` | conditional fields |
| F2 extension | Demand/peak structure | `F2Observation` | named properties | `extensionJson` | peak phase rules |
| F3 extension | Deviation/pathway/chain | `F3Observation` | named properties | `extensionJson` | chain required with pathway |
| F4 extension | Material comparisons | `F4Observation` | named properties | `extensionJson` | absent info if partial |
| F5 extension | Control layers/functions | `F5Observation` | named properties | `extensionJson` | gap text conditional |
| F6 extension | Candidate indicator | `F6Observation` | named properties | `extensionJson` | name/type/method/ambiguity |
| taxonomyItemRatings | Post-field taxonomy review | field-keyed rating arrays | object | separate taxonomy CSV | one 1–4 rating/category |
| dataSchemaVersion | Data schema identity | `"1.1"` | string | export metadata | fixed for v1.1 |
| instrumentVersion | Instrument identity | `"1.1.0"` | string | export metadata | round-locked |
| structuredItemSetVersion | Taxonomy identity | `"0.1-exploratory"` | string | both CSVs | fixed for current taxonomy |

Every F3 and F5 enum is the union of values in the Structured Response
Specification and earlier Dictionary definitions; no value is removed,
renamed away, collapsed, or silently coerced.
