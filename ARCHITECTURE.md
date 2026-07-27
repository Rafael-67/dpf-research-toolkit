# DPF-RP Architecture

| Layer              | Version | Responsibility                                                                               |
| ------------------ | ------: | -------------------------------------------------------------------------------------------- |
| DPF-RP Core        |     1.1 | F1–F6, candidate taxonomies, coding rules, scenario classes, measurement and immutability    |
| DPF-RP Platform    |   1.2.0 | Interface, navigation, local persistence, exchange, reports, dashboard, documents and Issues |
| DPF-RP Data Schema |     1.1 | Validation, compatibility, migrations and integrity                                          |

DPF-RP is a static offline React/TypeScript platform. Scientific domain code
is under `src/domain` and `src/framework`; storage adapters under
`src/storage`; dashboard services under `src/dashboard`; UI under `src/modes`.
No backend, telemetry or external scientific-data service exists.

The Knowledge Layer is the versioned, read-only combination of definitions,
coding guidance, taxonomies and methodological resources. Consensus Record is
reserved as a future separate outcome of explicit expert reconciliation; it
must never overwrite independent evaluations. The earlier local consensus
prototype is not extended by Phase 0.
