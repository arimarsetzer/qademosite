# Defect Reports

Defects found while exploring and automating DemoQA. Each one was reproduced more than once before being filed.

| ID                                                                                                     | Title                                                                             | Severity | Priority | Linked test                                 |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- | -------- | -------- | ------------------------------------------- |
| [DEF-003](#def-003--close-button-of-the-practice-form-confirmation-modal-throws-and-does-not-close-it) | Close button of the Practice Form confirmation modal throws and does not close it | Major    | High     | `practice-form.cy.js` › `DEF-003` (skipped) |
| [DEF-001](#def-001--practice-form-has-duplicate-ids-and-labels-not-associated-with-their-inputs)       | Practice Form has duplicate ids and labels not associated with their inputs       | Minor    | Medium   | None (static markup finding)                |
| [DEF-002](#def-002--date-of-birth-in-the-confirmation-modal-is-missing-a-space-after-the-comma)        | Date of Birth in the confirmation modal is missing a space after the comma        | Trivial  | Low      | `practice-form.cy.js` › `DEF-002` (skipped) |

**Common environment**

- Application: https://demoqa.com (client-side build `assets/index-D_rDx8ml.js`), checked on 2026-09-24
- Browsers: Chrome 153 (headed) and Electron 146 (headless)
- OS: Windows 10 Home 10.0.19045
- Tooling: Cypress 16.1.0, Node 24.11.0. Third-party ad hosts blocked. DEF-003 also happens with ads allowed.

---

## DEF-003 — Close button of the Practice Form confirmation modal throws and does not close it

**Environment:** see common environment.

**Preconditions:** Practice Form open at `/automation-practice-form`.

**Steps to reproduce**

1. Fill First Name `Ann`, Last Name `Lee`, Gender `Female`, Mobile `9876543210`.
2. Click **Submit**. The "Thanks for submitting the form" modal opens with the correct values.
3. Click the **Close** button (`#closeLargeModal`) in the modal footer.

**Expected result:** the modal closes. The user returns to the form, and the form is reset for a new entry.

**Actual result**

- The modal stays open.
- The browser console shows the uncaught error `TypeError: Lr.findDOMNode is not a function`, thrown from the button's `onClick` handler in `index-D_rDx8ml.js`.
- Clicking Close again throws the same error each time.
- Pressing **Esc** or clicking the backdrop does close the modal.

Reproduced 2 of 2 times in the diagnostic run, plus in the first suite run.

**Severity:** Major. The main, visible way to dismiss the dialog after completing the form's main flow does nothing and raises an unhandled runtime error. There is a workaround (Esc or backdrop), which is why this is not Critical, but most users won't know about it.

**Priority:** High. It affects every successful form submission. The likely root cause is small and specific: `findDOMNode` was removed from `react-dom` in React 19, and the modal's close handler, or a library it uses, still calls it.

**Rationale:** This breaks the end of the primary user journey. Any e2e check that closes the modal fails, so it also blocks regression testing of repeated submissions.

**Evidence**

- Screenshot: [docs/evidence/DEF-003-close-button-error.png](docs/evidence/DEF-003-close-button-error.png). The modal is still open, and the failing step is `click #closeLargeModal → (uncaught exception) TypeError: Lr.findDOMNode is not a function`.
- Automated reproduction: the `DEF-003` test in `cypress/e2e/forms/practice-form.cy.js`. It is skipped so the main suite stays green, and it fails with the error above when un-skipped. Checked on 2026-09-24.

---

## DEF-001 — Practice Form has duplicate ids and labels not associated with their inputs

**Environment:** see common environment. Static markup, so it is browser-independent.

**Preconditions:** Practice Form open at `/automation-practice-form`.

**Steps to reproduce**

1. Open DevTools → Console.
2. Run `document.querySelectorAll('#subjects-label').length`.
3. Run `[...document.querySelectorAll('#userForm label:not([for])')].map(l => l.textContent)`.

**Expected result**

- Step 2 returns `1`, because `id` values must be unique in a document.
- Step 3 returns `[]`: every field label is programmatically tied to its control (`for`/`id`, or a wrapping label).

**Actual result**

- Step 2 returns `3`. The **Subjects**, **Hobbies** and **Picture** labels all use `id="subjects-label"`.
- Step 3 returns 9 labels with no association: Name, Email, Mobile (10 Digits), Date of Birth, Subjects, Hobbies, Picture, Current Address, State and City.
- Clicking a label (e.g. "Email") does not focus its input, and screen readers announce these inputs without an accessible name. Only the placeholders are available.

**Severity:** Minor. No functional flow is blocked, but this is invalid HTML and an accessibility failure (WCAG 2.2 SC 1.3.1 Info and Relationships, SC 4.1.2 Name, Role, Value).

**Priority:** Medium. It's a cheap fix (add `htmlFor` and unique ids) that affects every user of assistive technology on the site's main form.

**Rationale:** Beyond accessibility, it also stops testers from using label-based locators (e.g. "get the field labelled Email"), which is why this suite has to fall back to element ids.

**Evidence:** DOM excerpt captured during exploration:

```html
<label id="subjects-label" class="form-label ...">Subjects</label>
<label id="subjects-label" class="form-label ...">Hobbies</label>
<label id="subjects-label" class="form-label ...">Picture</label>
<label id="userEmail-label" class="form-label ...">Email</label>
<!-- no for= -->
<input ... id="userEmail" ... />
```

---

## DEF-002 — Date of Birth in the confirmation modal is missing a space after the comma

**Environment:** see common environment.

**Preconditions:** Practice Form open at `/automation-practice-form`.

**Steps to reproduce**

1. Fill the required fields (First Name, Last Name, Gender, Mobile).
2. Set Date of Birth to 15 May 1990 with the date picker.
3. Click **Submit**.

**Expected result:** The "Date of Birth" row reads `15 May, 1990`. The input itself shows `15 May 1990`.

**Actual result:** The row reads `15 May,1990`. The default date shows the same issue (`24 September,2026`).

**Severity:** Trivial. It's cosmetic and the data is correct.

**Priority:** Low. Fix it together with other modal work, e.g. DEF-003.

**Rationale:** This is user-visible confirmation data, and the format doesn't match the date picker input. It's a one-character formatting fix.

**Evidence**

- The main flow test (`submits a fully filled form…`) captures the actual text. That test accepts both formats, so fixing the defect won't break it.
- The `DEF-002` test asserts the correct format. It is skipped and fails on the text assertion when un-skipped.
- Screenshot: [docs/evidence/DEF-002-date-format.png](docs/evidence/DEF-002-date-format.png).

---

## Observations not filed as defects

These were seen during exploration but were not confirmed well enough, or are judgement calls, so they are not filed:

| Observation                                                                                                               | Why not filed                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pressing Enter in **Subjects** before the suggestion list is open submitted the whole form (seen once during exploration) | Not reproduced consistently. It's implicit form submission, which may be intended. The suite avoids it by clicking suggestions. It needs a manual check before filing.                                          |
| **Mobile** accepts letters as you type                                                                                    | The submit is correctly blocked (covered by an automated test). Restricting input as you type would be a UX improvement, not a bug.                                                                             |
| `minlength=10` on **Mobile** isn't enforced in automation                                                                 | This is a browser/tooling behaviour: `tooShort` only applies to real user edits, and Cypress sets the value programmatically. It needs a manual check in a real browser. Not automated to avoid a false result. |
| The Check Box result lists `veu` (for "Vue"?)                                                                             | The tree label wasn't checked. It's probably a typo in the test data; low value.                                                                                                                                |
