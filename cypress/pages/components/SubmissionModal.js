import { exactText } from '../../support/utils/text';

const selectors = {
  dialog: '[role="dialog"][aria-modal="true"]',
  title: '.modal-title',
  closeButton: '#closeLargeModal',
};

class SubmissionModal {
  dialog() {
    return cy.get(selectors.dialog);
  }

  title() {
    return this.dialog().find(selectors.title);
  }

  valueFor(label) {
    return this.dialog().contains('td', exactText(label)).next('td');
  }

  close() {
    cy.get(selectors.closeButton).click();
  }
}

export default new SubmissionModal();
