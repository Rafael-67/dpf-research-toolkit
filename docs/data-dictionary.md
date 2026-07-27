# Data dictionary

All timestamps are ISO 8601 UTC; identifiers are opaque UUIDs except fixed demo IDs.

## Core entities

- `Study`: `studyId`, title, description, creation timestamp, workflow status, and `StudyConfig`.
- `StudyConfig`: RTLX/SUS inclusion and the confidence/relevance-clarity scale sizes.
- `Round`: study reference, number, label, framework version, lock state, evaluator group, and timestamps.
- `RoundScenario`: exact scenario/version assigned to a round.
- `Scenario`: append-only fictional task stimulus with operating conditions, available information, material description, controls, constraints, group, and version.
- `EvaluationSession`: pseudonymous evaluator, pinned study/round/scenario/framework versions, status, metadata, six field responses, optional RTLX/SUS, feedback, confirmation, and timestamps.
- `FrameworkChangeLogEntry`: per-field definition transition, text, change type, rationale, coded approver, and confirmed `breakingChange` classification.

## FieldResponse

| Field | Type | Meaning |
|---|---|---|
| `fieldId` | F1–F6 | Framework-field identity. |
| `narrativeAnswer` | string | Qualitative substantive response; never statistically aggregated. |
| `categoricalAnswer` | optional string | Reserved for a future categorical/ordinal field definition. |
| `openComment` | string | Qualitative methodological comment. |
| `changeProposal` | string | Suggested field revision. |
| `confidenceRating` | integer | 1 through configured confidence scale. |
| `relevance`, `clarity` | integer | 1 through configured relevance/clarity scale; future CVI inputs. |
| `exhaustiveness`, `redundancy`, `applicability`, `interpretationDifficulty` | integer | Fixed 1–4 ordinal ratings. |
| `insufficientInformation` | boolean | Excludes this response from agreement/CVI input. |
| `timeSpentSeconds`, `revisionCount`, `helpAccessedCount` | non-negative number | Automatically recorded usability metadata. |

## Exchange envelopes

Every JSON file has `schemaVersion`, `exportType`, `appVersion`, `generatedAt`, and type-specific `entities`. Supported export types are `study-config`, `evaluation-session`, and `merged-dataset`.

The canonical merged CSV contains one row per `FieldResponse`: `sessionId`, `roundId`, `scenarioId`, `evaluatorPseudonym`, `fieldId`, all narrative/rating fields, the insufficient-information flag, and usability counters.
