import failOnConsoleError, { consoleType } from 'cypress-fail-on-console-error';
/// <reference types="cypress" />

const filterPageExamples = require('../../support/filter-config')

describe('Validate AG Grid Examples', () => {

    failOnConsoleError({
        excludeMessages: ['^\\*'],
        includeConsoleTypes: [
            consoleType.ERROR,
            consoleType.WARN
        ],
    });

    const { baseUrl = 'https://grid-staging.ag-grid.com' } = Cypress.env();

    const examplesForRun = [

        {
            "page": "integrated-charts-api-cross-filter-chart",
            "examples": [

                {
                    "page": "integrated-charts-api-cross-filter-chart",
                    "example": "most-populous-cities",
                    "importType": "modules",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-cross-filter-chart/most-populous-cities/modules/vanilla/index.html"
                },
                {
                    "page": "integrated-charts-api-cross-filter-chart",
                    "example": "sales-dashboard2",
                    "importType": "modules",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-cross-filter-chart/sales-dashboard2/modules/vanilla/index.html"
                },
                {
                    "page": "integrated-charts-api-cross-filter-chart",
                    "example": "sales-dashboard2",
                    "importType": "packages",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-cross-filter-chart/sales-dashboard2/packages/vanilla/index.html"
                },
                {
                    "page": "integrated-charts-api-cross-filter-chart",
                    "example": "simple-cross-filter",
                    "importType": "modules",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-cross-filter-chart/simple-cross-filter/modules/vanilla/index.html"
                },
                {
                    "page": "integrated-charts-api-cross-filter-chart",
                    "example": "simple-cross-filter",
                    "importType": "packages",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-cross-filter-chart/simple-cross-filter/packages/vanilla/index.html"
                }
            ]
        },
        {
            "page": "integrated-charts-api-pivot-chart",
            "examples": [
                {
                    "page": "integrated-charts-api-pivot-chart",
                    "example": "pivot-chart-api",
                    "importType": "modules",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-pivot-chart/pivot-chart-api/modules/vanilla/index.html"
                },
                {
                    "page": "integrated-charts-api-pivot-chart",
                    "example": "pivot-chart-api",
                    "importType": "packages",
                    "framework": "vanilla",
                    "url": "integrated-charts-api-pivot-chart/pivot-chart-api/packages/vanilla/index.html"
                },
            ]
        },

    ];
    Cypress._.forEach((examplesForRun), (p) => {

        const validExamples = p.examples;
        if (validExamples.length > 0) {
            describe(p.page, {
                "retries": {
                    "runMode": 1,
                }
            }, () => {

                Cypress._.forEach(validExamples, (ex) => {

                    const shouldSkip = [].some(toExclude =>

                        (toExclude.page === undefined || toExclude.page === ex.page) &&
                        (toExclude.example === undefined || toExclude.example === ex.example) &&
                        (toExclude.importType === undefined || toExclude.importType === ex.importType) &&
                        (toExclude.framework === undefined || toExclude.framework === ex.framework)
                    );


                    it(`${ex.page} -> ${ex.example}${ex.importType ? ' -> ' + ex.importType : ''}${ex.framework ? ' -> ' + ex.framework : ''}`, () => {
                        cy.skipOn(shouldSkip);
                        cy.visit(`${baseUrl}/examples/${ex.url}`)
                            .then(() => {
                                if (p.page.startsWith('charts-')) {
                                    cy.get('.ag-chart-wrapper', { timeout: 15_000 }).wait(100)
                                } else {
                                    cy.get('.ag-root-wrapper', { timeout: 15_000 }).get('.ag-body-viewport', { timeout: 1_000 }).wait(100)
                                }
                            })
                    })
                })

            })

        }
    })

})



