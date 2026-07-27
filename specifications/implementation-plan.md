# Implementation Plan — Delivered Protection Framework: Phase 0 Validation Tool

**Status:** Planning document (Fase A deliverable). No code has been written yet.
**Repository state:** Greenfield — this is a new repository, so "review the repository" (Fase A, step 1) has no prior codebase to assess. This plan substitutes for that step.

This document exists to resolve architectural and methodological ambiguities *before* implementation starts, per the project's own instruction not to invent thresholds or scientific rules silently inside code.

---

## 1. Scope correction: what "MVP" actually means here

The original brief specifies three full roles, ~15 export formats, six statistical procedures, a version-controlled changelog, i18n scaffolding, and a full CI/accessibility pipeline. That is a complete data-collection-and-analysis platform, not a minimum viable product. Building it before Phase 0 has run risks the exact failure mode the manuscript itself warns about in §4.4: an instrument whose own construction cost exceeds the value of the validation step it exists to support.

This plan splits the work into two real milestones:

| | v0.1 (this implementation) | v0.2 (deferred) |
|---|---|---|
| Roles | Study administrator, Expert evaluator | Analyst panel (full) |
| Storage | localStorage, export/import JSON | — |
| Statistics | Cohen's κ (pairwise), **Fleiss' κ (panel-wide, ≥3 evaluators)**, percent agreement, basic descriptives | weighted κ, ICC, I-CVI/S-CVI, NASA-TLX/SUS dashboards |
| Purpose | Run Phase 0 with a small evaluator panel (realistically 3–6 people) and produce raw exportable data, with an agreement number the panel size can actually support | Analyze accumulated data once v0.1 has been used at least once |

**Revision note (see `specifications/phase-b-design.md` §0.6):** Fleiss' κ moved from v0.2 into v0.1. The original split put only Cohen's κ (defined for exactly two raters) in v0.1, while this same document already states realistic panels are 3–6 people — a v0.1 that cannot compute agreement for its own stated panel size was an internal inconsistency, not a deliberate scope boundary. Weighted κ and ICC remain in v0.2: they serve ordinal/continuous fields, which are not the default response type for the six fields (narrative-first at v0.1.0-draft).

Rationale: Cohen's κ and percent agreement are sufficient for the first real round with a small panel. The remaining statistics are valuable but not blocking — they can be added once real (or demo) data exists to test them against, which is also safer than writing six statistical procedures against synthetic data alone.

**Confirmed by the research team (see § "Sign-off resolution log" in §7):** this split is accepted as specified.

---

## 2. The data-flow gap (must be resolved before any storage code is written)

The brief specifies per-evaluator local storage with no backend, and a separate Analyst panel that filters and aggregates across evaluators. As written, nothing connects the two. A static, no-backend app cannot make one browser's localStorage visible to another user's browser.

### Resolved flow for v0.1

1. **Administrator** creates a study and scenario set locally, exports `study-config.json`, and distributes it to evaluators through email or a shared drive — **confirmed acceptable for a Phase 0 pilot at this scale (a 3–6-person evaluator panel, one-time file exchange per round)**; the app does not transmit anything. If the study later scales to many more evaluators or many recurring rounds, this channel should be revisited rather than assumed to still be adequate.
2. **Evaluator** imports `study-config.json`, completes their evaluation locally, and exports `evaluation-<pseudonym>-<round>.json` at the end of their session.
3. **Administrator** collects the individual evaluation files (again, out-of-band) and imports each one into a **merge view** — a screen that exists specifically to combine multiple evaluator JSON files into one dataset before any analysis happens.
4. The merged dataset is what the Analyst panel (v0.2) reads. In v0.1, the merge view's own export (`merged-dataset.json` + CSVs) *is* the deliverable, to be opened by the research team in whatever stats package they already use for Phase 0's first pass.

This is documented as an explicit diagram in `docs/methodology.md` (not yet written), not left implicit in the UI.

**Consequence for architecture:** the "merge multiple JSON exports into one dataset, with conflict handling for duplicate scenario/evaluator/round combinations" is a first-class feature of v0.1, not an Analyst-panel-only concern deferred to v0.2.

---

## 3. Methodological decisions that must be fixed now, not during coding

The brief correctly says not to invent scientific rules inside the implementation. These are the specific points where an implementer would otherwise have to guess:

### 3.1 NASA-TLX variant
**Confirmed: RTLX (Raw TLX)** — six 0–100 subscales, no pairwise-weighting step. Full NASA-TLX's 15-pair weighting protocol is rarely used in software-usability contexts and adds a UI step disproportionate to what it buys here. Standard published subscale wording is used verbatim (sign-off item 8, also confirmed) — no lab-adapted phrasing.

