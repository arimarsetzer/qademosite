const selectors = {
  alertButton: '#alertButton',
  timerAlertButton: '#timerAlertButton',
  confirmButton: '#confirmButton',
  promptButton: '#promtButton',
  confirmResult: '#confirmResult',
  promptResult: '#promptResult',
};

class AlertsPage {
  visit() {
    cy.visit('/alerts');
  }

  triggerAlert() {
    cy.get(selectors.alertButton).click();
  }

  triggerTimerAlert() {
    cy.get(selectors.timerAlertButton).click();
  }

  triggerConfirm() {
    cy.get(selectors.confirmButton).click();
  }

  triggerPrompt() {
    cy.get(selectors.promptButton).click();
  }

  confirmResult() {
    return cy.get(selectors.confirmResult);
  }

  promptResult() {
    return cy.get(selectors.promptResult);
  }
}

export default new AlertsPage();
