# Codex — First Task Instruction (v2 — instrument specifications added)

> **Superseded architecture notice — 23 July 2026.** Any narrative-first,
> dual-instrument, or deferred-local-governance statement below is historical.
> Current authority is `ARCHITECTURAL_CONSOLIDATION_REPORT.md`: one structured
> hybrid instrument, one workflow and one current data model.

Read every document under `specifications/` in full before writing any
code. That folder now contains **eleven documents** with different,
specific authority. Read `specifications/PROMPT_MASTER.md` §
"GOVERNING DOCUMENTS AND PRECEDENCE" for how the original three relate
to each other; the four instrument-specification documents added below
have a defined, subordinate relationship to those three.

## The eight specification documents and their authority

### Original governing documents (unchanged authority)

- `specifications/implementation-plan.md` — authoritative for scope,
  the statistical-correctness gate, repository structure, and the list
  of open methodological questions.
- `specifications/phase-b-design.md` — authoritative for the data
  model, navigation, components, storage schema, and demo content.
- `specifications/PROMPT_MASTER.md` — authoritative for process: how
  you work, when you stop, what "done" means. Its scientific-limits,
  sign-off, and privacy/security constraints apply on top of whatever
  the other documents say. They are always-on constraints, not ranked
  content.
- `specifications/CODING_RULES.md` — mandatory engineering rules:
  scientific limits in code, terminology, variable-definition rules,
  prompt integrity, statistical-computation rules, testing, and stop
  conditions. Subordinate to the scientific specifications above but
  mandatory for all implementation work. Read before writing any code.

### Instrument specification documents (read before touching any field,
variable, or statistical computation)

- `specifications/DPF_INSTRUMENT_SPEC_v1.md` — **read this before
  implementing or modifying any field definition, evaluator-facing
  prompt, variable, rating scale, or statistical output.** Defines
  what the instrument does, what it does NOT do, all six fields with
  their prompt texts, all per-field variables and their scales, the
  closing survey, and the inter-rater agreement computation rules.
  Any feature that is not described here for v1.0 does not belong in
  the current implementation — propose it as a v2.0 item instead.

- `specifications/DPF_INSTRUMENT_ROADMAP_v2.md` — **read this before
  discussing or implementing any structured scale, ordinal subscale,
  domain score, Delivered Protection Profile, or scoring feature.**
  Defines the planned v2.0 instrument evolution. The critical rule: do
  not implement any v2.0 feature in the current platform (DPF-RP v1.1
  / DPF Instrument v1.0). The roadmap is a design document for future
  work gated on Phase 0 results, not a feature backlog for the current
  sprint.

- `specifications/DPF_VARIABLE_DICTIONARY.md` — **the single source
  of truth for every variable name, type, scale, value set, and
  definition.** If a variable you are about to create is not in this
  dictionary, stop and report it as a missing definition before
  proceeding. Appendix A contains the verbatim wording of all RTLX and
  SUS items — these must be implemented exactly as written; no
  lab-adapted phrasing is permitted under any circumstances.

- `specifications/DPF_VALIDATION_PROTOCOL.md` — read before
  implementing any agreement statistic display, threshold label, or
  accept/reject logic. The platform computes κ values and displays
  Landis & Koch interpretive bands; it does not apply the κ ≥ 0.60
  gate automatically or convert statistics into accept/reject
  decisions. Those are research-team decisions, not platform decisions.

## WorkedExample isolation rule (mandatory, no exceptions)

`WorkedExample` content (model responses, evaluator notes, proposed
changes, key interaction findings) must never appear on any screen that
is accessible during an active evaluation session. Specifically:

- No component in the evaluator flow may read from `dpft:workedexample:`
  storage keys.
- No `WorkedExample` field may appear in any `EvaluationSession` export
  JSON or merged CSV.
- The worked-example view (if implemented) must be unreachable from the
  session flow until `evaluationStatus === "completed"` AND the session
  has been exported.
- Violating this rule would introduce anchoring and priming bias into
  Phase 0 validation data, invalidating the inter-rater reliability
  results. This is a scientific integrity constraint, not a UI
  preference.

See `phase-b-design.md §2.4b` for the full `WorkedExample` entity
specification and storage rules.

