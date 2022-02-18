/// <reference types="cypress" />



describe('AG Grid Examples', () => {
    const pages = Cypress.env('examples').filter(e => e.page.includes('component-cell-renderer')).slice(0, 1)
    const updateSnapshots = Cypress.env('updateSnapshots');

    const filterFrameworks = (frameworks) => frameworks.filter(f => true); // f === 'angular'
    const filterImportType = (importTypes) => importTypes.filter(g => g.type === 'packages')

    it('has valid pages', () => {
        expect(pages).to.be.an('array').and.not.be.empty
    })

    if (updateSnapshots) {

        it('generate snapshots', () => {
            expect(true).to.true;
        })

        Cypress._.forEach(pages, (p) => {
            describe(p.page, () => {
                Cypress._.forEach(p.examples, (ex) => {
                    describe(ex.example, () => {

                        Cypress._.forEach(filterImportType(ex.generated), (g) => {
                            describe(g.type, () => {
                                Cypress._.forEach(filterFrameworks(g.frameworks.filter(f => f !== 'typescript')), (f) => {

                                    it(f, () => {
                                        cy.visit(`https://ag-grid.com/examples/${p.page}/${ex.example}/${g.type}/${f}/index.html`)
                                        cy.get('.ag-root-wrapper', { timeout: 10_000 })
                                            .wait(4_000)
                                            .matchImageSnapshot(`${p.page}/${ex.example}/${g.type}/${f}`);
                                    })
                                })
                            });
                        })
                    })
                })
            })
        })
    } else {

        it('compare snapshots', () => {
            expect(true).to.true;
        })

        Cypress._.forEach(pages, (p) => {
            describe(p.page, () => {
                Cypress._.forEach(p.examples, (ex) => {
                    describe(ex.example, () => {

                        Cypress._.forEach(filterImportType(ex.generated), (g) => {
                            describe(g.type, () => {
                                Cypress._.forEach(filterFrameworks(g.frameworks), (f) => {

                                    it(f, () => {

                                        cy.visit(`https://build.ag-grid.com/examples/${p.page}/${ex.example}/${g.type}/${f}/index.html`)
                                        // Compare typescript with javascript as that not on live
                                        const compFramework = f === 'typescript' ? 'javascript' : f;
                                        cy.get('.ag-root-wrapper', { timeout: 10_000 }).wait(4_000)
                                            .matchImageSnapshot(`${p.page}/${ex.example}/${g.type}/${compFramework}`)
                                        // Test framework against plain javascript to catch those diffs too.
                                        // .matchImageSnapshot(`${p.page}/${ex.example}/${g.type}/javascript`);
                                    })
                                })
                            });
                        })
                    })
                })
            })
        })
    }
})