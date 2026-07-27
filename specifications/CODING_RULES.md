# DPF Research Platform — Coding Rules

> **Consolidated architecture — 23 July 2026.** New data collection implements
> one structured hybrid workflow and schema. Legacy narrative records remain
> import/export compatible but have no independent entry interface.

> **Implementation alignment — 23 July 2026.** The approved Instrument v1.1
> workflow is structured-primary hybrid. Observation ratings remain independent
> ordinal variables, the concise reasoning summary is required, and extended
> comments are optional. Implementations provide normalised observation,
> selection, and taxonomy-review exports and never sum ratings or generate
> biological-risk, containment, approval, or safety classifications.
> Instrument v1.0 remains unchanged.
## Mandatory implementation constraints

**Status:** Authoritative engineering rules for all implementations of the DPF Research Platform (DPF-RP).  
**Applies to:** DPF-RP v1.1 and all later platform versions unless superseded by an explicitly approved revision of this document.  
**Relationship to instrument versions:** These rules govern software implementation. They do not alter the scientific definition of DPF Instrument v1.0 or any future instrument version.  
**Authority:** This document is subordinate to the governing scientific and methodological specifications, but mandatory for implementation. When a conflict is detected, implementation must stop and the conflict must be reported rather than resolved silently.

---

## 1. Governing principle

The platform exists to implement the Delivered Protection Framework as a research instrument. It must support standardised data collection, pseudonymised export, multicentre aggregation, usability assessment, and pre-specified statistical analysis.

The platform must never be presented or implemented as:

- a biological-risk calculator;
- a biosafety-level assignment system;
- a regulatory decision engine;
- an operational approval tool;
- a compliance-certification tool;
- a substitute for institutional biosafety assessment;
- an autonomous safety-recommendation system.

Every feature, label, calculation, export field, chart, and message must remain consistent with that boundary.

---

## 2. Scientific limits that must be enforced in code

The following functions are prohibited in every platform version unless the governing scientific documents are formally revised:

1. Calculating a biological risk score.
2. Assigning, recommending, or implying a BSL or containment level.
3. Calculating residual risk.
4. Multiplying or combining biological material variables to produce a risk index.
5. Producing traffic-light classifications for risk, safety, approval, or compliance.
6. Generating operational approval, rejection, or go/no-go decisions.
7. Claiming that an unvalidated variable, scale, field, or profile is validated.
8. Generating AI-based safety advice or control recommendations.
9. Converting statistical outputs into automatic scientific conclusions.
10. Replacing expert interpretation with software-generated judgement.

These prohibitions must be enforced in:

- source code;
- user-interface labels;
- help text;
- reports;
- exported JSON and CSV;
- tests;
- demonstration data;
- documentation;
- charts and dashboards.

---

## 3. Terminology rules

### 3.1 Permitted terminology

Use terminology that describes measurement, characterisation, agreement, usability, or research status, for example:

- field response;
- evaluator rating;
- task characterisation;
- domain profile;
- domain summary;
- control-layer completeness profile;
- ergonomic contribution to release-scenario plausibility;
- agreement statistic;
- candidate indicator;
- research prototype;
- experimental instrument;
- pending validation;
- Phase 0 result.

### 3.2 Prohibited or restricted terminology

The following labels must not appear in the interface, output files, or code-generated reports unless quoted in a warning explaining that the platform does not provide them:

- risk score;
- biological risk score;
- hazard score;
- severity score;
- safety score;
- residual risk;
- BSL recommendation;
- containment recommendation;
- approved;
- safe;
- unsafe;
- compliant;
- non-compliant;
- pass;
- fail;
- acceptable risk;
- validated indicator, unless formal validation has been completed and documented.

### 3.3 Use of the word “score”

For DPF Instrument v1.0, no substantive six-field response may be described as a score.

For future instrument versions, the word `score` may only be used when:

- the governing instrument specification explicitly defines the variable as a score;
- the Variable Dictionary defines its exact calculation;
- the validation status is shown alongside it;
- the display makes clear that it is not a biological-risk score.

Where possible, prefer `profile`, `rating`, `summary`, or `characterisation`.

---

## 4. Source-of-truth hierarchy

Before implementing or modifying any feature, Codex or a human developer must read all governing documents in `specifications/`.

The following rules apply:

