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

    const { framework, importType, isCharts, excludeTests, examples } = Cypress.env();

    const filterPages = (ps) => ps.filter(p => (!isCharts && !p.page.includes('charts-')) || (isCharts && p.page.includes('charts-')));
    const filterFrameworks = (exs) => exs.filter(e => e.framework === framework);
    const filterImportType = (exs) => exs.filter(e => e.importType === importType);
    const filterExamples = (exs) => exs

    Cypress._.forEach(filterPages(examples).slice(0, 2), (p) => {

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



