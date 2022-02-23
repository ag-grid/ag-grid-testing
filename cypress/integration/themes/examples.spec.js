/// <reference types="cypress" />



describe('AG Grid Examples', {
    "viewportWidth": 2000,
    "viewportHeight": 2000,
}, () => {

    const route = 'https://build.ag-grid.com/examples';
    const examples = [
        { name: 'pinning', url: 'column-pinning/column-pinning/packages/vanilla/index.html' }
    ]


    Cypress._.forEach(examples, (example) => {

        it(example.name, () => {
            cy.visit(`${route}/${example.url}`)
            cy.wait(5_000)

            // enable viewing test image even if following step fails
            // This enables us to download the image from TeamCity to then update the snapshot
            // Local Mac image will be different.
            cy.screenshot("__" + example.name + "__");
            cy.matchImageSnapshot(example.name);
        })
    });

})