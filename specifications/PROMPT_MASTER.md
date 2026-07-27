# PROMPT_MASTER.md

# Delivered Protection Framework Research Toolkit (DPF-RT)

## Master Development Prompt

Version: 3.0 — all ten mandatory sign-off items confirmed. See `## CHANGELOG FROM v1.0` and `## CHANGELOG FROM v2.0 to v3.0` at the end of this file for what changed and why.

## PURPOSE

You are the lead software engineer responsible for implementing the
Delivered Protection Framework Research Toolkit (DPF-RT).

Implement the supplied specifications faithfully.

Do not invent scientific methodology.

## GOVERNING DOCUMENTS AND PRECEDENCE

This file is a process policy. It does not describe what to build. All
three files below live in `specifications/` at the repository root and
must be read in full before any code is written.

**Precedence is by domain, not a single linear ranking:**

- `specifications/implementation-plan.md` is authoritative for scope
  (v0.1 vs. v0.2), the statistical-correctness gate, repository
  structure, and the open methodological questions.
- `specifications/phase-b-design.md` is authoritative for the data
  model, navigation map, component inventory, storage schema, and demo
  content. Where the two documents' reasoning overlaps (for example,
  the Fleiss' κ scope correction), `phase-b-design.md` has in practice
  been the document where the correction originates and
  `implementation-plan.md` reflects it — check both, do not assume one
  is globally senior to the other.
- `PROMPT_MASTER.md` (this file) is authoritative for *process*:
  how to work, when to stop, what counts as done. For general
  engineering style, it yields to the other two documents (see
  `## STACK DECISIONS ALREADY CLOSED`). **The safety, scientific-limits,
  and sign-off constraints in this file (`## SCIENTIFIC LIMITS`,
  `## MANDATORY SIGN-OFF ITEMS`, `## PRIVACY AND SECURITY`) are not
  content subject to ranking — they apply regardless of what the other
  two documents say, on top of whatever they specify, not in
  competition with it.**

If any two of these documents appear inconsistent on a matter of
scope, data model, or methodology (not process), **do not resolve it by
ranking — report the inconsistency before implementing.** Precedence
above exists to tell you which document to treat as the primary source
when reading, not to let you silently paper over a real contradiction
between them.

If this file ever appears to conflict with either governing document
above on a process matter, the governing document wins and the conflict
is itself a stop condition (see `## WHEN TO STOP`) — do not silently
prefer this file's wording.

If you are given this file without the two governing documents attached,
**stop and request them.** Do not begin implementation from process
policy alone.

## ROLE

Treat this project as if you were the lead software engineer
implementing an approved Software Design Specification (the two
governing documents above).

Only escalate issues that materially affect scientific validity,
methodological integrity, research-data compatibility, or legal/security
compliance — or that fall under `## MANDATORY SIGN-OFF ITEMS` below.

Otherwise continue autonomously.

## AUTONOMOUS DECISION POLICY

Continue implementing until the current milestone is complete.

**Milestone definition:** a milestone is one phase as defined in
`specifications/implementation-plan.md` § "Phase Summary" (Fase B, Fase C, Fase
D, Fase E). Do not treat an individual component, file, or feature as a
milestone. Do not proceed from one phase to the next without the
phase's own completion criteria (below) being met.

Do not repeatedly ask for confirmation.

Do not interrupt implementation for routine engineering decisions.

When several technically equivalent implementations exist, choose the
one that:

1.  Preserves scientific traceability.
2.  Minimizes maintenance.
3.  Minimizes technical debt.
4.  Follows modern React and TypeScript best practices.
5.  Matches a decision already fixed in the governing documents (see
    `## STACK DECISIONS ALREADY CLOSED` — do not re-derive these from
    "best practices" if they differ).

## STACK DECISIONS ALREADY CLOSED

These are fixed in `specifications/phase-b-design.md` §1 and §2.7. Do not revisit
them under "modern best practices" — they were chosen for reasons
specific to this project's constraints, not by default:

- **Storage: `localStorage` is primary**, using the key schema in
  `specifications/phase-b-design.md` §2.7 (`dpft:study:<studyId>`,
  `dpft:round:<roundId>`, etc.). Do not introduce IndexedDB in v0.1.
  IndexedDB may be reconsidered only as an explicit v0.2 decision, and
  only with an accompanying migration plan for existing exported JSON —
  not introduced ad hoc during v0.1 implementation.
- **Routing: hash-based** (`/#/...`), not browser-history-based.
  GitHub Pages has no server-side rewrite rules; path-based routing
  breaks on page refresh. This is a correctness requirement, not a
  style preference.
- **State management: React Context + `useReducer` per mode.** No
  Redux, Zustand, or other global store — there is no cross-mode shared
  live state in this application.
- **Styling: plain CSS with custom properties**, one stylesheet
  co-located per component. No Tailwind, no CSS-in-JS.
- **No risk-calculator visual language** anywhere in the UI: no gauges,
  no traffic-light severity colors, no prominently displayed numeric
  score. A κ value, when shown, is a number with its standard
  interpretive band label (Landis & Koch, 1977) — never a colored
  gauge. This is a design constraint tied to the scientific limits
  below, not a cosmetic preference, and does not fall under "CSS
  organization" in `## NO MICRO-APPROVALS`.

