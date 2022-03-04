const lodash = require('lodash')
import failOnConsoleError, { consoleType } from 'cypress-fail-on-console-error';
/// <reference types="cypress" />

describe('Validate AG Grid Examples', () => {

    failOnConsoleError({
        excludeMessages: ['^\\*'],
        includeConsoleTypes: [
            consoleType.ERROR,
            consoleType.WARN
        ],
    });

    const manualOpenRun = {
        examples: [{
            "page": "accessibility",
            "examples": [
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "angular",
                    "url": "accessibility/accessibility/modules/angular/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "react",
                    "url": "accessibility/accessibility/modules/react/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "reactFunctional",
                    "url": "accessibility/accessibility/modules/reactFunctional/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "typescript",
                    "url": "accessibility/accessibility/modules/typescript/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "vanilla",
                    "url": "accessibility/accessibility/modules/vanilla/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "vue",
                    "url": "accessibility/accessibility/modules/vue/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "modules",
                    "framework": "vue3",
                    "url": "accessibility/accessibility/modules/vue3/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "angular",
                    "url": "accessibility/accessibility/packages/angular/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "react",
                    "url": "accessibility/accessibility/packages/react/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "reactFunctional",
                    "url": "accessibility/accessibility/packages/reactFunctional/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "typescript",
                    "url": "accessibility/accessibility/packages/typescript/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "vanilla",
                    "url": "accessibility/accessibility/packages/vanilla/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "vue",
                    "url": "accessibility/accessibility/packages/vue/index.html"
                },
                {
                    "page": "accessibility",
                    "example": "accessibility",
                    "importType": "packages",
                    "framework": "vue3",
                    "url": "accessibility/accessibility/packages/vue3/index.html"
                }
            ]
        }],
        framework: 'vue3', importType: 'modules', isCharts: false, excludeTests: []
    }

    const { framework, importType, isCharts, excludeTests, examples, chunkIndex, chunkSize } = Cypress.env();

    const chunks = lodash.chunk(examples, chunkSize)

    const filterPages = (ps) => ps.filter(p => (!isCharts && !p.page.includes('charts-')) || (isCharts && p.page.includes('charts-')));
    const filterFrameworks = (exs) => exs.filter(e => e.framework === framework);
    const filterImportType = (exs) => exs.filter(e => e.importType === importType);
    const filterExamples = (exs) => exs

    const examplesForRun = chunks[chunkIndex];
    Cypress._.forEach(filterPages(examplesForRun), (p) => {

        const validExamples = filterExamples(filterFrameworks(filterImportType(p.examples)));
        if (validExamples.length > 0) {
            describe(p.page, {
                "retries": {
                    "runMode": 1,
                }
            }, () => {

                Cypress._.forEach(validExamples, (ex) => {

                    const shouldSkip = excludeTests.some(toExclude =>

                        (toExclude.page === undefined || toExclude.page === ex.page) &&
                        (toExclude.example === undefined || toExclude.example === ex.example) &&
                        (toExclude.importType === undefined || toExclude.importType === ex.importType) &&
                        (toExclude.framework === undefined || toExclude.framework === ex.framework)
                    );


                    it(`${ex.page} -> ${ex.example}${ex.importType ? ' -> ' + ex.importType : ''}${ex.framework ? ' -> ' + ex.framework : ''}`, () => {
                        cy.skipOn(shouldSkip);
                        cy.visit(`https://build.ag-grid.com/examples/${ex.url}`)
                            .then(() => {

                                if (p.page.startsWith('charts-')) {
                                    cy.get('.ag-chart-wrapper', { timeout: 10_000 }).wait(100)
                                } else {
                                    cy.get('.ag-root-wrapper', { timeout: 10_000 }).get('.ag-body-viewport', { timeout: 1_000 }).wait(100)
                                }
                            })
                    })
                })

            })

        }
    })

})



