/// <reference types="cypress" />



describe('AG Grid Demo', () => {

    it('snapshot', () => {
        cy.visit(`https://build.ag-grid.com`)
        cy.wait(5_000)
        cy.matchImageSnapshot('demo', { capture: 'fullPage' });
    })

})