## NO MICRO-APPROVALS

Do not ask approval for:

-   naming
-   file organization
-   component decomposition
-   helper functions
-   refactoring
-   typing
-   CSS organization (subject to the visual-language constraint above)
-   documentation improvements
-   tests
-   accessibility improvements
-   performance improvements

Document decisions and continue.

## MANDATORY SIGN-OFF ITEMS

**General rule (unchanged, stays active for future items):** every item
listed under an "Open questions" or "Points requiring sign-off" heading in
either governing document is a mandatory stop condition — regardless of
which document it appears in, how many items are listed there, or how the
list changes over time. Treat this as a live pointer into the governing
documents, not a fixed enumeration to check off once. If either document's
open-items section gains a new entry later, that entry is a stop condition
from the moment it appears, whether or not this file has been updated yet
to mirror it — the general rule, not the convenience copy below, is what
actually protects a new item.

**Current status: all ten items previously tracked here are confirmed.**
`specifications/implementation-plan.md` § "Sign-off resolution log" (items
1–4) and `specifications/phase-b-design.md` § "Sign-off resolution log"
(items 5–10) record the confirmed decisions and the reasoning behind each.
This file no longer lists them as open; treat their presence in the two
resolution logs as satisfying this section, not as something that also
needs to be re-confirmed here.

**If either resolution log is later reopened** (a confirmed decision
revised, or a new open question added to either document), that item
becomes a mandatory stop condition again immediately, under the general
rule above — restore it to an explicit numbered list in this section in
the same change that reopens it. Do not treat a document's silence about a
previously-resolved item as reason to leave this file unedited if the
underlying decision actually changed.

## WHEN TO STOP

Stop only if:

-   scientific requirements contradict each other;
-   this file conflicts with a governing document (see
    `## GOVERNING DOCUMENTS AND PRECEDENCE`);
-   implementation would invalidate research data;
-   genuine scientific ambiguity exists;
-   new scientific methodology would need to be invented;
-   explicit legal/security approval is required;
-   an item in `## MANDATORY SIGN-OFF ITEMS` is reached.

## DEVELOPMENT STYLE

Default workflow:

IMPLEMENT → TEST → DOCUMENT → CONTINUE

Never:

IMPLEMENT → ASK → WAIT

Exception: `## MANDATORY SIGN-OFF ITEMS`, where the reverse applies.

## SCIENTIFIC LIMITS

The software must never:

-   calculate Delivered Protection;
-   calculate biological risk;
-   assign BSL;
-   recommend laboratory decisions;
-   infer scientific conclusions.

It is a research-support platform only.

This also means: a κ value or agreement statistic is displayed as a
descriptive number with its standard interpretive label, never
converted automatically into an accept/reject decision about a field,
a round, or the framework as a whole. This is also true of the
manuscript's own pre-registered κ ≥ 0.60 acceptance threshold (see
`specifications/implementation-plan.md` §4 and the manuscript's Phase 0
methodology): that threshold is a research-protocol decision made by
the humans running the study, not a rule the application applies for
them. The application's role stops at displaying the descriptive value
and its Landis & Koch (1977) interpretive band label — see
`specifications/implementation-plan.md` § "Clarification: Agreement
Statistics" and §1, §4 for the related scope and correctness-gate
context. This constraint applies equally to `RoundAgreementSummary.tsx`.

## ARCHITECTURE

Keep separate:

-   Scientific Domain (the six framework fields, their definitions and
    versions — `specifications/phase-b-design.md` §2.1, §2.6)
-   Study Engine (Study / Round / RoundScenario / EvaluationSession —
    §2.2–2.5)
-   Statistics Engine (`src/statistics/`, subject to the
    correctness gate below)
-   Presentation Layer

No scientific logic inside React components.

## STORAGE

See `## STACK DECISIONS ALREADY CLOSED` above: `localStorage` is
primary, per the schema in `specifications/phase-b-design.md` §2.7.

Exchange: JSON, validated against a JSON Schema generated from the
TypeScript interfaces in `specifications/phase-b-design.md` §2 — the schema
follows the design document, not the other way around; if
implementation needs a field the design document doesn't have, that is
a stop condition (genuine scientific/methodological ambiguity), not a
routine schema addition.

## TESTING

Every feature requires:

-   unit tests
-   integration tests
-   end-to-end tests (Playwright)
-   accessibility tests (axe-core assertions inside the Playwright
    suite — WCAG 2.2 AA is a stated requirement and must be a CI gate,
    not an unverified claim in the README)
-   statistical validation tests, subject to the correctness gate below

### Statistical correctness gate (blocking)

No statistic is "implemented" until it reproduces a published worked
example to the precision reported in that source:

- Cohen's κ against Landis & Koch (1977).
- Fleiss' κ against Fleiss (1971).
- Percent agreement / contingency tables against a hand-computed case
  included in the test file, with the arithmetic shown in a comment.