1. `PROMPT_MASTER.md` governs process, scientific limits, privacy, sign-off, and definition of done.
2. `implementation-plan.md` governs scope, repository structure, statistical-correctness gates, and open methodological questions.
3. `phase-b-design.md` governs current data model, navigation, components, storage schema, and demonstration content.
4. `DPF_INSTRUMENT_SPEC_v1.md` governs DPF Instrument v1.0 fields, prompts, scales, variables, and permitted outputs.
5. `DPF_VARIABLE_DICTIONARY.md` is the authoritative source for variable names, data types, value sets, definitions, and calculation rules.
6. `DPF_VALIDATION_PROTOCOL.md` governs validation stages, gate criteria, and interpretation responsibilities.
7. `DPF_INSTRUMENT_ROADMAP_v2.md` describes future work only and must not be treated as a current implementation backlog.
8. `DPF_INSTRUMENT_SPEC_v1_1.md` governs DPF Instrument v1.1 structured-observation model.
9. `DPF_STRUCTURED_RESPONSE_SPEC.md` governs provisional taxonomies, observation entry UI, and v1.1 export format.
10. `CODING_RULES.md` (this document) governs engineering implementation. Subordinate to all scientific specifications above but mandatory for implementation.
11. `DPF_INSTRUMENT_ROADMAP_v2_REVIEWERS.md` is for editorial/reviewer purposes only and must not be treated as an implementation specification.

When two documents disagree:

- do not guess;
- do not silently choose one;
- do not create a compromise implementation;
- record the conflict in `DESIGN_REVIEW.md` or the active issue log;
- stop implementation of the affected feature until the conflict is resolved.

---

## 5. Instrument-version isolation

### 5.1 Current platform

DPF-RP v1.1 can execute studies using **DPF Instrument v1.0** (narrative response model) or **DPF Instrument v1.1** (narrative + structured observation model). The instrument version is set at study configuration time and must remain constant within each round. The platform must record the instrument version in every session export and must not mix v1.0 and v1.1 sessions within the same primary analysis round without explicit research-team authorisation.

DPF Instrument v1.0 is specified in `DPF_INSTRUMENT_SPEC_v1.md`.  
DPF Instrument v1.1 is specified in `DPF_INSTRUMENT_SPEC_v1_1.md` and `DPF_STRUCTURED_RESPONSE_SPEC.md`.  
The provisional taxonomy version in v1.1 is `0.1-exploratory` and must be displayed as such in any screen where taxonomy categories appear.

No v2.0 variable, scale, domain profile, structured subscale, or derived value may be introduced unless the governing documents explicitly authorise it.

### 5.2 Future features

Features described in `DPF_INSTRUMENT_ROADMAP_v2.md` must be:

- marked as future work;
- isolated from production code;
- excluded from the current user interface;
- excluded from the current data schema;
- excluded from current exports;
- excluded from current statistical displays;
- excluded from demo datasets presented as v1.0-compatible.

Design notes or disabled prototypes must not be merged into the production branch unless explicitly authorised.

### 5.3 Version metadata

Every evaluation export must preserve:

- platform version;
- instrument version;
- framework version;
- scenario version;
- per-field definition versions, where specified.

Version values must be copied into the session record at session start and must not change retroactively.

---

## 6. Variable-definition rules

1. No variable may be created unless it is defined in `DPF_VARIABLE_DICTIONARY.md`.
2. Variable names must match the dictionary exactly, including case and prefix.
3. Data types must match the dictionary exactly.
4. Permitted values and scale anchors must match the dictionary exactly.
5. Required/optional status must match the instrument specification.
6. Conditional requirements must be enforced exactly as defined.
7. Derived variables may only be computed using the documented formula.
8. Undefined default values are prohibited.
9. Missing data must remain missing; it must not be converted to zero, false, or a substantive category unless explicitly specified.
10. Changes to a variable require, before code changes:
   - an update to the Variable Dictionary;
   - an instrument-version decision;
   - a migration or compatibility decision;
   - updated tests.

If a requested variable does not exist in the dictionary, implementation must stop and report: `MISSING VARIABLE DEFINITION`.

---

## 7. Prompt and scale integrity

Evaluator-facing prompt text and scale anchors are scientific instrument content.

Therefore:

- prompts must be implemented verbatim where the specification requires verbatim wording;
- punctuation, ordering, labels, and anchor meanings must not be paraphrased for convenience;
- RTLX and SUS wording must not be adapted to laboratory language unless the specification explicitly permits it;
- scale direction must not be reversed;
- labels must not be shortened if shortening changes meaning;
- accessibility text must preserve the same scientific meaning as visible text;
- translations require a separately approved translated instrument version and must not be generated ad hoc in code.

