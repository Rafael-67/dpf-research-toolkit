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

It does **not** calculate Delivered Protection, biological risk, or biosafety levels, and it does not recommend laboratory decisions. Use invented or de-identified details only. Do not enter real personal, institutional, agent, protocol or incident information. Real research use requires institutional data-protection review.

For a concise explanation of the application's purpose, roles, F1-F6 workflow,
data handling and a suggested 10-minute walkthrough, see
**[`QUICK_USER_GUIDE.md`](QUICK_USER_GUIDE.md)**.

## Reviewer quick start

The application is live at [DPF-RP on GitHub Pages](https://rafael-67.github.io/dpf-research-toolkit/) — no installation, account or download is required. Reviewers can also create their own test studies, rounds and illustrative scenarios using invented or de-identified details only. Source code remains available below for inspection or rebuilding.

Open the [10-minute walkthrough](https://rafael-67.github.io/dpf-research-toolkit/#/walkthrough). See [QUICK_USER_GUIDE.md](QUICK_USER_GUIDE.md)
for a suggested ten-minute walkthrough.

The application runs in your browser. Evaluation data stay in that browser's
local storage unless you explicitly export them. Export a backup before clearing
browser data or changing browsers or site addresses.

## Source code and reproducibility

Source code, illustrative scenario data, schemas and tests are available in this repository.
For development, use Node.js 22 LTS and pnpm 10.11.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the address printed by Vite. To run the checks:

```sh
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

See [docs/deployment.md](docs/deployment.md) for GitHub Pages setup.

## Current state — Platform 1.2.0 research prototype

- Hash-based Administrator and Evaluator navigation.
- Versioned Study, Round, Scenario, EvaluationSession, and FieldResponse models.
- One structured-hybrid instrument, version-locked by round and snapshotted in
  every evaluation. Candidate taxonomy is visibly `0.1-exploratory`.
- Exactly five explicitly illustrative scenarios (E1-E5), assigned through explicit Study-Round-Scenario records.
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
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm lint
pnpm format
pnpm build
```

The Vite base path is `/dpf-research-toolkit/`. Update it together with repository metadata if the eventual GitHub repository uses another name.

## Privacy

No telemetry or analytics are included. The application makes no network call that transmits evaluation data. Persistence remains in the current browser until a human deletes it; JSON/CSV files move only through explicit human export/import actions.

## Version identifiers

The software package and release version is **Platform 1.2.0** (Git tag
`v1.2.0`). **Core 1.1** identifies the conceptual framework, **Data Schema 1.1**
identifies the schema version displayed by the platform, and **Taxonomy
0.1-exploratory** identifies the exploratory taxonomy. These identifiers refer
to different components and are not interchangeable. The previous package label
`0.1.0-rc.2` is superseded by the platform version; this metadata alignment does
not establish scientific validation.

## Reproducibility and releases

The About / Manifest screen exports local datasets with SHA-256 hashes and
supports local backup and preview-before-restore. Simulated evaluations are
excluded from normal scientific exports.

Use GitHub Releases to identify the reviewed source version. Cite its exact tag
and repository URL; the GitHub Pages site follows the latest successful deploy
from main and can change. See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

## Guía en español

La aplicación está disponible en https://rafael-67.github.io/dpf-research-toolkit/ sin instalación, cuenta ni descarga. Utiliza el selector de idioma para verla en español. Puedes crear estudios, rondas y escenarios ilustrativos propios con detalles inventados o desidentificados. No introduzcas información real de personas, instituciones, agentes, protocolos o incidentes.

Versiones: Core 1.1 · Platform 1.2.0 · Schema 1.1. Consulta [el recorrido en español](docs/walkthrough.es.md) y [el recorrido en inglés](docs/walkthrough.en.md). Los datos se guardan en el navegador salvo exportación expresa; la eliminación de todos los datos locales está en el pie de página.

El marco no está validado empíricamente. La plataforma no calcula riesgo biológico ni niveles de contención, no interpreta automáticamente los resultados y no recomienda decisiones de laboratorio.