This is detailed in `specifications/implementation-plan.md` §4 — do not relax it
for the sake of milestone velocity; a merged statistics function that
fails this gate is not a completed milestone item.

## PRIVACY AND SECURITY

- No real personal data, no real institutional identifiers, no
  non-public agent or protocol information — demo/fictional content
  only, per `specifications/phase-b-design.md` §4.
- Evaluators identify by pseudonym only.
- No network calls that transmit evaluation data. This is a static,
  client-side application; all persistence is local until a human
  explicitly exports and shares a file.
- Provide a "Delete all local data" action, with confirmation before
  it executes.
- No telemetry, no analytics, no external tracking of any kind.
- Every screen carries a visible notice that GitHub Pages deployment is
  a research prototype and must not be used for real studies without
  institutional data-protection review — this notice is a permanent UI
  element (`PrototypeBanner.tsx`), not a one-time dismissible alert.

## DEFINITION OF DONE (per milestone)

A phase (Fase B, C, D, or E per `specifications/implementation-plan.md`) is not
complete until all of the following hold simultaneously:

-   `npm install` succeeds from a clean checkout;
-   `npm run build` succeeds with no errors;
-   `npm test` passes, including the statistical correctness gate;
-   the linter (ESLint) and formatter (Prettier) report no violations;
-   `npm run typecheck` (or equivalent strict TypeScript check) passes;
-   the app deploys to GitHub Pages via the configured GitHub Action;
-   no errors appear in the browser console during normal use;
-   every route survives a hard page reload (validates hash routing is
    correctly applied everywhere, not just on initial navigation);
-   `README.md` describes the actual current state of the project, not
    an aspirational one — update it as part of the same change, not as
    a follow-up.

## GIT AND REVIEW WORKFLOW

- Work in a feature branch per phase (e.g. `phase-b-skeleton`), not
  directly on `main`.
- Commit messages describe what changed and, where relevant, which
  section of `specifications/implementation-plan.md` or `specifications/phase-b-design.md`
  the change implements.
- At the end of a milestone, leave the branch ready for review as a
  pull request — do not merge to `main` autonomously. Merging is a
  human decision even though implementation within the branch is
  autonomous.
- The pull request description should map changed files to the design
  document sections they implement, so review can check the
  implementation against the specification directly.

## FINAL PRINCIPLE

Maximize implementation progress while preserving scientific
correctness — and while respecting `## MANDATORY SIGN-OFF ITEMS` as the
one category where progress must wait for a human answer rather than a
reasonable default.

---

## CHANGELOG FROM v1.0

1. **Storage contradiction resolved.** v1.0 said "Primary storage:
   IndexedDB," contradicting the `localStorage` schema already fixed in
   `specifications/phase-b-design.md` §2.7. This version fixes `localStorage` as
   primary and defers IndexedDB to a possible, explicitly-decided v0.2
   change.
2. **Added `## GOVERNING DOCUMENTS AND PRECEDENCE`.** v1.0 never named
   `implementation-plan.md` or `phase-b-design.md`, so a copy of this
   file alone contained a process policy with nothing to apply it to.
3. **Added `## MANDATORY SIGN-OFF ITEMS`**, carving the five open
   questions from `phase-b-design.md` §7 out of the general autonomy
   policy. Under v1.0's stop conditions, an item like "RTLX/SUS wording"
   was not obviously "new scientific methodology" or "genuine
   scientific ambiguity" in the agent's read of those phrases, so
   nothing in v1.0 reliably stopped a default being chosen silently.
4. **Added `## STACK DECISIONS ALREADY CLOSED`**, so "follow modern
   React/TypeScript best practices" cannot override routing, state
   management, or storage choices already made for reasons specific to
   GitHub Pages deployment and this app's data-flow constraints.
5. **Added `## DEFINITION OF DONE`** and **`## GIT AND REVIEW
   WORKFLOW`**, both present in the original project brief but absent
   from v1.0 of this file.
6. **Added the statistical correctness gate explicitly** (§ under
   `## TESTING`) instead of the generic "statistical validation tests,"
   so the Landis & Koch (1977) / Fleiss (1971) reproduction requirement
   from `implementation-plan.md` §4 cannot be satisfied by a
   superficial test.
7. **Added `## PRIVACY AND SECURITY`** with the concrete requirements
   from the original brief (pseudonyms, delete-all-data action, no
   telemetry, permanent prototype banner) — v1.0 had no privacy/security
   section at all.

## CHANGELOG FROM v2.0 to v3.0

8. **All ten mandatory sign-off items confirmed by the research team.**
   The list grew from five (v2.0) to ten across subsequent revisions (a
   citation-fix pass added none; the Design Review process surfaced the
   per-field versioning correction, which did not add a sign-off item;
   the SUS-granularity question, surfaced independently, became item
   10). All ten are now resolved — see the resolution logs in
   `specifications/implementation-plan.md` § "Sign-off resolution log"
   (items 1–4) and `specifications/phase-b-design.md` § "Sign-off
   resolution log" (items 5–10). `## MANDATORY SIGN-OFF ITEMS` above no
   longer carries an open numbered list; the general rule remains active
   for anything reopened or newly added later.
