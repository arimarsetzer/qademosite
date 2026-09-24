const selectors = {
  treeItem: '[role="treeitem"]',
  switcher: '.rc-tree-switcher',
  checkbox: (name) => `[role="checkbox"][aria-label="Select ${name}"]`,
  resultItems: '#result .text-success',
};

class CheckBoxPage {
  visit() {
    cy.visit('/checkbox');
  }

  node(name) {
    return cy.get(selectors.treeItem).filter(`:has(${selectors.checkbox(name)})`);
  }

  checkbox(name) {
    return cy.get(selectors.checkbox(name));
  }

  expand(...path) {
    path.forEach((name) => {
      this.node(name).then(($node) => {
        if ($node.attr('aria-expanded') !== 'true') {
          cy.wrap($node).find(selectors.switcher).click();
        }
      });
      this.node(name).should('have.attr', 'aria-expanded', 'true');
    });
  }

  toggle(name) {
    this.checkbox(name).click();
  }

  resultItems() {
    return cy.get(selectors.resultItems);
  }
}

export default new CheckBoxPage();
