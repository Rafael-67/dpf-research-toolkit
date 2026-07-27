# Migration Guide

`simulateSessionMigration` performs an idempotent dry run on a deep copy. It
retains the complete original, records source and target schema versions,
derives an anonymized Institution only when a legacy code exists, and reports
warnings.

1. Export and retain the original.
2. Validate without changing storage.
3. Simulate on a copy.
4. Compare responses, observations and taxonomy ratings.
5. Review references and warnings.
6. Persist only after explicit human authorization.

No destructive Phase 0 schema migration executes automatically.
`abandoned` remains `abandoned`; `locked` and `excluded` are never inferred
without explicit evidence.
