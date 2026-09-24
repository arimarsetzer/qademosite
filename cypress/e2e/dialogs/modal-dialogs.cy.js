import modalPage from '../../pages/ModalDialogsPage';

describe('Modal Dialogs', () => {
  beforeEach(() => {
    modalPage.visit();
  });

  it('opens the small modal with its content and closes it from the footer button', () => {
    modalPage.openSmall();

    modalPage.dialog().should('be.visible');
    modalPage.dialogBox().should('have.class', 'modal-sm');
    modalPage.title().should('have.text', 'Small Modal');
    modalPage.body().should('have.text', 'This is a small modal. It has very less content');

    modalPage.closeSmallViaFooter();
    modalPage.dialog().should('not.exist');
  });

  it('opens the large modal with its content and closes it from the header X', () => {
    modalPage.openLarge();

    modalPage.dialog().should('be.visible');
    modalPage.dialogBox().should('have.class', 'modal-lg');
    modalPage.title().should('have.text', 'Large Modal');
    modalPage.body().should('contain.text', 'Lorem Ipsum is simply dummy text');

    modalPage.closeViaHeaderX();
    modalPage.dialog().should('not.exist');
  });

  it('closes an open modal with the Escape key', () => {
    modalPage.openSmall();
    modalPage.dialog().should('be.visible');

    modalPage.dialog().type('{esc}');

    modalPage.dialog().should('not.exist');
  });
});
