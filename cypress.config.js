const { defineConfig } = require('cypress');

const THIRD_PARTY_HOSTS = [
  '*doubleclick.net',
  '*googlesyndication.com',
  '*googletagservices.com',
  '*googletagmanager.com',
  '*google-analytics.com',
  '*adtrafficquality.google',
  '*criteo.com',
  '*criteo.net',
  '*openx.net',
  '*openxcdn.net',
  '*creativecdn.com',
  '*id5-sync.com',
  '*crwdcntrl.net',
];

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://demoqa.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    blockHosts: THIRD_PARTY_HOSTS,
    retries: { runMode: 0, openMode: 0 },
    video: false,
    screenshotOnRunFailure: true,
  },
});
