/// <reference types="cypress" />


describe('AG Grid Docs', () => {
    const apiPages = Cypress.env('apiPages').filter(p => p.page.includes('grid-call') || p.page.includes('grid-prop'))

    it('has valid pages', () => {
        expect(apiPages).to.be.an('array').and.not.be.empty
    })

    Cypress._.forEach(apiPages, (p) => {
        it(p.page, () => {

            const stub = p.page.startsWith('charts-') ? 'javascript-charts' : 'javascript-data-grid';

            let pageName = p.page;
            if (pageName.startsWith('charts-')) {
                pageName = pageName.replace('charts-', '');
            }

            cy.visit(`https://build.ag-grid.com/${stub}/${pageName}/`)
                .get('h1')
                // It takes sometime for the api-documentation to spit out deprecation warnings but not clear what to wait on so just using time here.
                .wait(3_000)
        })
    })
});

// npx cypress run --spec "cypress/integration/ag-grid/doc-pages.spec.js"  -b chrome --reporter-options "mochaFile=test-results/doc-pages.xml" --reporter cypress-multi-reporters