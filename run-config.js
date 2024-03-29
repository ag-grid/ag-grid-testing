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

; (async () => {
    // until this is fixed
    const skipPackages = [{importType: 'packages'}];

    await runConfigTests('vanilla', 'modules', false, [
        { page: 'component-cell-renderer', example: 'dynamic-components' },
        { page: 'component-filter', example: 'filter-component' },
        { page: 'component-floating-filter', example: 'floating-filter-component' },
        { page: 'rxjs' },
        ...skipPackages
    ]);
    await runConfigTests('typescript', 'modules', false, skipPackages);
    await runConfigTests('angular', 'modules', false, skipPackages);
    await runConfigTests('reactFunctional', 'modules', false, skipPackages);
    await runConfigTests('vue', 'modules', false, skipPackages);
    await runConfigTests('vue3', 'modules', false, skipPackages);

    //await runConfigTests('typescript', 'packages', false, []);


})()