export const stubAlert = () => {
  cy.on('window:alert', cy.stub().as('alert'));
};

export const answerConfirm = (accept) => {
  cy.on('window:confirm', cy.stub().as('confirm').returns(accept));
};

export const answerPrompt = (answer) => {
  cy.window().then((win) => {
    cy.stub(win, 'prompt').as('prompt').returns(answer);
  });
};
