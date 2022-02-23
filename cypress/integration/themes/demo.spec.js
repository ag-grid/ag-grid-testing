/// <reference types="cypress" />



describe('AG Grid Demo', () => {

    it('snapshot', () => {
        cy.visit(`https://build.ag-grid.com`)
        cy.wait(5_000)
        cy.get('#onetrust-banner-sdk').should('be.visible');
        cy.get('#onetrust-accept-btn-handler').click();
        cy.get('#onetrust-banner-sdk').should('not.be.visible');
        cy.get('#bestHtml5Grid').matchImageSnapshot('demo');
    })

})