# Changelog

## Unreleased

### Fixed

- Study and round scenario lists now resolve through explicit `RoundScenario` assignments instead of global scenario storage.
- ORG-01 and INC-01 now use their specified separate exploratory study and round.

### Added

- Explicit administrator action and visible `5 + 2` counters for the exploratory extension.
- Inspectable application manifest and SHA-256 reproducibility-package export.
- Automated anonymous-review text audit.
- Three isolated, removable simulated E1 evaluations for exercising descriptive graphics and agreement statistics.
- ZIP reproducibility package, local backup/restore preview, evaluator round progress and printable dashboard reports.

## Phase 0 quality hardening — 2026-07-24

- Added accessible, bilingual dashboard charts for completeness, session status
  and structured-category frequency.
- Charts follow all scientific-dashboard filters and explicitly avoid automated
  interpretation.
- Completed Spanish and English presentation for all new Phase 0 modules.
- Added translated display labels without changing canonical stored enum values.
- Stabilised the complete browser evaluation test with a 60-second test budget.
- Added automated evaluation export validation and administrative reimport.
- Split production dependencies into React, forms, PDF and document-import
  vendor chunks.
- Verified 53/53 unit tests and 19/19 browser/accessibility tests.

## Unreleased

- Separated Core 1.1, Platform 1.2.0 and Data Schema 1.1 identifiers.
- Added normalized Institution, scientific status adapter and immutable
  scientific/document snapshots.
- Added descriptive Scientific Dashboard with scenario-class separation.
- Added Supporting Documents and independent Issue/IssueHistory collections.
- Added conservative, idempotent migration simulation.

- Consolidated the platform around one structured hybrid instrument and one
  current evaluation workflow; retained historical narrative records only at
  the compatibility boundary.
- Added local functional profiles, evaluator assignments, study metadata,
  study duplication/archiving, consensus records, expanded evaluation states,
  exclusion justification and append-only audit events.
- Added non-decisional consistency findings and structured statistical
  functions for distributions, missingness, Jaccard/exact comparisons, ordinal
  differences, weighted kappa, Krippendorff alpha and ICC.
- Removed automatic Landis–Koch value labels from generated statistical output;
  coefficients are now reported without good/poor interpretation.
- Added export-version metadata and governance/audit records to study and
  merged JSON exchange.
- Added protected, confirmed deletion of an individual non-demo study, with
  cascading removal of its rounds, scenario assignments and evaluations while
  retaining reusable scenario records.
- Extended Instrument v1.1 into the structured-primary quantitative hybrid
  workflow using data schema `1.2` and candidate taxonomy
  `0.1-exploratory`.
- Added five independent observation ratings, required concise reasoning,
  optional extended comments, complete additive F1-F6 candidate catalogues,
  grouped searchable selection controls, multiple-observation duplication and
  reordering, field summaries, and three-dimensional taxonomy-item validation.
- Added normalised observation-selection CSV alongside observation,
  taxonomy-rating, field-response and JSON exports.
- Preserved schema 1.0/1.1 imports, legacy observation/taxonomy records, all
  v1.0 behaviour, and original enum values without destructive alias merging.
- Explicitly reserved user roles, cloud/multicentre management, consensus
  workflows, dashboards, predictive models and automatic interpretation for
  the future v2 roadmap.

- Added Study-level selection of DPF Instrument v1.0 or v1.1.
- Pinned instrument version on each Round and snapshotted it in sessions.
- Defaulted legacy studies and rounds to Instrument v1.0.0.
- Rejected imported rounds whose instrument version differs from their Study.
- Added visible bilingual `0.1-exploratory` taxonomy status.
- Enabled the complete Instrument v1.1 structured-observation workflow,
  including all F1-F6 variables, F3 causal chains, evidence-source selections,
  evaluator certainty, taxonomy-item ratings, validation, local persistence,
  JSON exchange, observation/taxonomy CSV exports, and merge compatibility.
- Preserved Instrument v1.0 behaviour, stored data, fixtures, version locking,
  imports, exports, and automated coverage.
- Updated generated JSON Schemas and automated coverage.

All notable changes to this project are documented here. The format follows Keep a Changelog and the project uses semantic versioning.

## [0.1.0-rc.2] - 2026-07-22

### Added

- Explicit Study-Round-Scenario assignments and exact E1-E5 demo set.
- JSON, CSV, DOCX, and PDF case import with local parsing and input safeguards.
- English/Spanish interface and validated Spanish SUS/RTLX source notes.
- Strict evaluation import validation, provenance-aware merge, schema generation, draft resumption, stale-session abandonment, and completed-record immutability.

### Changed

- Scientific ratings, RTLX, and SUS no longer have response defaults; unanswered values remain null and block completion.
- Anonymous-review documentation and publication packaging updated.

## [0.1.0-rc.1] - 2026-07-20

### Added

- Five automatically loaded fictional scenarios covering varied task and exposure contexts.
- Administrator and Evaluator workflows for the six-field framework.
- Versioned local storage, fictional scenarios, JSON exchange, conflict-aware merge, and CSV export.
- Cohen's kappa, Fleiss' kappa, percent agreement, and basic descriptive statistics with validation fixtures.
- Playwright, axe, TypeScript, ESLint, Prettier, and production-build quality gates.
- Scientific, privacy, deployment, and research-use documentation.

### Security

- Client-side-only persistence, no telemetry, and confirmed local-data deletion.

### Known limitations

- This is an unvalidated research prototype and must use fictional/demo data only.
- GitHub Pages deployment has not been executed; the current candidate is for local testing.
- Analyst dashboards and v0.2 statistics remain out of scope.
