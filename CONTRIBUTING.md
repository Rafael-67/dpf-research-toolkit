# Contributing

Changes should preserve the scientific and privacy constraints in `specifications/`.

1. Work on a feature branch and keep each change narrowly scoped.
2. Never add real personal, institutional, agent, protocol, or incident data.
3. Add tests for changed behavior and statistical fixtures for changed calculations.
4. Run `pnpm run typecheck`, `pnpm test`, `pnpm run lint`, `pnpm run format`, and `pnpm run build`.
5. Explain methodological, schema, compatibility, privacy, and accessibility effects in the pull request.

Scientific scope or data-model changes require research-team review. Security issues should follow `SECURITY.md`, not a public issue.
