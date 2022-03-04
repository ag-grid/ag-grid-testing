const cypress = require('cypress')
const fs = require('fs');
const filterPageExamples = require('./cypress/support/filter-config')

const configFile = './config/cypress.config.json';
if (!fs.existsSync(configFile)) {
    throw new Error('Missing cypress.config.json file. Please run the `npm run download-cypress-config` task first.')
}

const testConfigFile = fs.readFileSync(configFile);
const testConfig = JSON.parse(testConfigFile);
const chunkSize = 40;

async function runConfigTests(framework, importType, isCharts = false, excludeTests = []) {

    const chunks = filterPageExamples(testConfig.examples, framework, importType, isCharts, chunkSize);

    console.log(`Will split ${framework} -> ${importType} ${isCharts ? ' -> charts' : ''} into ${chunks.length} batches to run all tests.`)

    for (let i = 0; i < chunks.length; i++) {
        await runSubBatch(i);
    }

    async function runSubBatch(chunkIndex) {
        console.log(`Running config tests (${chunkIndex + 1}/${chunks.length}) for ${framework} -> ${importType} ${isCharts ? ' -> charts' : ''}`);
        return await cypress.run({
            browser: 'chrome',
            headless: true,
            spec: './cypress/integration/ag-grid/validate-config.spec.js',
            reporterOptions: `mochaFile=test-results/config_${isCharts ? 'charts_' : ''}${framework}_${importType}_${chunkIndex + 1}.xml`,
            env: {
                framework,
                importType,
                isCharts,
                excludeTests,
                chunkIndex,
                chunkSize
            },
        });
    }
}

; (async () => {

    await runConfigTests('vanilla', 'packages', false, [
        { page: 'component-cell-renderer', example: 'dynamic-components' },
        { page: 'component-filter', example: 'filter-component' },
        { page: 'component-floating-filter', example: 'floating-filter-component' },
        { page: 'rxjs' },
    ]);

    /* const runCharts = true;
    await runConfigTests('vanilla', 'packages', runCharts);
    await runConfigTests('typescript', 'packages', runCharts);
    await runConfigTests('angular', 'packages', runCharts);
    await runConfigTests('react', 'packages', runCharts);
    await runConfigTests('reactFunctional', 'packages', runCharts);
    await runConfigTests('vue', 'packages', runCharts);
    await runConfigTests('vue3', 'packages', runCharts); */

    /* await runConfigTests('typescript', 'packages', false, []);
    await runConfigTests('angular', 'modules', false, []);
    await runConfigTests('react', 'modules', false, []);
    await runConfigTests('reactFunctional', 'modules', false, []);
    await runConfigTests('vue', 'modules', false, []); */
    await runConfigTests('vue3', 'packages');
    await runConfigTests('vue3', 'modules');

})()