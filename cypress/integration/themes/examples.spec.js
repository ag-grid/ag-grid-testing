/// <reference types="cypress" />



describe('AG Grid Examples', () => {

    const route = 'https://build.ag-grid.com/examples';
    const examples = [
        { name: 'pinning', url: 'column-pinning/column-pinning/packages/vanilla/index.html' }
    ]


    Cypress._.forEach(examples, (example) => {

        it(example.name, () => {
            cy.visit(`${route}/${example.url}`)
            cy.wait(5_000)
            cy.matchImageSnapshot(example.name);
        })
    });

})