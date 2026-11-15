# GitHub Pages deployment

1. Create a public GitHub repository and upload this source tree, including
   `.github/`. Do not upload node_modules, local evaluations, credentials or caches.
2. If the repository name differs from `dpf-research-toolkit`, change
   the base path in `vite.config.ts` and both local URLs in `playwright.config.ts`.
   For an owner.github.io repository use `/`.
3. In Settings > Pages select GitHub Actions as the build source.
4. Push to `main` or run Deploy Pages manually from the Actions tab.
5. Wait for CI and deployment to succeed. Open the URL from the deployment,
   check the landing page, administrator and evaluator routes, and reload a
   hash route. Add the URL to the repository About section and README.
6. Complete CITATION.cff with the verified authors and repository URL, then tag
   the reviewed commit and create a GitHub Release.

The workflow checks types, unit tests, lint and browser/accessibility tests
before deploying `dist/`. GitHub Pages serves the browser application; GitHub
stores the source and release history. No external archive is required by this
distribution plan.

Evaluation data remain in browser local storage. A different site origin gets
separate storage; export backups before moving to another address.

Historical implementation reports in the root describe earlier development
states. Their recorded checks are historical and do not establish that this
snapshot passes current validation. Current scientific limitations remain in
SCIENTIFIC_CONSTRAINTS.md and docs/research-use-limitations.md.