### 3.2 ICC model
**Decision: ICC(2,k)** — two-way random effects, average measures, absolute agreement — is the standard default when the same fixed panel of evaluators rates every scenario and the results are meant to generalize to the field of similar evaluators. **Deferred to v0.2** (ICC is not in v0.1's scope per §1). **Confirmed: every evaluator rates every scenario** (full crossed design, not a subset assignment) — this matches ICC(2,k)'s assumption directly, so no revisiting is needed before v0.2 starts.

### 3.3 Kappa confidence intervals
Standard analytic CI (large-sample approximation) for v0.2, not bootstrap — simpler to verify against a published worked example (§4 below). Revisit only if sample sizes turn out to be small enough (<20 per comparison) that the asymptotic approximation is questionable.

### 3.4 "Relevant" threshold for I-CVI/S-CVI
Deferred to v0.2 per scope split. When built, the scale-to-relevant mapping must remain analyst-configurable per the original brief (e.g., top-2-of-4 vs top-1-of-4) — never hardcoded.

---

## 4. Statistical correctness gate

No statistic is considered "implemented" until its output matches a published worked example to the precision reported in that source. This is a blocking condition for merging, not a best-effort goal:

- **Cohen's κ:** validate against the worked example in Landis & Koch (1977) — already cited in the manuscript itself, so reusing it here also keeps the tool's methodology consistent with the paper's own reference.
- **Fleiss' κ:** validate against Fleiss (1971), the original worked example — moved into v0.1's blocking gate per the revision in `specifications/phase-b-design.md` §0.6.
- **Percent agreement / contingency tables:** validate against a hand-computed 2×2 and 3×3 case included in the test file itself, with the arithmetic shown in a code comment.

Each of these becomes a named test file under `tests/statistics/`, not a generic "statistics test" — so a future contributor can see exactly which published number each test is reproducing.

---

## 5. Two additions not in the original brief

### 5.1 Sensitive-content reminder (not a filter)
Scenarios are demo/fictional, but nothing stops an evaluator from pasting a near-verbatim description of a real non-public protocol into a free-text field. v0.1 adds a static, non-blocking reminder above every free-text field in the evaluator form: *"Do not enter select-agent information or non-public protocol details. Use only the demo/fictional scenario as written."* No content scanning, no automatic redaction — just visibility at the point of entry, consistent with the project's instruction not to add AI or automated content judgment.

### 5.2 Accessibility verification in CI
WCAG 2.2 AA is a stated requirement but the original test plan has no automated check for it. v0.1 adds `axe-core` assertions inside the Playwright test suite so accessibility compliance is a CI gate, not an unverified claim in the README.

---

## 6. Revised repository structure (v0.1)

**Note on `specifications/` vs. `docs/`, added when this section was
found to be out of sync with the real repository layout:** the three
governing documents (`implementation-plan.md`, `phase-b-design.md`,
`PROMPT_MASTER.md`) live in `specifications/` at the repository root —
that is the folder Codex is instructed to read before writing any code,
and it holds the documents that define *what to build and under what
constraints*. `docs/` is reserved for the Fase D deliverables
(`methodology.md`, `data-dictionary.md`, `privacy.md`, `deployment.md`,
`research-use-limitations.md`, `screenshots/`) — documents that
*describe the built system* once it exists, not documents that govern
building it. Do not move Fase D deliverables into `specifications/` and
do not move the three governing documents into `docs/`; the split is by
purpose, not by arbitrary convention.

```
/
  README.md
  LICENSE
  CITATION.cff
  CONTRIBUTING.md
  CHANGELOG.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  package.json
  vite.config.ts
  specifications/
    implementation-plan.md   # this file
    phase-b-design.md
    PROMPT_MASTER.md
    CODEX_FIRST_TASK.md      # bootstrap instruction; not a fourth governing document —
                              # it invokes the three above and adds no scope of its own
    # Any reference material dropped into this folder (e.g. a manuscript .docx)
    # is context, not a governing document. If such a file is present, it has
    # no authority over scope, data model, or process — those live exclusively
    # in the three governing documents above. Do not treat its presence as
    # requiring a fourth precedence tier.
  src/
    modes/
      administrator/        # see phase-b-design.md §5 for the full component list,
                             # including RoundAgreementSummary.tsx (Cohen's/Fleiss' κ
                             # display — v0.1 scope, not deferred to Fase D; see the
                             # Phase Summary note below)
      evaluator/
      admin/
        merge/               # the merge-multiple-JSON-exports view (§2) —
                              # canonical path; phase-b-design.md §5 is authoritative
                              # for this path, this tree previously disagreed with it
    framework/
      fields.ts            # the six fields, versioned
      scenarios/demo/       # the four fictional demo scenarios, full content in
                             # phase-b-design.md §4
    statistics/
      cohensKappa.ts
      fleissKappa.ts
      percentAgreement.ts
    storage/
      localStore.ts
      exportImport.ts
    i18n/                   # scaffolding only; English strings, structure ready for es
  tests/
    statistics/
      cohensKappa.landisKoch1977.test.ts
      fleissKappa.fleiss1971.test.ts
    e2e/
      accessibility.spec.ts   # axe-core
      scenario-lifecycle.spec.ts
      export-import.spec.ts
  docs/
    methodology.md            # data-flow diagram (§2), NASA-TLX/ICC decisions (§3)
    data-dictionary.md
    privacy.md
    deployment.md
    research-use-limitations.md
    screenshots/
  .github/
    workflows/
      deploy-pages.yml
      test.yml
    ISSUE_TEMPLATE/
    pull_request_template.md
```

Analyst-panel code (`src/modes/analyst/`), weighted κ, ICC, I-CVI/S-CVI, and NASA-TLX/SUS aggregate dashboards are deferred to v0.2 and intentionally absent from this structure. Fleiss' κ is in v0.1 (`src/statistics/fleissKappa.ts`) — see the revision note in §1.

---

## 7. Sign-off resolution log (items 1–4, formerly "Open questions")

**Status: confirmed by the research team.** These four items were enforced
as mandatory stop conditions in `PROMPT_MASTER.md` § MANDATORY SIGN-OFF
ITEMS (items 1–4 there) while open. They are resolved as of this version;
`PROMPT_MASTER.md` has been updated accordingly. If any of these is
reopened or revised later, restore it to `PROMPT_MASTER.md`'s mandatory
list in the same change — do not silently amend a confirmed decision here
without reinstating the stop condition there.

1. **v0.1/v0.2 split (§1): confirmed as specified.** Cohen's κ and Fleiss' κ in v0.1; weighted κ, ICC, I-CVI/S-CVI, and NASA-TLX/SUS dashboards remain in v0.2.
2. **RTLX vs. full NASA-TLX (§3.1): confirmed RTLX**, standard published wording.
3. **Out-of-band JSON distribution channel (§2): confirmed acceptable** for a Phase 0 pilot at the panel scale described (3–6 evaluators); revisit if the study scales up.
4. **Evaluator-scenario assignment (§3.2): confirmed — every evaluator rates every scenario.** Full crossed design, consistent with ICC(2,k).

---

## 8. Next step

Pending confirmation of the open questions in §7, Fase B (functional skeleton: React + TypeScript + Vite, navigation, storage, demo data, Administrator and Evaluator modes per the v0.1 scope in §1) can begin.


## Clarification: Agreement Statistics

Agreement statistics are calculated only from categorical field-level variables, never from free narrative text.

Narrative comments are analysed qualitatively and are stored for methodological review.

Version 0.1 shall already collect every variable required for future I-CVI/S-CVI calculations even if those indices are not yet implemented.

## Phase Summary

**Reconciliation note:** earlier drafts left it ambiguous whether Cohen's/Fleiss' κ and `RoundAgreementSummary.tsx` belong to Fase B or Fase D, since this table's original wording associated "validated statistics" with Fase D while §1's v0.1 scope table already placed both κ statistics in v0.1. These are not in tension once stated explicitly: **initial implementation of Cohen's κ and Fleiss' κ, passing the statistical correctness gate (§4), is a Fase B completion requirement** — the tool cannot claim its stated v0.1 scope is done without them. Fase D's "validated statistics" refers to accessibility/documentation/edge-case hardening around already-implemented statistics (e.g. confidence-interval display, additional worked-example fixtures), not their first implementation.

| Phase | Deliverable | Completion criterion |
|---|---|---|
| B | Functional skeleton | Navigation, data model, storage, Study/Round/Scenario CRUD, and the evaluator six-field session flow working; Cohen's κ and Fleiss' κ implemented and passing the §4 correctness gate |
| C | Complete workflow | Create, evaluate, import/export, and merge operational end-to-end, including `breakingChange`-aware conflict handling in the merge view |
| D | Scientific quality | Accessibility (axe-core CI gate), full documentation set (`docs/methodology.md`, `data-dictionary.md`, `privacy.md`, etc.), and statistics-display hardening (edge cases, additional fixtures) |
| E | Release | CI, GitHub Pages deployment, and release candidate |