## Precedence rules for the four instrument documents

1. If `DPF_INSTRUMENT_SPEC_v1.md` and `phase-b-design.md` appear to
   disagree on a variable name, scale, or field definition, report the
   inconsistency before implementing either version.
2. If `DPF_INSTRUMENT_ROADMAP_v2.md` describes a feature that is not
   yet in the platform, do not implement it — it is future work gated
   on Phase 0. Do not treat roadmap features as implicit requirements.
3. If `DPF_VARIABLE_DICTIONARY.md` defines a variable with a specific
   scale and `phase-b-design.md` uses a different scale for the same
   variable, the Variable Dictionary is authoritative. Report the
   discrepancy.
4. `PROMPT_MASTER.md` scientific limits (no biological risk score, no
   BSL assignment, no operational recommendation) override everything
   else in all eight documents without exception.

If `implementation-plan.md` and `phase-b-design.md` appear to disagree
on scope, data model, or methodology, **do not silently pick one —
report the inconsistency before implementing.** If either of them
appears to disagree with a *process* rule in `PROMPT_MASTER.md`, the
design document wins on that point, and the disagreement is itself
something to report, not something to resolve silently.

**A provisional recommendation is not a confirmed answer.** Where a
document says something like "Decision: X — team must confirm," treat
the underlying question as still open, not as answered by the word
"Decision." Do not read your way around a sign-off requirement by
citing the tentative recommendation next to it.

Do not infer scientific methodology beyond what is specified in these
eight documents.

## Your first task is NOT to implement the application

Your first task is to perform a complete Design Review of the
specification as it stands across all three documents together, not
each in isolation.

Create a document named `DESIGN_REVIEW.md` at the repository root
containing:

1. Executive summary.
2. Overall assessment of the specification.
3. Internal inconsistencies — including, specifically, any place where
   `implementation-plan.md` and `phase-b-design.md` describe the same
   entity, workflow, or decision differently, and any place where a
   cross-reference between the three documents points at a section,
   file, or path that does not actually exist.
4. Missing definitions.
5. Ambiguous requirements.
6. Risks for implementation.
7. Suggested improvements — objective engineering improvements only.
   Never propose a scientific or methodological redesign; if you find
   yourself wanting to, that is a finding for section 3 or 4, not a
   suggestion for section 7.
8. Confirmation of whether the specification is sufficiently complete
   to begin implementation.

## What counts as blocking

Only treat an issue as blocking implementation if it would affect:

- scientific validity;
- methodological integrity;
- compatibility of collected research data;
- legal or security requirements;
- **or is one of the nine items listed under `PROMPT_MASTER.md` §
  "MANDATORY SIGN-OFF ITEMS."** These nine are blocking by definition,
  regardless of how minor any individual one might otherwise seem —
  do not re-evaluate their materiality yourself; the fact that they are
  on that list is what makes them blocking.

Do not treat routine engineering decisions as blocking. Do not ask
questions whose answers already exist, confirmed, somewhere in the
documentation — but see the provisional-vs-confirmed distinction above
before deciding an answer already exists.

## After completing DESIGN_REVIEW.md

If there are no blocking issues (per the definition above — scientific
validity, methodological integrity, data compatibility, legal/security,
or an unconfirmed mandatory sign-off item), begin implementation
immediately with Fase B.

Work autonomously following `specifications/PROMPT_MASTER.md` in full,
including its `## DEFINITION OF DONE` and `## GIT AND REVIEW WORKFLOW`
sections — a milestone is not complete just because the code runs.

Complete entire milestones (as defined in `implementation-plan.md` §
"Phase Summary") before stopping.

After each milestone:

- run the tests;
- fix any detected issues;
- update the documentation;
- provide a milestone summary, mapping what changed to the
  specification sections it implements;

then continue automatically with the next milestone unless a genuine
blocking condition (as defined above) exists.

Your default workflow is:

READ → REVIEW → IMPLEMENT → TEST → DOCUMENT → CONTINUE

not

READ → ASK → WAIT.

The one exception is the nine `MANDATORY SIGN-OFF ITEMS` — for those,
and only those, the workflow is the reverse: stop, ask, and wait for an
explicit answer before writing the code path that depends on it.
