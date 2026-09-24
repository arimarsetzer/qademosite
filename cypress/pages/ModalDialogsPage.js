const selectors = {
  smallModalButton: '#showSmallModal',
  largeModalButton: '#showLargeModal',
  dialog: '[role="dialog"][aria-modal="true"]',
  dialogBox: '.modal-dialog',
  title: '.modal-title',
  body: '.modal-body',
  headerCloseButton: '.modal-header [aria-label="Close"]',
  smallFooterCloseButton: '#closeSmallModal',
  largeFooterCloseButton: '#closeLargeModal',
};

class ModalDialogsPage {
  visit() {
    cy.visit('/modal-dialogs');
  }

  openSmall() {
    cy.get(selectors.smallModalButton).click();
  }

  openLarge() {
    cy.get(selectors.largeModalButton).click();
  }

  dialog() {
    return cy.get(selectors.dialog);
  }

  dialogBox() {
    return this.dialog().find(selectors.dialogBox);
  }

  title() {
    return this.dialog().find(selectors.title);
  }

  body() {
    return this.dialog().find(selectors.body);
  }

  closeSmallViaFooter() {
    cy.get(selectors.smallFooterCloseButton).click();
  }

  closeLargeViaFooter() {
    cy.get(selectors.largeFooterCloseButton).click();
  }

  closeViaHeaderX() {
    this.dialog().find(selectors.headerCloseButton).click();
  }
}

export default new ModalDialogsPage();