Any substantive prompt change is an instrument change, not a cosmetic interface change.

---

## 8. Statistical-computation rules

### 8.1 General

Every statistical output must be:

- defined in the specifications;
- reproducible;
- covered by automated tests;
- labelled with the sample size used;
- explicit about missing-data exclusions;
- exportable for independent verification.

### 8.2 Agreement statistics

The platform may compute only those agreement statistics explicitly authorised for the active instrument version.

For each statistic, the implementation must document:

- unit of analysis;
- raters included;
- ratings included;
- exclusion rules;
- weighting method, if any;
- treatment of insufficient-information flags;
- treatment of missing values;
- rounding policy;
- interpretation band source.

### 8.3 No automatic gate decisions

The platform may display:

- Cohen’s κ;
- Fleiss’ κ;
- percent agreement;
- I-CVI;
- S-CVI/Ave;
- SUS;
- RTLX;
- other metrics explicitly permitted by the specifications.

The platform must not automatically state that a field, phase, instrument, or hypothesis has:

- passed;
- failed;
- been accepted;
- been rejected;
- been validated;
- been invalidated.

Thresholds may be displayed as protocol references, but interpretation and decisions belong to the research team.

### 8.4 Independent verification

All computed statistics must be reproducible from exported data. The platform must not store only final values when the underlying analysable variables are available.

---

## 9. Data model and compatibility

### 9.1 Append-only scientific records

Completed evaluations must be treated as immutable research records.

Permitted actions:

- view;
- export;
- duplicate into a new revision where authorised;
- flag as excluded without deleting the original record.

Prohibited actions:

- silently overwrite a completed response;
- retroactively apply a new field definition;
- modify scenario content without incrementing its version;
- recalculate historical outputs using a new undocumented algorithm.

### 9.2 Schema compatibility

Every exported file must include a schema version.

Import logic must:

- validate the schema before ingestion;
- reject incompatible files with an explicit reason;
- never coerce unknown variables silently;
- preserve unknown but valid forward-compatible fields when possible;
- identify instrument-version mismatches;
- prevent statistical aggregation across incompatible instrument definitions unless an explicit compatibility rule exists.

### 9.3 Merging datasets

Dataset merge operations must:

- preserve source-file identity through a non-identifying import identifier;
- detect duplicate evaluations;
- detect duplicate evaluator-scenario combinations where relevant;
- preserve scenario and instrument versions;
- report exclusions and conflicts;
- never overwrite one imported record with another;
- generate an auditable merge log.

---

## 10. Privacy and pseudonymisation

The platform is local-first and must minimise personal data collection.

### 10.1 Prohibited personal data

The platform must not request or require:

- real names;
- email addresses;
- institutional identifiers traceable to a person;
- employee numbers;
- IP addresses;
- location data;
- device fingerprints;
- authentication-provider identities;
- hidden analytics identifiers.

### 10.2 Pseudonyms

Evaluator pseudonyms must be user- or protocol-defined and must not be automatically derived from personal information.

The platform must display a clear warning that pseudonyms must not contain a real name, email address, or traceable identifier.

### 10.3 Telemetry

No telemetry, analytics, remote logging, third-party tracking, or cloud synchronisation may be added without explicit scientific, legal, and privacy approval.

### 10.4 Local storage

Local storage keys must be namespaced and versioned. Sensitive research data must not be mixed with unrelated application preferences.

The application must provide a clear method to:

- export data;
- delete local study data;
- distinguish deletion of local data from deletion of exported files;
- warn users before irreversible deletion.

---

## 11. Security rules

1. Treat imported JSON and CSV as untrusted input.
2. Validate file type, structure, size, schema, and permitted values.
3. Escape all user-provided text before rendering.
4. Do not render imported HTML.
5. Prevent script execution through text fields or imported files.
6. Do not use `eval`, dynamic function construction, or equivalent unsafe parsing.
7. Do not transmit research data externally.
8. Do not embed secrets, tokens, private URLs, or credentials in source code.
9. Use dependency versions that are pinned or lockfile-controlled.
10. Record security-relevant dependency changes in the changelog.
11. Reject corrupted or partially valid imports rather than partially ingesting them silently.
12. Keep error messages informative without exposing internal paths, stack traces, or sensitive data in the normal interface.

