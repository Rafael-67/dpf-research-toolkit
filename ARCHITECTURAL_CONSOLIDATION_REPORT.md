# DPF-RP architectural consolidation report

**Date:** 23 July 2026  
**Decision:** one instrument, one workflow, one data model.

## Scientific definition

DPF-RP is a structured hybrid expert assessment instrument combining
structured observations with concise expert reasoning. Structured observations
are the primary analytical dataset. `reasoningSummary` remains required and
`extendedComments` remains optional.

## Consolidated hierarchy

`Study → Scenario → Evaluation Round → Evaluation → Field → Observation`

The local platform adds functional profiles, assignments, consensus records,
audit events, non-decisional consistency checks and reproducible statistical
outputs around this hierarchy. It does not add authentication, cloud
synchronisation, a multi-user server, institutional login, API services, a
central database, distributed collaboration, AI or recommendations.

## Compatibility

- New evaluation entry always uses the structured hybrid workflow and schema
  `1.2`.
- Historical narrative evaluations remain importable/exportable as legacy
  records. They do not retain an independent data-entry interface.
- Existing identifiers and values are preserved; no destructive taxonomy
  harmonisation is performed.
- Candidate taxonomy remains `0.1-exploratory`.

## Consolidated records

| Record                | Purpose                                      | Stable/version metadata                           |
| --------------------- | -------------------------------------------- | ------------------------------------------------- |
| `Study`               | scientific container and metadata            | UUID, status, instrument/schema/taxonomy versions |
| `Scenario`            | versioned assessment context                 | scenario ID/version                               |
| `Round`               | version-locked evaluation cycle              | round ID and version snapshots                    |
| `EvaluatorAssignment` | local functional assignment                  | assignment ID, study/round/scenario/evaluator     |
| `EvaluationSession`   | append-oriented expert record                | session UUID, state, versions, timestamps         |
| `FieldResponse`       | field summary and observations               | field ID/definition version                       |
| `Observation`         | primary analytical unit                      | UUID and candidate taxonomy selections            |
| `ConsensusRecord`     | documented human consensus                   | ID, source evaluations, decision/rationale        |
| `AuditEvent`          | append-only trace                            | UUID, actor profile, action, entity, timestamp    |
| `UserProfile`         | local functional profile, not authentication | UUID, pseudonym, role                             |

## Evaluation states

`not_started`, `in_progress`, `submitted`, `returned_for_revision`,
`resubmitted`, `locked`, `included_in_analysis`, and
`excluded_from_analysis`. Legacy states remain import-compatible and historical
source values are retained.

## Statistical boundary

The integrated module reports raw values, sample sizes, missingness, methods
and warnings. It supports descriptive distributions, evaluator comparisons,
raw/exact agreement, Jaccard similarity, ordinal differences, Cohen/Fleiss
kappa, weighted kappa, Krippendorff alpha and ICC where data requirements are
satisfied. It never labels agreement good/poor, chooses methods as scientific
decisions, or converts results into safety conclusions.

## Non-decisional consistency checking

Rules detect missing evidence, incomplete observations and combinations marked
for review. Every finding uses the neutral message:

> Please review this combination.

No finding declares an evaluator wrong or produces a safety decision.

## Removed duplication

- New studies no longer select between narrative and structured instruments.
- New rounds inherit the single structured-hybrid instrument.
- The evaluator no longer renders a separate large narrative-only form.
- Legacy narrative schemas/types remain solely at the import/export boundary.

## Implementation result

- Single structured-hybrid entry flow enabled for every new study and round.
- Candidate hierarchical taxonomies, observations, reasoning, summaries and
  validation retained.
- Local profiles, assignments, metadata, duplication, archiving, evaluation
  state management, consensus records and append-only audit events implemented.
- Round statistics include raw agreement coefficients, structured
  distributions, taxonomy inputs and evaluator/scenario/field comparison
  tables without automatic interpretation.
- Historical narrative records remain accepted by compatibility validators.
- Future backend/cloud/server/API/database/distributed features remain
  unimplemented by design.
