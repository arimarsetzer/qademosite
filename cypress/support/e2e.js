Cypress.on('uncaught:exception', (err) => {
  const fromApplication = (err.stack || '').includes(Cypress.config('baseUrl'));
  if (!fromApplication) {
    Cypress.log({ name: 'ignored 3rd-party error', message: err.message });
    return false;
  }
  return undefined;
});
