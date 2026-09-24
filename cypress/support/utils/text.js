export const exactText = (text) => new RegExp(`^\\s*${Cypress._.escapeRegExp(text)}\\s*$`);
