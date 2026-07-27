# Delivered Protection Framework Research Platform (DPF-RP)

**Current versions:** Core 1.1 · Platform 1.2.0 · Data Schema 1.1.

Phase 0 includes the structured F1–F6 workflow, Scientific Dashboard,
Supporting Documents and an independent Issue review layer. See
`ARCHITECTURE.md`, `DATA_SCHEMA.md`, `MIGRATION_GUIDE.md` and
`SCIENTIFIC_CONSTRAINTS.md`.

> **Current architecture:** DPF-RP is one structured hybrid expert assessment
> instrument combining structured observations with concise expert reasoning.
> There is one evaluation workflow and one current data model. Historical
> narrative records remain importable, but there is no independent narrative
> data-entry instrument.

DPF-RP is a static, client-side research platform for Phase 0 content and usability validation of a six-field conceptual framework. It supports study/round/scenario setup, a one-field-at-a-time evaluator flow, local persistence, and descriptive Cohen/Fleiss agreement summaries.

It does **not** calculate Delivered Protection, biological risk, or biosafety levels, and it does not recommend laboratory decisions. Use fictional/demo information only. Real research use requires institutional data-protection review.

## Current state — v0.1.0-rc.2 anonymous-review candidate

- Hash-based Administrator and Evaluator navigation.
- Versioned Study, Round, Scenario, EvaluationSession, and FieldResponse models.
- One structured-hybrid instrument, version-locked by round and snapshotted in
  every evaluation. Candidate taxonomy is visibly `0.1-exploratory`.
- Exactly five explicitly fictional demo scenarios (E1-E5), assigned through explicit Study-Round-Scenario records.
- Local case import from native `study-config.json`, flexible JSON, CSV (comma or semicolon separated), labeled Word `.docx`, and labeled PDF files.
- `localStorage` persistence under the `dpft:` namespace and confirmed delete-all action.
- Study, Round, and Scenario creation; round lock controls.
- Six-field evaluator flow with required explicit ratings, review, RTLX, per-scenario SUS notice, draft resumption, 24-hour abandonment, and immutable completion.
- Descriptive distributions, exact/Jaccard/ordinal comparisons, raw agreement,
  Cohen/weighted/Fleiss kappa, Krippendorff alpha and ICC calculations without
  automatic interpretation.
- Unit, integration, Playwright end-to-end, and axe accessibility tests, including published worked-example gates.
- Versioned study/evaluation JSON exchange with JSON Schemas, strict session validation, explicit import error classes, MIME checks, and a 10 MB limit.
- Conflict-aware multi-file merge, duplicate-attempt reporting, and field-level breaking-change comparability.
- Merged JSON and field-response CSV exports.
- Scientific methodology, data dictionary, privacy, deployment, and research-use limitation documentation.
- Basic descriptives and additional agreement edge-case validation.
- CI and GitHub Pages workflows plus repository contribution and release guidance.

Cloud services, secure authentication, central databases and distributed
collaboration are intentionally out of scope.

## Scenario sets

| Set                | Cases                          | Classification                              | Purpose                                                       |
| ------------------ | ------------------------------ | ------------------------------------------- | ------------------------------------------------------------- |
| Reference          | E1–E5                          | `reference`, `referenceSet: true`           | Primary aligned validation set loaded by default              |
| Research extension | ORG-01, INC-01                 | `research-extension`, `referenceSet: false` | Optional separate study loaded explicitly by an administrator |
| User-created       | Locally created/imported cases | `user`, `referenceSet: false`               | Local studies outside the canonical sets                      |

The research extension is not loaded automatically. An administrator can load
it from the scenario-set summary; the platform creates its separate study and
round from `data/study-config-exploratory.json`. It cannot be silently pooled
with E1–E5. Legacy native study configurations without the classification
fields are treated as reference material and the import summary reports that
defaults were applied.

Worked examples, when editorially approved, use the separate
`dpft:workedexample:` namespace. Evaluator screens do not read that namespace,
and worked-example content is excluded from evaluation-session and merged
dataset exports.

The instrument uses the complete structured-observation workflow with concise
expert reasoning. It includes the exploratory F1-F6 taxonomy,
field-specific observation properties, F3 causal-chain data, evaluator
certainty and evidence-source selections, taxonomy-item ratings, local
persistence, validated JSON import/export, dedicated observation and taxonomy
CSV exports, audit events, local functional profiles, assignments, consensus
records and version-safe dataset merging. Historical narrative records remain
import/export compatible.

The current structured-primary extension stores five separate 1–5 observation
ratings, a required concise reasoning summary, optional extended comments,
field-level summaries, and taxonomy validation ratings. Long candidate
catalogues are searchable and retain every historical value. JSON and
normalised observation, selection, taxonomy and field-response CSV files are
prepared for later independent analysis; the application does not calculate a
total, risk/containment classification, or automatic scientific conclusion.
Backend authentication, cloud synchronisation, API services, a central
database and distributed collaboration remain future-platform work.

## Development

```sh
npm install
npm run typecheck
npm test
npm run lint
npm run format
npm run build
```

The Vite base path is `/Delivered-Protection-Framework/`. Update it together with repository metadata if the eventual GitHub repository uses another name.

## Privacy

No telemetry or analytics are included. The application makes no network call that transmits evaluation data. Persistence remains in the current browser until a human deletes it; JSON/CSV files move only through explicit human export/import actions.

## Anonymous review package

The **About / Manifest** screen exposes the implemented versions, scenario-set
policy and scientific boundaries. It can export a reproducibility package with
the local datasets and a SHA-256 hash for each dataset as a ZIP. The same
screen provides full local backup and preview-before-restore.

Administrators may load three unmistakably simulated E1 evaluations to exercise
the charts and agreement views, then delete only those simulations. The
simulation registry keeps them out of normal Phase 0 scientific exports.

Run `pnpm schemas`, `pnpm audit:anonymity`, the full quality gates, and
`pnpm build`. The automated anonymity audit supplements—without replacing—the
manual metadata and Git-history review. Upload the prepared source repository
to anonymous.4open.science; use `dist/` only as the optional static-site
artifact. Keep identities, private manuscript metadata, original Git history,
tokens, analytics, and real participant data out of the review repository. See
`docs/deployment.md` and `RELEASE_CHECKLIST.md`.