---

## 12. User-interface rules

### 12.1 Neutral presentation

The interface must remain neutral and research-oriented.

Do not use:

- red/amber/green risk status systems;
- warning triangles to represent high domain ratings;
- shield icons implying certified safety;
- approval stamps;
- language implying that higher or lower values are automatically good or bad;
- ranking of laboratories, evaluators, or scenarios.

### 12.2 Required context

Where a structured rating or statistic is displayed, include sufficient context to prevent misinterpretation, such as:

- variable name;
- scale range;
- anchor definitions or accessible help;
- sample size;
- instrument version;
- validation status where relevant.

### 12.3 Optional narrative

When a narrative field is optional, the interface must not create pressure to complete it through misleading validation messages. When narrative is required, the requirement must be explicit.

### 12.4 Confirmation messages

Confirmation messages must describe actions, not scientific conclusions.

Acceptable:

> Evaluation saved locally.

Not acceptable:

> Assessment successfully validated.

---

## 13. Accessibility rules

The platform must meet WCAG 2.2 AA as a development target.

At minimum:

- all functions must be keyboard accessible;
- focus order must follow the logical task sequence;
- focus must remain visible;
- labels must be programmatically associated with controls;
- instructions must not rely on colour alone;
- validation errors must identify the affected field and corrective action;
- scale controls must expose values and anchors to assistive technologies;
- charts must have text alternatives or data tables;
- modal dialogs must trap and restore focus correctly;
- responsive behaviour must preserve functionality and readability;
- touch targets must be adequately sized;
- session timers must not impose automatic time limits.

Accessibility changes must not paraphrase or alter scientific prompt wording.

---

## 14. Testing requirements

No feature is complete without tests appropriate to its scientific and technical significance.

### 14.1 Mandatory test categories

- unit tests for calculations;
- schema-validation tests;
- import/export round-trip tests;
- missing-data tests;
- invalid-value tests;
- version-compatibility tests;
- duplicate-detection tests;
- persistence tests;
- accessibility checks;
- end-to-end evaluator workflow tests;
- end-to-end administrator merge workflow tests;
- regression tests for every corrected scientific or statistical defect.

### 14.2 Statistical golden tests

Statistical functions must be verified against fixed reference datasets with independently calculated expected outputs.

Tests must cover:

- perfect agreement;
- no agreement;
- missing ratings;
- insufficient-information exclusions;
- two-rater and multi-rater cases;
- categories with no observations;
- degenerate distributions;
- incompatible instrument versions.

### 14.3 Prohibited testing shortcuts

Do not:

- weaken assertions to make a failing test pass;
- replace exact expected values with broad tolerances without justification;
- delete a failing test without documenting why the requirement changed;
- mock the calculation under test;
- claim completion when mandatory test suites are failing.

---

## 15. Change-control rules

### 15.1 Scientific versus engineering changes

A change is scientific when it alters:

- a field definition;
- prompt wording;
- scale anchors;
- required/optional status;
- variable meaning;
- permitted values;
- calculation method;
- missing-data treatment;
- interpretation wording;
- validation status.

Scientific changes require prior specification updates and version review.

An engineering change may alter:

- layout;
- component organisation;
- internal code structure;
- performance;
- non-substantive styling;
- build configuration;
- test architecture;

provided it does not alter scientific behaviour or exported data.

### 15.2 Change log

Every release must document:

- platform version;
- instrument version implemented;
- schema version;
- scientific changes;
- engineering changes;
- migration impact;
- backward-compatibility impact;
- known limitations.

### 15.3 Breaking changes

A breaking data change requires:

- a new schema version;
- migration rules or an explicit statement that migration is unsupported;
- compatibility tests;
- updated examples;
- updated documentation;
- review of whether the instrument version must change.

---

## 16. Coding quality rules

1. Use explicit types wherever the language supports them.
2. Avoid implicit coercion for scientific variables.
3. Keep statistical functions pure and isolated from interface code.
4. Keep schema validation separate from business logic.
5. Use named constants for scale bounds and categorical values.
6. Do not duplicate instrument prompts or scale anchors across components; load them from a single authoritative configuration derived from the specification.
7. Do not hard-code version strings in multiple locations.
8. Use deterministic calculations.
9. Document every non-obvious statistical or data-compatibility decision.
10. Fail explicitly when a required definition is absent.
11. Avoid speculative abstractions for unapproved future versions.
12. Remove dead code and experimental branches before release.
13. Keep demonstration data separate from production study data.
14. Ensure build artefacts are reproducible from the repository.

