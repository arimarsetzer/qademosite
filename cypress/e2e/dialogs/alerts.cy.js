import alertsPage from '../../pages/AlertsPage';
import { answerConfirm, answerPrompt, stubAlert } from '../../support/utils/dialogs';

describe('Alerts', () => {
  beforeEach(() => {
    alertsPage.visit();
  });

  it('shows a simple alert with the expected message', () => {
    stubAlert();

    alertsPage.triggerAlert();

    cy.get('@alert').should('have.been.calledOnceWith', 'You clicked a button');
  });

  it('shows the delayed alert only after 5 seconds', () => {
    cy.clock();
    stubAlert();

    alertsPage.triggerTimerAlert();

    cy.tick(4999);
    cy.get('@alert').should('not.have.been.called');
    cy.tick(1);
    cy.get('@alert').should('have.been.calledOnceWith', 'This alert appeared after 5 seconds');
  });

  it('reports "Ok" when the confirm box is accepted', () => {
    answerConfirm(true);

    alertsPage.triggerConfirm();

    cy.get('@confirm').should('have.been.calledOnceWith', 'Do you confirm action?');
    alertsPage.confirmResult().should('have.text', 'You selected Ok');
  });

  it('reports "Cancel" when the confirm box is dismissed', () => {
    answerConfirm(false);

    alertsPage.triggerConfirm();

    alertsPage.confirmResult().should('have.text', 'You selected Cancel');
  });

  it('echoes the name entered in the prompt box', () => {
    answerPrompt('Arimar QA');

    alertsPage.triggerPrompt();

    cy.get('@prompt').should('have.been.calledOnceWith', 'Please enter your name');
    alertsPage.promptResult().should('have.text', 'You entered Arimar QA');
  });

  it('shows no prompt result when the prompt box is cancelled', () => {
    answerPrompt(null);

    alertsPage.triggerPrompt();

    cy.get('@prompt').should('have.been.calledOnce');
    alertsPage.promptResult().should('not.exist');
  });
});
