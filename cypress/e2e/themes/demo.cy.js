/// <reference types="cypress" />



describe('AG Grid Demo', {
    "viewportWidth": 1280,
    "viewportHeight": 800,
    "retries": 1
}, () => {

    it('snapshot', () => {
        cy.visit(`https://build.ag-grid.com/example/?isCI=true`)
        cy.wait(5_000)

        // Accept cookies to hide the banner
        const imgName = `${Cypress.platform}/demo`;
        // enable viewing test image even if following step fails
        cy.get('#myGrid').screenshot(`${imgName}_COPY`);
        // Run the image comparison on the grid.
        cy.get('#myGrid').matchImageSnapshot(imgName);
    })

})