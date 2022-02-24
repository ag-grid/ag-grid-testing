import failOnConsoleError, { consoleType } from 'cypress-fail-on-console-error';
export function buildTests(filterFramework, filterType, isCharts = false, excludeTest = []) {


    failOnConsoleError({
        excludeMessages: ['^\\*'],
        includeConsoleTypes: [
            consoleType.ERROR,
            consoleType.WARN
        ],
    });

    const pages = Cypress.env('examples')

    const filterPages = (pages) => pages.filter(p => (!isCharts && !p.page.includes('charts-')) || (isCharts && p.page.includes('charts-')));
    const filterFrameworks = (exs) => exs.filter(e => e.framework === filterFramework);
    const filterImportType = (exs) => exs.filter(e => e.importType === filterType);
    const filterExamples = (exs) => exs

    it('has valid pages', () => {
        expect(pages).to.be.an('array').and.not.be.empty

        let total = 0;
        Cypress._.forEach(filterPages(pages), (p) => {
            const validExamples = filterExamples(filterFrameworks(filterImportType(p.examples)));
            total = total + validExamples.length;

        })
    })

    Cypress._.forEach(filterPages(pages), (p) => {

        const validExamples = filterExamples(filterFrameworks(filterImportType(p.examples)));
        if (validExamples.length > 0) {
            describe(p.page, {
                "retries": {
                    "runMode": 1,
                }
            }, () => {

                Cypress._.forEach(validExamples, (ex) => {

                    const shouldSkip = excludeTest.some(toExclude =>

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
}