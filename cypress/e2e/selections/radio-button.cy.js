import radioPage from '../../pages/RadioButtonPage';

describe('Radio Button', () => {
  beforeEach(() => {
    radioPage.visit();
  });

  it('keeps a single selection when switching between options', () => {
    radioPage.select('Yes');
    radioPage.option('Yes').should('be.checked');
    radioPage.result().should('have.text', 'Yes');

    radioPage.select('Impressive');
    radioPage.option('Impressive').should('be.checked');
    radioPage.option('Yes').should('not.be.checked');
    radioPage.result().should('have.text', 'Impressive');
  });

  it('does not allow selecting the disabled "No" option', () => {
    radioPage.select('Yes');
    radioPage.option('No').should('be.disabled');

    radioPage.select('No');

    radioPage.option('No').should('not.be.checked');
    radioPage.option('Yes').should('be.checked');
    radioPage.result().should('have.text', 'Yes');
  });
});
