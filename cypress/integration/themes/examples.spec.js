/// <reference types="cypress" />



describe('AG Grid Examples', {
    "viewportWidth": 2000,
    "viewportHeight": 2000,
    retries: 1
}, () => {

    const route = 'https://build.ag-grid.com/examples';
    const examples = [
        'column-pinning/column-pinning/packages/vanilla/index.html',
        "master-detail-grids/grid-options/modules/vanilla/index.html"
    ]

    Cypress._.forEach(examples, (example) => {
        const testName = example.split('/').splice(0, 2).join('_');
        it(testName, () => {
            cy.visit(`${route}/${example}`)
            cy.wait(5_000)

            // enable viewing test image even if following step fails
            // This enables us to download the image from TeamCity to then update the snapshot
            // Local Mac image will be different.
            const imgName = `${Cypress.platform}/${testName}`;
            cy.screenshot(`${imgName}_COPY`);
            cy.matchImageSnapshot(imgName);
        })
    });

})