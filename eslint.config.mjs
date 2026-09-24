import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import mocha from 'eslint-plugin-mocha';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/',
      'cypress/screenshots/',
      'cypress/videos/',
      'cypress/downloads/',
      'cypress/reports/',
    ],
  },
  js.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      sourceType: 'module',
    },
  },
  {
    files: ['cypress/**/*.cy.js'],
    plugins: { mocha },
    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-identical-title': 'error',
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  prettier,
];
