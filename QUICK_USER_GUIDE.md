# DPF-RP Brief User Guide

## Purpose

The Delivered Protection Framework Research Platform (DPF-RP) is a
browser-based research prototype for Phase 0 content and usability evaluation
of a six-field conceptual framework. It allows fictional task scenarios to be
organised into studies and rounds, independently reviewed by evaluators, and
summarised descriptively for research-method development.

DPF-RP does **not** calculate biological risk, Delivered Protection, residual
risk or biosafety/containment levels. It does not validate a procedure or make
operational safety recommendations. The included scenarios are fictional
demonstrations, not protocols or safety guidance.

## Fastest way to open it

1. Download `DPF-RP-PORTABLE-PEER-REVIEW.zip` from the repository.
2. Extract the complete ZIP to a normal folder.
3. Open `OPEN_DPF_RP.html` in a current version of Chrome, Edge or Firefox.

No account, installation, Node.js, npm, database or application server is
required. Do not use **Full repo ZIP** for this route; that option downloads the
complete source repository for optional technical review.

## Main areas

### Administrator

Use Administrator mode to inspect or create studies, rounds and fictional
scenarios; assign scenarios to rounds; lock rounds; import exported evaluator
sessions; examine descriptive summaries; and export study or merged datasets.

For a quick review, open the included demonstration study and inspect its round
and the five fictional reference scenarios E1-E5. Creating a new study is not
necessary unless the reviewer specifically wants to test administration.

### Evaluator

Use Evaluator mode to complete the structured assessment workflow:

1. Enter a fictional or study-issued pseudonym — never a real name or
   institutional identifier.
2. Select the demonstration study, round and assigned scenario.
3. Work through F1-F6 one field at a time.
4. Save or continue the draft, review the responses, and complete the closing
   workload/usability questions.
5. Complete the session and export it if the file-transfer workflow is being
   tested.

Drafts are retained locally in the same browser. Completed sessions are treated
as immutable records.

### Scientific Dashboard

The dashboard displays study progress, completeness, session status,
structured-category frequencies and descriptive agreement outputs. Agreement
statistics require suitable completed sessions; locked-round summaries are
descriptive and do not automatically accept, reject or validate a field or the
framework.

### Supporting Documents and About / Manifest

Supporting Documents records versioned methodological material and review
issues. About / Manifest reports the implemented versions, scientific
boundaries and scenario-set policy, and provides local backup, restore and
reproducibility-package functions.

## The six fields

| Field | Focus                                        |
| ----- | -------------------------------------------- |
| F1    | Critical task                                |
| F2    | Physical and cognitive performance demands   |
| F3    | Biological hazard / release consequence      |
| F4    | Critical vector / material                   |
| F5    | Integrated control strategy                  |
| F6    | Candidate performance-degradation indicators |

The fields support structured observation and concise expert reasoning. They do
not constitute a numerical risk-scoring algorithm.

## Suggested 10-minute reviewer walkthrough

1. Open the portable application and select **Administrator**.
2. Inspect the demonstration study, its round and scenarios E1-E5.
3. Select **Evaluator**, enter a fictional pseudonym and open one scenario.
4. Enter sample responses in F1-F2 and confirm that the draft can be resumed.
5. Continue through F3-F6, review the response and inspect the closing survey.
6. Open **Scientific Dashboard** to view the descriptive interface.
7. Open **About / Manifest** to confirm versions, limitations and local-data
   controls.

Reviewers do not need to complete every scenario to verify the main workflow.

## Data, privacy and reset

- Application records remain in the current browser's local storage unless the
  user explicitly exports a file.
- There is no telemetry, cloud authentication or central application database.
- Use only fictional demonstration information. Do not enter real personal,
  institutional, laboratory, protocol, biological-agent or incident data.
- JSON and CSV files are transferred only through explicit user export/import.
- To start with a separate clean state, use a private browsing window.
- The application's delete/reset controls permanently remove the corresponding
  locally stored records. Export a backup first if anything must be retained.

## Repository contents

The portable ZIP is the recommended functional-review route. The remaining
repository files support optional technical and reproducibility review:

- `src/` — complete application source code.
- `data/` — fictional scenarios and study configurations.
- `tests/` — automated unit, integration, accessibility and browser tests.
- `specifications/` — versioned technical and research specifications.
- `docs/` — methodology, privacy, deployment and research-use documentation.
- `scripts/` — validation, schema and reproducibility utilities.
- `ARCHITECTURE.md`, `DATA_SCHEMA.md` and `SCIENTIFIC_CONSTRAINTS.md` — detailed
  architecture, data-model and scientific-scope documentation.

The portable package and the source-code repository represent the same reviewed
application.

## Troubleshooting

- Extract the entire portable ZIP before opening `OPEN_DPF_RP.html`; do not
  open it from inside the compressed-file preview.
- Use an up-to-date version of Chrome, Edge or Firefox.
- If the browser asks for confirmation before opening a local file, confirm the
  action. The portable package does not install a native executable.
- Source-code execution and automated tests are optional and are documented in
  `README.md`.
