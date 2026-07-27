# v0.1.0-rc.2 anonymous-review release checklist

## Completed locally

- [x] Strict TypeScript check.
- [x] Unit, integration, statistical correctness, Playwright, and axe tests.
- [x] ESLint and Prettier checks.
- [x] Production build.
- [x] Hash-route hard reload and normal-use console checks in Playwright.
- [x] README and scientific/privacy/deployment documentation reflect the implementation.
- [x] MIT license and citation metadata are present.
- [x] JSON Schemas for study configuration and evaluation exports are generated.
- [x] Exactly five fictional cases (E1-E5) are present; no obsolete spill case remains.
- [x] ORG-01 and INC-01 load only through an explicit administrator action into a separate study and round.
- [x] Round and study screens resolve scenarios through explicit `RoundScenario` assignments.
- [x] The About/Manifest screen and reproducibility package expose versions, dataset hashes, scenario-set policy, and scientific boundaries.
- [x] `pnpm audit:anonymity` scans text sources for local user paths, emails, private keys, and probable tokens.
- [x] Simulated evaluation fixtures are explicitly loaded, separately registered, removable, and excluded from normal scientific exports.
- [x] Reproducibility export is a ZIP containing manifest, hashes, datasets, and package metadata.
- [x] Local backup shows a record-count preview before restoration.
- [x] Completed records are immutable and stale drafts are abandoned after 24 hours.
- [x] Contribution, conduct, security, issue, and pull-request guidance are present.

## Must be done by the uploader on anonymous.4open.science

- [ ] Run `pnpm audit:anonymity` and review its limitations.
- [ ] Create the anonymous link and select the required repository/commit.
- [ ] Confirm the rendered anonymous repository contains no names, emails, affiliations, tokens, DOI drafts, or identifying Git history.
- [ ] Run GitHub Actions from a clean remote checkout.
- [ ] Smoke-test the anonymous source view and, if used, the static `dist/` artifact.
- [ ] Obtain institutional data-protection/security approval before any real-study use.
