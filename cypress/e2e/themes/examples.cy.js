/// <reference types="cypress" />



describe('AG Grid Examples',
    {
        "viewportWidth": 1280,
        "viewportHeight": 800
    }, () => {

        const envFramework = Cypress.env('framework');

        const route = 'https://grid-staging.ag-grid.com/examples';
        const frameworks = envFramework ? [envFramework] : ['vanilla', 'typescript', 'angular', 'reactFunctional', 'reactFunctionalTs', 'vue', 'vue3'];
        const examples = [
            "column-pinning/column-pinning/modules/vanilla/index.html",
            "master-detail-grids/grid-options/modules/vanilla/index.html",
            "sparklines-points-of-interest/sparkline-special-points/modules/vanilla/index.html",
            // TODO: AG-6790 - re-enable after Integrated Charts -> Charts integration rework.
            // "integrated-charts-api-pivot-chart/pivot-chart-api/modules/vanilla/index.html",
            "filter-multi/floating-filters/modules/vanilla/index.html",
            "side-bar/fine-tuning/modules/vanilla/index.html",
            "tool-panel-columns/custom-layout/modules/vanilla/index.html",
            "tree-data/file-browser/modules/vanilla/index.html",
            "pivoting/secondary-columns/modules/vanilla/index.html",
            "grouping-footers/customising-footer-values/modules/vanilla/index.html",
            "cell-styles/cell-styling/modules/vanilla/index.html",
            "row-spanning/row-spanning-complex/modules/vanilla/index.html",
            "component-cell-renderer/cell-renderer/modules/vanilla/index.html",
            "component-status-bar/custom-component/modules/vanilla/index.html",
            "component-tool-panel/custom-stats/modules/vanilla/index.html",
            "aligned-grids/aligned-column-groups/modules/vanilla/index.html"
        ]

        Cypress._.forEach(examples, (example) => {
            const testName = example.split('/').splice(0, 2).join('_');
            describe(testName, () => {

                Cypress._.forEach(frameworks, (framework) => {

                    it(framework, () => {
                        const frameworkExample = example.replace('/vanilla/', `/${framework}/`)
                        cy.visit(`${route}/${frameworkExample}`, { retryOnStatusCodeFailure: true })
                        cy.get('.ag-root-wrapper', { timeout: 10_000 }).get('.ag-body-viewport', { timeout: 1_000 }).wait(3_000);

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