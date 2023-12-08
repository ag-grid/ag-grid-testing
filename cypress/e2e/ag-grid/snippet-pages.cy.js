/// <reference types="cypress" />


describe('AG Grid Snippet',
    () => {
        const apiPages = Cypress.env('examples');
        beforeEach(() => {
            cy.intercept('/examples/**/*', { body: ' ' });
            cy.intercept('/example-runner/**/*', { body: ' ' });
        });

        Cypress._.forEach(apiPages, (p) => {
            Cypress._.forEach(['react', 'angular', 'vue', 'javascript'], (fw) => {
                it(fw + ':' + p.page, () => {

                    const stub = p.page.startsWith('charts-') ? 'FW-charts' : 'FW-data-grid';

                    let pageName = p.page;
                    if (pageName.startsWith('charts-')) {
                        pageName = pageName.replace('charts-', '');
                    }

                    cy.visit(`https://grid-staging.ag-grid.com/${stub.replace('FW', fw)}/${pageName}/`, { retryOnStatusCodeFailure: true })
                        .get('pre > code > span')
                        .each(($el, index, $list) => {
                            cy.wrap($el).should('not.contain.text', '[object Object]');
                        })
                })
            })
        })
    });

// npx cypress run --spec "cypress/e2e/ag-grid/doc-pages.cy.js"  -b chrome --reporter-options "mochaFile=test-results/doc-pages.xml" --reporter cypress-multi-reporters