---

## 17. AI and automated assistance

Automated coding assistance may be used to implement the platform, but must not be used to generate scientific conclusions or safety advice.

AI-generated code must:

- follow the same review and testing requirements as human-written code;
- not introduce variables or calculations absent from the specifications;
- not rewrite instrument prompts;
- not infer missing methodology;
- not generate biological-risk interpretations;
- not generate BSL recommendations;
- not add external services or telemetry without approval.

Any proposed feature that depends on natural-language classification, automated interpretation of narrative responses, or machine-learning prediction must be treated as out of scope unless separately specified and approved.

---

## 18. Repository and release rules

The repository must not include:

- personal data;
- real institutional data;
- identifiable evaluator data;
- secrets or credentials;
- production study datasets;
- unlicensed third-party content;
- build caches;
- dependency directories such as `node_modules/`;
- temporary exports;
- local development settings containing personal paths.

A release candidate must include:

- source code;
- lockfile;
- build instructions;
- test instructions;
- supported-browser statement;
- instrument version;
- schema version;
- changelog;
- licence;
- disclaimer;
- citation information;
- demonstration data containing fictional scenarios only.

---

## 19. Required warnings and disclaimers

The following meaning must be visible in the application and documentation, although exact placement may vary:

> DPF-RP is a research platform implementing the Delivered Protection Framework. It does not calculate biological risk, assign biosafety levels, issue containment recommendations, certify compliance, or replace institutional biosafety assessment. Outputs require interpretation by the research team and appropriately qualified professionals.

Where v1.0 is used, also state:

> DPF Instrument v1.0 is undergoing Phase 0 content-validation and reliability evaluation. Its fields, ratings, and candidate indicators must not be described as validated measures until the pre-specified validation programme has been completed.

---

## 20. Stop conditions

Implementation must stop and the issue must be reported when any of the following occurs:

1. A requested variable is absent from the Variable Dictionary.
2. Two governing documents define the same variable differently.
3. A requested feature would calculate or imply biological risk.
4. A requested feature would assign or recommend BSL.
5. A requested feature belongs to v2.0 but is being requested for v1.0.
6. A calculation lacks an explicit formula or missing-data rule.
7. A prompt change would alter scientific meaning.
8. A schema change lacks a versioning decision.
9. A mandatory sign-off item remains unresolved.
10. Imported or merged data cannot be shown to be compatible.
11. Legal, privacy, or security requirements are unclear.
12. A test reveals a potential scientific-validity defect.

Codex must report the issue clearly, identify the affected documents or variables, explain why it is blocking, and avoid implementing a provisional workaround.

---

## 21. Definition of implementation compliance

An implementation complies with these Coding Rules only when:

- it implements the active instrument version and no future version features;
- every variable matches the Variable Dictionary;
- all scientific limits are enforced in the interface, calculations, and exports;
- all statistical outputs are reproducible and tested;
- no automated scientific decision is produced;
- version and schema metadata are preserved;
- privacy and local-first constraints are respected;
- accessibility requirements are met to the stated target;
- all mandatory tests pass;
- documentation and disclaimers match actual platform behaviour;
- no unresolved blocking inconsistency remains.

Code that runs but violates any of these conditions is not complete.

---

## 22. Instruction to Codex

Before modifying code, Codex must:

1. Read this document and all governing specifications in full.
2. State which instrument version and schema version are being implemented.
3. Identify the authoritative variable definitions relevant to the task.
4. Check whether the requested feature is current scope or future roadmap.
5. Check whether the task affects scientific behaviour, data compatibility, privacy, or statistical correctness.
6. Stop and report any blocking conflict before writing code.

During implementation, Codex must:

- make the smallest change that fully satisfies the approved requirement;
- preserve all existing scientific constraints;
- add or update tests;
- update documentation when behaviour changes;
- avoid unrelated refactoring unless necessary for correctness.

After implementation, Codex must report:

- files changed;
- behaviour implemented;
- tests added or updated;
- test results;
- schema or compatibility impact;
- any unresolved limitation;
- confirmation that no biological-risk, BSL, regulatory, or automatic-decision feature was introduced.
