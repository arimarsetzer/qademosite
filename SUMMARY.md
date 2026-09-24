# Summary

**Result:** 23 tests: 21 pass, 2 skipped on purpose as known defects. The suite ran 5 times in a row in Chrome and Electron with identical results and no retries. It also found 3 real DemoQA defects ([DEFECTS.md](DEFECTS.md)).

## Approach

1. **Explore before automating.** I inspected the rendered pages first. DemoQA has been rebuilt as a Vite single-page app, and the Check Box page now uses `rc-tree`, so most public DemoQA examples are out of date. There are no `data-testid` attributes.
2. **Pick 5 pages that each need a different technique.** Practice Form (validation, many input types, a result modal), Check Box (tree state propagation), Radio Button (a single choice and a disabled option), Alerts (native dialogs and a timer), Modal Dialogs (DOM dialogs, 3 ways to close).
3. **Test behaviour, not volume.** Every test has a distinct purpose: a happy path, a boundary, or a state change. Duplicates were left out.

## Key design decisions

- **Page objects** hold selectors and user actions; **specs** hold scenarios and assertions. There is no base class, because a shared `visit()` doesn't justify inheritance.
- **Selectors:** stable ids first, then ARIA attributes (`[role="checkbox"][aria-label="Select Notes"]`, `[role="dialog"]`), then exact text inside a stable container. No position-based selectors or XPath.
- **Assertions check meaning, not styling:** `:invalid`/`:valid` and the form's `was-validated` class instead of border colours; each confirmation-modal value is read by its row label.
- **Native dialogs are stubbed** through three small helpers. The 5-second alert uses `cy.clock()`/`cy.tick()`: it must not appear at 4999 ms and must appear at 5000 ms, with no real waiting.
- **Deterministic data:** fixtures and fixed values, no random data. The date of birth is always set explicitly because it defaults to today.
- **Known defects stay visible without breaking the build.** Each has an `it.skip` test named `DEF-xxx` that asserts the correct behaviour.

## Trade-offs

- **Ad hosts are blocked** (`blockHosts`): the tests are faster and more stable, but the suite won't catch layout problems caused by ads.
- **Retries are off:** a flaky test fails loudly instead of passing quietly on a second try. In CI that costs occasional reruns, in exchange for trustworthy results.
- **Selectors depend on DemoQA's current markup:** a rebuild can break them. All selectors live in `cypress/pages/`, so each fix is made in one place.
- **Chrome is the main browser:** Cypress 16 deprecates its bundled Electron. Reviewers need Chrome installed, with Electron as the fallback.
- **Not automated:** `minlength` on Mobile. Browsers only enforce it after a real user edit, not on values Cypress sets, so a test would prove nothing.

## Insights and challenges

- **Letting only DemoQA's own errors fail tests paid off.** Errors from ad scripts are ignored, but errors from DemoQA's code still fail. This surfaced DEF-003: the confirmation modal's Close button throws `findDOMNode is not a function` (an API removed in React 19) and the modal stays open.
- **Pressing Enter in the Subjects autocomplete submitted the form** before a suggestion was picked. The page object now waits for the suggestion and clicks it.
- **Clicking tree nodes quickly while they animate re-collapsed a node.** Expanding now waits for `aria-expanded="true"` before the next step.
- **Environment:** VS Code terminals set `ELECTRON_RUN_AS_NODE=1`, which stops Cypress from starting. This is documented in the README.
