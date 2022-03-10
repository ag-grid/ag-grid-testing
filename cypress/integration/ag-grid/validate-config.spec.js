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

    const { framework, importType, isCharts, excludeTests, examples, chunkIndex, chunkSize } = Cypress.env();

    const chunks = filterPageExamples(examples, framework, importType, isCharts, chunkSize);

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



