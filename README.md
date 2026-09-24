# qademosite

End-to-end test suite for [DemoQA](https://demoqa.com), written with Cypress and JavaScript. It covers forms, selections and dialogs with a small set of focused tests, chosen for meaningful scenarios rather than volume.

| Document                         | Contents                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| [SUMMARY.md](SUMMARY.md)         | One-page summary: approach, design decisions, trade-offs, insights                 |
| [TEST-REPORT.md](TEST-REPORT.md) | Execution results, known limitations, flakiness, CI/CD recommendations and metrics |
| [DEFECTS.md](DEFECTS.md)         | 3 reproducible defects found in DemoQA, with evidence                              |

## What is tested

| Area       | Page                                                         | Scenarios                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms      | [Practice Form](https://demoqa.com/automation-practice-form) | Full submit with every value checked in the confirmation modal; required-fields-only submit; empty submit; 3 malformed emails (data-driven); mobile number containing letters |
| Selections | [Check Box](https://demoqa.com/checkbox)                     | Checking the root checks all descendants; leaves in different branches make their parents partial; unchecking one child reverts its folder to partial                         |
| Selections | [Radio Button](https://demoqa.com/radio-button)              | Switching options keeps a single selection; the disabled option can't be selected                                                                                             |
| Dialogs    | [Alerts](https://demoqa.com/alerts)                          | Simple alert; alert after 5 s (fake timers); confirm OK / Cancel; prompt with a name / cancelled                                                                              |
| Dialogs    | [Modal Dialogs](https://demoqa.com/modal-dialogs)            | Small modal (footer Close); large modal (header ×); Escape key                                                                                                                |

**Not covered, on purpose:** the other DemoQA sections (Web Tables, Book Store, widgets, interactions, frames), visual/layout checks and ad slots. They would add test count without showing a different technique.

**Skipped tests:** the suite has 23 tests. 2 of them (`DEF-002`, `DEF-003`) are skipped on purpose: they check the correct behaviour for two confirmed DemoQA defects and fail until those are fixed. See [DEFECTS.md](DEFECTS.md). To re-check them, change `it.skip` to `it` in `cypress/e2e/forms/practice-form.cy.js`.

## Prerequisites

- **Node.js** `^20.19`, `^22.13` or `>=24` (the minimum for ESLint 10; tested on 24.11.0) and npm
- **Google Chrome**, which the main suite runs in. Without Chrome, use the Electron command below.

## Installation

```bash
npm install
```

## Running the tests

| Mode                              | Command                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------- |
| **Main suite** (headless, Chrome) | `npm test`                                                                      |
| Headed (visible Chrome window)    | `npx cypress run --headed --browser chrome`                                     |
| Without Chrome (bundled Electron) | `npx cypress run --browser electron`                                            |
| Interactive runner                | `npx cypress open --e2e`                                                        |
| One spec                          | `npx cypress run --browser chrome --spec cypress/e2e/forms/practice-form.cy.js` |

A successful run ends with `All specs passed!` and a table showing 23 tests: 21 passing and 2 pending (the skipped known-defect tests).

## Code quality

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `npm run lint`         | ESLint (recommended rules plus Cypress and Mocha rules) |
| `npm run lint:fix`     | ESLint with automatic fixes                             |
| `npm run format:check` | Checks formatting with Prettier                         |
| `npm run format`       | Formats every file with Prettier                        |

- **ESLint** (`eslint.config.mjs`) uses the flat config. Besides the recommended rules, it fails on `cy.wait(<ms>)` (`cypress/no-unnecessary-waiting`), on a forgotten `it.only` (`mocha/no-exclusive-tests`), and on duplicate test titles.
- **Prettier** (`.prettierrc.json`) owns formatting. `eslint-config-prettier` turns off ESLint's formatting rules so the two tools don't conflict.

## Results and artifacts

- **Terminal:** per-test results and a summary table at the end of every run. The output of the last full run is saved in [`docs/evidence/run-summary.txt`](docs/evidence/run-summary.txt).
- **JUnit XML:** every run writes one file per spec to `cypress/reports/junit/`, via `cypress-multi-reporters` (terminal output plus `mocha-junit-reporter`). `npm test` deletes the folder first, so it only ever holds the latest run. In CI these files are published as a GitHub check (see [CI](#ci)).
- **Screenshots:** `cypress/screenshots/<spec>/`, taken automatically for each failed test.
- **Videos:** off by default. Enable them for one run with `npx cypress run --browser chrome --config video=true`; they are saved to `cypress/videos/`.
- Reports, screenshots and videos are gitignored. Evidence for the defects is kept in [`docs/evidence/`](docs/evidence/).

## Project structure

```
cypress/
  e2e/
    forms/practice-form.cy.js
    selections/checkbox.cy.js, radio-button.cy.js
    dialogs/alerts.cy.js, modal-dialogs.cy.js
  pages/                     # page objects: selectors and actions, no assertions
    PracticeFormPage.js
    components/SubmissionModal.js
    CheckBoxPage.js, RadioButtonPage.js, AlertsPage.js, ModalDialogsPage.js
  fixtures/
    students.json            # form profiles and invalid emails
    files/profile.png        # upload fixture
  support/
    e2e.js                   # ignores errors from third-party scripts only
    utils/dialogs.js         # stubAlert, answerConfirm, answerPrompt
    utils/text.js            # exactText: exact, regex-safe text matching
cypress.config.js            # baseUrl, timeouts, viewport, blocked ad hosts, retries, reporters
eslint.config.mjs, .prettierrc.json, .prettierignore
.github/workflows/e2e.yml    # CI
```

## CI

`.github/workflows/e2e.yml` runs on every push to `main`, and manually from the Actions tab. On a manual run, the `cli` input can replace the test command (default: `npm test`).

Steps:

1. Install with `npm ci`.
2. Lint and check formatting.
3. Run the Cypress suite in Chrome.
4. **Publish the JUnit report** with [`mikepenz/action-junit-report`](https://github.com/mikepenz/action-junit-report). It creates a **"Cypress JUnit Report"** check on the commit, adds a per-test table to the run's **Summary** page, and annotates failed tests inline. This step runs even when tests fail. It also fails if no test results were produced, so a broken reporter setup can't look like a pass.
5. Upload the JUnit XML (`cypress-junit-report`) as an artifact, and failure screenshots when something fails. Both are kept 14 days.

The workflow needs `checks: write` permission to create the check; this is set in the file.

## Troubleshooting

- **`Cypress.exe: bad option: --smoke-test`, or Cypress exits straight away (Windows, VS Code terminal).** VS Code sets `ELECTRON_RUN_AS_NODE=1`, which stops Cypress's Electron from starting. Clear it for the session:
  - PowerShell: `Remove-Item Env:ELECTRON_RUN_AS_NODE`
  - bash: `unset ELECTRON_RUN_AS_NODE`
- **`Browser: 'chrome' was not found`.** Install Chrome, or use `npx cypress run --browser electron`.
- **Slow first page load.** DemoQA is a public site. `pageLoadTimeout` is 60 s and ad hosts are blocked; if loads still time out, check the site in a normal browser first.
