const OPTION_IDS = {
  Yes: 'yesRadio',
  Impressive: 'impressiveRadio',
  No: 'noRadio',
};

const selectors = {
  result: '.text-success',
};

class RadioButtonPage {
  visit() {
    cy.visit('/radio-button');
  }

  option(label) {
    return cy.get(`#${OPTION_IDS[label]}`);
  }

  select(label) {
    cy.get(`label[for="${OPTION_IDS[label]}"]`).click();
  }

  result() {
    return cy.get(selectors.result);
  }
}

export default new RadioButtonPage();
