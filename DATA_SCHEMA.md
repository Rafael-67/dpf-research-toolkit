# DPF-RP Data Schema 1.1

Collections use `dpft:<kind>:<id>` and remain independent: studies,
institutions, evaluators, rounds, scenarios, evaluations, documents, document
links, Issues, Issue history, audit and schema migrations. Compatible
`taxonomyItemRatings` remain in the scientific session payload.

Scientific states are `draft`, `in_progress`, `in_review`, `completed`,
`locked`, `abandoned` and `excluded`. Historical governance states remain
readable through an adapter. Migration maps only `not_started` to `draft` and
never maps `abandoned` to `excluded`.

Every new session snapshots scenario ID/version/class, Core, Schema, taxonomy,
field definitions, taxonomy item identifiers and supporting-document
versions/checksums. A started session cannot change that snapshot.

E1–E5 remain `reference`. ORG-01 and INC-01 are exploratory
`research-extension` scenarios outside the primary reference set.
