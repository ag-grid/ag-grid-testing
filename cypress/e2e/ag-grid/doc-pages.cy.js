/// <reference types="cypress" />


describe('AG Grid Docs', () => {
    const apiPages = Cypress.env('apiPages');

    Cypress._.forEach(apiPages, (p) => {
        it(p.page, () => {

            const stub = p.page.startsWith('charts-') ? 'javascript-charts' : 'javascript-data-grid';

            let pageName = p.page;
            if (pageName.startsWith('charts-')) {
                pageName = pageName.replace('charts-', '');
            }

            cy.visit(`https://grid-staging.ag-grid.com/${stub}/${pageName}/`, { retryOnStatusCodeFailure: true })
                .get('h1')
                // It takes sometime for the api-documentation to spit out deprecation warnings but not clear what to wait on so just using time here.
                .wait(5_000)
        })
    })
});

// npx cypress run --spec "cypress/e2e/ag-grid/doc-pages.cy.js"  -b chrome --reporter-options "mochaFile=test-results/doc-pages.xml" --reporter cypress-multi-reporters