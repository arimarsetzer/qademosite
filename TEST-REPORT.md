# Test Execution Report

## Summary (final run: `npm test`)

| Metric         | Value                                                                                                                                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Total tests    | 23                                                                                                                                                                                                                                                                                  |
| Passed         | 21                                                                                                                                                                                                                                                                                  |
| Failed         | 0                                                                                                                                                                                                                                                                                   |
| Skipped        | 2 (known defects [DEF-002](DEFECTS.md#def-002--date-of-birth-in-the-confirmation-modal-is-missing-a-space-after-the-comma) and [DEF-003](DEFECTS.md#def-003--close-button-of-the-practice-form-confirmation-modal-throws-and-does-not-close-it); Cypress reports them as "pending") |
| Browser        | Chrome 153 (headless)                                                                                                                                                                                                                                                               |
| OS             | Windows 10 Home 10.0.19045                                                                                                                                                                                                                                                          |
| Cypress / Node | 16.1.0 / 24.11.0                                                                                                                                                                                                                                                                    |
| Duration       | 30 s of test time, about 54 s wall-clock including browser start                                                                                                                                                                                                                    |
| Retries        | Off (`runMode: 0`). Nothing passed on a retry.                                                                                                                                                                                                                                      |
| Date           | 2026-09-24, against https://demoqa.com                                                                                                                                                                                                                                              |

| Spec                            | Tests | Passed | Skipped | Time |
| ------------------------------- | ----- | ------ | ------- | ---- |
| `dialogs/alerts.cy.js`          | 6     | 6      | 0       | 7 s  |
| `dialogs/modal-dialogs.cy.js`   | 3     | 3      | 0       | 3 s  |
| `forms/practice-form.cy.js`     | 9     | 7      | 2       | 12 s |
| `selections/checkbox.cy.js`     | 3     | 3      | 0       | 4 s  |
| `selections/radio-button.cy.js` | 2     | 2      | 0       | 2 s  |

## Stability

The finished suite was run **5 times without code changes**: 3 × Electron 146 headless back-to-back, 1 × Chrome 153 headed, 1 × Chrome 153 headless. **All 5 runs had the same result (21 passed, 2 skipped), with no failures and no retries.** Per-test times varied by less than 1 s between runs.

After the page-object refactor (shared `exactText` helper, selectors moved out of specs) and adding ESLint and Prettier, the suite was run again in Chrome headless with the same result. `npm run lint` and `npm run format:check` pass. The full output of that run is in [docs/evidence/run-summary.txt](docs/evidence/run-summary.txt).

## Known limitations

- **Public, third-party site.** There is no SLA and no control over deploys. DemoQA was recently rebuilt (Vite SPA; the Check Box page moved to `rc-tree`), and another rebuild could break selectors. They are all in `cypress/pages/`, so each one only needs fixing in one place.
- **Ads and trackers are blocked** (`blockHosts`). Tests check the application, not ad slots. Layout issues caused by ads would not be caught.
- **Native dialogs are stubbed.** Cypress cannot drive a real `alert`/`confirm`/`prompt`. The tests check the message text and the page's reaction to each answer, not how the browser draws the dialog.
- **`minlength` on Mobile isn't automated.** The browser only enforces it after real user edits, not values typed by Cypress. A test would prove nothing, so it's left for manual checking.
- Tested on Windows with Chrome and Electron only. Firefox and WebKit were not run.

## Observed flakiness and how it's handled

| Observation                                                                                                            | Source                           | Handling in the suite                                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heavy ad/tracking scripts (Google Publisher Tag/DoubleClick, Criteo, OpenX, ID5, …) slow page loads and inject iframes | Environment                      | Blocked via `blockHosts`; `pageLoadTimeout: 60s`. The `uncaught:exception` handler ignores only non-DemoQA errors, so real app errors still fail tests (that is how DEF-003 was caught). |
| Pressing Enter in the Subjects autocomplete submitted the form before a suggestion was picked (exploration)            | Test timing, and possibly app UX | `addSubject()` waits for the suggestion to be visible and clicks it; the suite never presses Enter there.                                                                                |
| Clicking expand arrows quickly while `rc-tree` animates collapsed a node again                                         | Test                             | `expand()` waits for `aria-expanded="true"` before the next step.                                                                                                                        |
| Validation border colours animate, so a mid-transition colour was read                                                 | Test                             | Assertions use `:valid`/`:invalid` and the form's `was-validated` class, never colours.                                                                                                  |
| The delayed alert takes 5 s                                                                                            | Test design                      | `cy.clock()` + `cy.tick()`: checked at 4999 ms (not shown) and at 5000 ms (shown), with no real waiting.                                                                                 |
| Date of Birth defaults to today                                                                                        | Test data                        | Tests always set a fixed date and never assert the default.                                                                                                                              |
| `ELECTRON_RUN_AS_NODE=1` inherited from VS Code terminals stops Cypress from starting                                  | Local environment                | Documented in the README troubleshooting section.                                                                                                                                        |

The suite contains no `cy.wait(<ms>)`.

## How failures were investigated

The first run had 22 tests: 19 passed, 2 failed, 1 skipped (DEF-002). Each failure was traced to its cause before changing anything:

1. **Check Box, "unchecking one child…":** a `Select Word File` element was never found. The failure screenshot showed the leaf labels are `Word File.doc` / `Excel File.doc`. **Test bug**, fixed in the spec.
2. **Practice Form, "fully filled form":** every value was asserted correctly, then clicking **Close** raised `TypeError: Lr.findDOMNode is not a function` from DemoQA's bundle. A separate diagnostic run showed the modal **stays open** (2/2 clicks) while Esc and backdrop clicks still work. **Application defect**, filed as DEF-003. The flow test now stops at asserting values, and closing via the button is a skipped known-defect test.
3. Both known-defect tests were temporarily un-skipped to confirm they **fail for the documented reason** (text mismatch and `findDOMNode`), then restored to skipped.

## CI/CD recommendations

- **GitHub Actions:** `.github/workflows/e2e.yml` runs on push to `main` and manually (the `cli` input can replace the test command). It installs, lints, checks formatting, runs `npm test` in Chrome, publishes the JUnit results as a GitHub check and job summary, and uploads the JUnit XML and failure screenshots (kept 14 days). _The workflow has not yet been run on GitHub. Lint, format check and suite were checked locally._
- **Pull requests:** add a `pull_request` trigger so every change is checked before it merges, not only after it reaches `main`.
- **Suites:**
  - A smoke subset (full form submit, Check Box root, radio switch, confirm OK, small modal; about 15 s) on every pull request.
  - The full regression suite on merge and nightly, since the site can change without notice.
- **Tagging:** add `@cypress/grep` with `@smoke`, `@regression` and `@known-defect` tags instead of path-based selection once the suite grows.
- **Parallelisation:** not worth it at about 30 s. Beyond about 5 minutes, split by spec with a CI matrix or Cypress Cloud load balancing.
- **Test data:** keep fixtures in git and deterministic; no shared state between tests. If a stateful area is added later (e.g. Book Store), create and clean up data through the API, not the UI.
- **Artifacts and reporting:** JUnit XML is already generated and published as a GitHub check. Next steps: feed the same XML into a test-analytics tool to track flake rate and duration trends across runs, and keep screenshots (and optional videos) only on failure to save minutes.
- **Retries:** keep them at 0. If CI needs `runMode: 1`, treat every "passed on retry" as a flake ticket with an owner, not as a pass.
- **Maintenance:**
  - Review selectors when DemoQA ships a new bundle; the asset hash in `index-*.js` is a cheap change signal.
  - Un-skip `DEF-*` tests when the defects are fixed.
  - Keep assertions in specs and selectors in page objects.

## Metrics I would track

| Metric                                                                             | Why it matters                                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Pass rate per run and per spec                                                     | Overall health; a drop in one spec points to the area that changed                    |
| Flake rate (tests that pass only on a rerun, or change result with no code change) | The main measure of whether people can trust the suite; each flaky test gets an owner |
| Suite duration (median and 95th percentile)                                        | Keeps feedback on pull requests fast; tells you when to parallelise                   |
| Time from a failure to its triage (test bug, app defect, environment)              | Shows whether failures are read or ignored                                            |
| Defects found by automation, and their severity                                    | Shows the value the suite adds                                                        |
| Known-defect tests (`DEF-*`) still skipped, and for how long                       | Makes sure known bugs are followed up, not forgotten                                  |
