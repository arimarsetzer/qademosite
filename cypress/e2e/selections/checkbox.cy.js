import checkBoxPage from '../../pages/CheckBoxPage';

const ALL_HOME_VALUES = [
  'home',
  'desktop',
  'notes',
  'commands',
  'documents',
  'workspace',
  'react',
  'angular',
  'veu',
  'office',
  'public',
  'private',
  'classified',
  'general',
  'downloads',
  'wordFile',
  'excelFile',
];

const resultValues = () =>
  checkBoxPage.resultItems().then(($items) => Cypress._.map($items, 'innerText'));

describe('Check Box', () => {
  beforeEach(() => {
    checkBoxPage.visit();
  });

  it('checking the root node checks every descendant', () => {
    checkBoxPage.toggle('Home');
    checkBoxPage.expand('Home');

    ['Home', 'Desktop', 'Documents', 'Downloads'].forEach((name) =>
      checkBoxPage.checkbox(name).should('have.attr', 'aria-checked', 'true'),
    );
    resultValues().should('have.members', ALL_HOME_VALUES);
  });

  it('checking leaves in different branches marks their parents as partially checked', () => {
    checkBoxPage.expand('Home', 'Desktop', 'Documents', 'WorkSpace');

    checkBoxPage.toggle('Notes');
    checkBoxPage.toggle('Angular');

    checkBoxPage.checkbox('Notes').should('have.attr', 'aria-checked', 'true');
    checkBoxPage.checkbox('Angular').should('have.attr', 'aria-checked', 'true');
    ['Desktop', 'WorkSpace', 'Documents', 'Home'].forEach((name) =>
      checkBoxPage.checkbox(name).should('have.attr', 'aria-checked', 'mixed'),
    );
    resultValues().should('have.members', ['notes', 'angular']);
  });

  it('unchecking one child of a fully checked folder reverts the folder to partial', () => {
    checkBoxPage.expand('Home', 'Downloads');

    checkBoxPage.toggle('Downloads');
    checkBoxPage.checkbox('Word File.doc').should('have.attr', 'aria-checked', 'true');
    checkBoxPage.checkbox('Excel File.doc').should('have.attr', 'aria-checked', 'true');
    resultValues().should('have.members', ['downloads', 'wordFile', 'excelFile']);

    checkBoxPage.toggle('Excel File.doc');

    checkBoxPage.checkbox('Excel File.doc').should('have.attr', 'aria-checked', 'false');
    checkBoxPage.checkbox('Downloads').should('have.attr', 'aria-checked', 'mixed');
    resultValues().should('have.members', ['wordFile']);
  });
});
