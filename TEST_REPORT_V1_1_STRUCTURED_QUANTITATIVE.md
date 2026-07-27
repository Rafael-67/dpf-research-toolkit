# DPF-RP v1.1 structured-quantitative test report

**Date:** 23 July 2026  
**Data schema:** `1.2`  
**Candidate taxonomy:** `0.1-exploratory`

| Check                                              | Result                |
| -------------------------------------------------- | --------------------- |
| TypeScript project build (`tsc -b --pretty false`) | Passed                |
| ESLint (`eslint . --max-warnings 0`)               | Passed                |
| Unit/integration tests                             | 42 passed in 14 files |
| Playwright browser/accessibility tests             | 15 passed             |
| Vite production build                              | Passed                |
| JSON Schema generation                             | Passed                |

Total automated tests: **57 passed**.

The production build emits a non-blocking Rollup chunk-size warning for one
bundle above 500 kB. It does not affect correctness and no functionality was
removed to suppress it.

Regression scope includes historical narrative import compatibility, version
locking, persistence, merge behaviour, existing CSV output, and the single
structured-hybrid browser entry point. Coverage verifies canonical schema 1.2
observations, independent ratings, nested selections, normalised rows,
non-decisional consistency messages, structured descriptives, Jaccard/exact
comparison, ordinal differences, weighted kappa, Krippendorff alpha, ICC,
single-instrument demo configuration and study-record safeguards.
