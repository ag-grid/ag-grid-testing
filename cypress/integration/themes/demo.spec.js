/// <reference types="cypress" />



describe('AG Grid Demo', {
    "retries": 1
}, () => {

    it('snapshot', () => {
        cy.visit(`https://build.ag-grid.com`)
        cy.wait(5_000)

        // Accept cookies to hide the banner
        cy.get('#onetrust-banner-sdk').should('be.visible');
        cy.get('#onetrust-accept-btn-handler').click();
        cy.get('#onetrust-banner-sdk').should('not.be.visible');

        const imgName = `${Cypress.platform}/demo`;
        // enable viewing test image even if following step fails
        cy.get('#bestHtml5Grid').screenshot(`${imgName}_COPY`);
        // Run the image comparison on the grid.
        cy.get('#bestHtml5Grid').matchImageSnapshot(imgName);
    })

})