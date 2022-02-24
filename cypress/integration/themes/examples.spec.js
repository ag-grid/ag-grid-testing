/// <reference types="cypress" />



describe('AG Grid Examples',
    {
        "viewportWidth": 1280,
        "viewportHeight": 800
    }, () => {

        const route = 'https://build.ag-grid.com/examples';
        //const frameworks = ['vanilla'];
        const frameworks = ['vanilla', 'typescript', 'angular', 'react', 'reactFunctional', 'vue', 'vue3'];
        const examples = [
            "column-pinning/column-pinning/packages/vanilla/index.html",
            "master-detail-grids/grid-options/modules/vanilla/index.html",
            "sparklines-points-of-interest/sparkline-special-points/modules/vanilla/index.html",
            "integrated-charts-api-pivot-chart/pivot-chart-api/modules/vanilla/index.html",
            "filter-multi/floating-filters/packages/vanilla/index.html",
            "side-bar/fine-tuning/packages/vanilla/index.html",
            "tool-panel-columns/custom-layout/packages/vanilla/index.html",
            "tree-data/file-browser/packages/vanilla/index.html",
            "pivoting/secondary-columns/packages/vanilla/index.html",
            "grouping-footers/customising-footer-values/packages/vanilla/index.html",
            "cell-styles/cell-styling/packages/vanilla/index.html",
            "row-spanning/row-spanning-complex/packages/vanilla/index.html",
            "component-cell-renderer/cell-renderer/modules/vanilla/index.html",
            "component-status-bar/custom-component/packages/vanilla/index.html",
            "component-tool-panel/custom-stats/packages/vanilla/index.html",
            "aligned-grids/aligned-column-groups/vanilla/index.html"
        ]

        Cypress._.forEach(examples, (example) => {
            const testName = example.split('/').splice(0, 2).join('_');
            describe(testName, () => {

                Cypress._.forEach(frameworks, (framework) => {

                    it(framework, () => {
                        const frameworkExample = example.replace('/vanilla/', `/${framework}/`)
                        cy.visit(`${route}/${frameworkExample}`)
                        cy.get('.ag-row', { timeout: 10_000 }).wait(3_000);

                        // enable viewing test image even if following step fails
                        // This enables us to download the image from TeamCity to then update the snapshot
                        // Local Mac image will be different.
                        const imgName = `${Cypress.platform}/${testName}_${framework}`;
                        cy.screenshot(`${imgName}_COPY`);
                        cy.matchImageSnapshot(imgName);
                    })
                });

            })
        });

    })