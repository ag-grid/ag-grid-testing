const cypress = require('cypress')

async function runConfigTests(framework, importType, isCharts, excludeTests) {
    console.log(`Running config tests for ${framework} -> ${importType}`);
    return await cypress.run({
        browser: 'chrome',
        headless: true,
        spec: './cypress/integration/ag-grid/validate-config.spec.js',
        reporterOptions: `mochaFile=test-results/config_${isCharts ? 'charts_' : ''}${framework}_${importType}.xml`,
        env: {
            framework,
            importType,
            isCharts,
            excludeTests,
        },
    })
}

async function runApiDocConfigTest() {
    console.log(`Running Api Doc tests`);
    return await cypress.run({
        browser: 'chrome',
        headless: true,
        spec: './cypress/integration/ag-grid/doc-pages.spec.js',
        reporterOptions: `mochaFile=test-results/config_api-docs.xml`
    })
}


; (async () => {

    await runConfigTests('vanilla', 'packages', false, [
        { page: 'component-cell-renderer', example: 'dynamic-components' },
        { page: 'component-filter', example: 'filter-component' },
        { page: 'component-floating-filter', example: 'floating-filter-component' },
        { page: 'rxjs' },
    ]);
    await runConfigTests('vanilla', 'packages', true, []);
    await runConfigTests('typescript', 'packages', false, []);
    await runConfigTests('angular', 'modules', false, []);
    await runConfigTests('react', 'modules', false, []);
    await runConfigTests('reactFunctional', 'modules', false, []);
    await runConfigTests('vue', 'modules', false, []);
    await runConfigTests('vue3', 'modules', false, []);


    await runApiDocConfigTest();

})()