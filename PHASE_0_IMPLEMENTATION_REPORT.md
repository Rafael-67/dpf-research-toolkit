# DPF-RP Phase 0 implementation report

Date: 2026-07-24

## Result

The application retains the complete DPF-RP v1.0 and structured v1.1
instrument while adding the Phase 0 scientific consolidation layer.

Version identifiers are now independent:

- Core: `1.1`
- Platform: `1.2.0`
- Schema: `1.1`
- Candidate taxonomy: `0.1-exploratory`

## Implemented

- explicit scientific session lifecycle and conservative legacy-state adapter;
- immutable scientific snapshot after evaluation start;
- simulation-only, idempotent migration with retained original data and warnings;
- normalised study-scoped Institution entity;
- read-only scientific dashboard with explicit scenario-class filtering;
- versioned supporting-document metadata, checksums, links and evaluation snapshots;
- independent Issues collection with append-only status history;
- separate JSON exports for configurations, institutions, evaluators, scenarios,
  sessions, field responses, taxonomy ratings, documents, links, Issues, Issue
  history and dashboard summaries;
- built-in reference cases E1–E5 plus ORG-01 and INC-01 in a separate
  exploratory round;
- bilingual navigation for the added Phase 0 modules;
- complete bilingual content, forms, tables and enum display labels in the
  scientific dashboard, supporting-document registry and Issues module;
- production vendor chunking for React, forms, PDF and document-import code;
- filter-responsive accessible charts for completeness, scientific session
  status and structured-category frequency, with the source tables preserved;
- additive schema changes without rewriting existing browser data.

## Scientific constraints preserved

- v1.0 narrative-primary behaviour remains available;
- v1.1 F1–F6 structured observations and `taxonomyItemRatings` are retained;
- taxonomy options remain candidate, versioned and revisable;
- no composite score or automatic safety/risk/approval decision was introduced;
- scenario classes are not pooled by default;
- agreement metrics remain conditional on a prespecified analysis plan;
- documents and Issues never overwrite completed observations.

## Intentionally outside Phase 0

Centralised/cloud study management, multicentre coordination, evaluator
assignment expansion, formal consensus workflow expansion, discrepancy
resolution screens, longitudinal dashboards, institutional taxonomies,
predictive models and automatic scientific interpretation remain future v2
work.

## Migration safety

No real persisted dataset is migrated automatically. `not_started` is adapted
to `draft`; `abandoned` remains `abandoned`; submitted/resubmitted/included
records are represented as completed in the simplified scientific view.
Migration simulation retains the original object and can be executed repeatedly
without changing its result.

## Verification

- TypeScript: passed.
- ESLint with zero warnings: passed.
- Unit tests: 55/55 passed in 20 suites.
- Browser/accessibility tests: 19/19 passed in parallel. This includes full
  Spanish Phase 0 navigation and a complete evaluation → JSON download →
  schema/version validation → administrative reimport and merge cycle.
  Browser concurrency is capped at two workers to avoid resource-related page
  setup timeouts on the local desktop runtime.
- Production build: passed with explicit vendor chunks. Application and React
  chunks are below 250 kB; the self-contained document-import vendor bundle is
  approximately 502 kB and remains isolated from initial application code.
