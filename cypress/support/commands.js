// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
require('@cypress/skip-test/support')

addMatchImageSnapshotCommand({
    failureThreshold: 0.03, // threshold for entire image
    failureThresholdType: 'percent', // percent of image or number of pixels
    customDiffConfig: { threshold: 0.1 }, // threshold for each pixel
});

// Avoid fake errors in tests due to our use of ResizeObserver
// Cypress do this themselves. https://github.com/cypress-io/cypress/blob/develop/packages/app/cypress/component/support/index.ts
Cypress.on('uncaught:exception', (err) => !err.message.includes('ResizeObserver loop limit exceeded'))
