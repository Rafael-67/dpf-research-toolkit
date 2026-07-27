# Deployment

## Anonymous peer review (anonymous.4open.science)

1. Create a dedicated private source repository containing this release candidate; do not upload `node_modules`, test results, local caches, `.env` files, real evaluations, or identifiable manuscripts.
2. Run `pnpm install --frozen-lockfile`, `pnpm schemas`, `pnpm audit:anonymity`, `pnpm run typecheck`, `pnpm test`, `pnpm run lint`, `pnpm run format`, and `pnpm run build`.
3. Inspect the repository manually at text and metadata level. The automated scan does not inspect binary Office/PDF metadata or Git history. The anonymous candidate must use neutral citation metadata and contain no author names, affiliations, personal emails, access tokens, private URLs, acknowledgements, local user paths, or original identifying Git history.
4. Push the reviewed commit to the private repository. In anonymous.4open.science, authenticate, choose that repository and commit/branch, set an expiry covering the review period, and create the anonymous link.
5. Open the generated link in a private browser window. Verify README rendering, source browsing, case files, schemas, installation commands, and the five E1-E5 cases.
6. Put the anonymous link in the manuscript. Do not replace anonymous metadata with author metadata until the review is over.

The service mirrors a repository for anonymous inspection; the source repository is therefore the primary upload. `dist/` is supplied only as a convenience build artifact and does not replace the auditable source.

The application is a static Vite build using hash routing. The configured GitHub Pages base is `/Delivered-Protection-Framework/`.

Local verification:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run typecheck
pnpm test
pnpm run lint
pnpm run format
pnpm run build
```

`dist/` is the deployable artifact. `.github/workflows/test.yml` runs the quality gates; `deploy-pages.yml` builds and deploys from `main` when a GitHub remote is eventually connected. For current local-only testing, run `pnpm dev --host 127.0.0.1 --port 4173` and open `http://127.0.0.1:4173/Delivered-Protection-Framework/#/`.

If the repository name changes, update `vite.config.ts`, `CITATION.cff`, this document, and any published links together.
