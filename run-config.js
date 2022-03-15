const cypress = require('cypress')
const fs = require('fs');
const filterPageExamples = require('./cypress/support/filter-config')
const commander = require('commander');

const options = commander
    .option('--base-url [url]', 'if not provided defaults to https://build.ag-grid.com', 'https://build.ag-grid.com')
    .parse(process.argv)
    .opts();

let baseUrl = options.baseUrl === true || !options.baseUrl ? 'https://build.ag-grid.com' : options.baseUrl;
console.log('Using baseUrl:', baseUrl)

const configFile = './config/cypress.config.json';
if (!fs.existsSync(configFile)) {
    throw new Error('Missing cypress.config.json file. Please run the `npm run download-cypress-config` task first.')
}

const testConfigFile = fs.readFileSync(configFile);
const testConfig = JSON.parse(testConfigFile);
const baseChunkSize = 40;

async function runConfigTests(framework, importType, isCharts = false, excludeTests = [], overrideChunkSize) {

    const chunkSize = overrideChunkSize ?? baseChunkSize;
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
                chunkSize,
                baseUrl
            },
        });
    }
}

; (async () => {

    const jsTsIgnore = [
        { page: 'component-cell-renderer', example: 'dynamic-components' },
        { page: 'component-filter', example: 'filter-component' },
        { page: 'component-floating-filter', example: 'floating-filter-component' },
        { page: 'rxjs' },
    ];

    const reactIgnore = [
        { page: 'master-detail-grids', example: 'string-template-customisation' },
        { page: 'master-detail-grids', example: 'template-callback-customisation' },
    ];

    // Run standard vanilla packages
    await runConfigTests('vanilla', 'packages', false, jsTsIgnore);

    // All the charts
    const runCharts = true;
    await runConfigTests('vanilla', 'packages', runCharts);
    await runConfigTests('typescript', 'packages', runCharts);
    await runConfigTests('react', 'packages', runCharts); // There are no reactFunctional tests.
    await runConfigTests('vue', 'packages', runCharts);
    await runConfigTests('vue3', 'packages', runCharts);
    // Memory issues with Angular tests
    await runConfigTests('angular', 'packages', true, [], 10);

    // Package Framework Tests
    await runConfigTests('typescript', 'packages', false, jsTsIgnore);
    await runConfigTests('angular', 'packages', false, [], 20);
    await runConfigTests('react', 'packages', false, reactIgnore);
    await runConfigTests('reactFunctional', 'packages', false, reactIgnore);
    await runConfigTests('vue', 'packages');
    await runConfigTests('vue3', 'packages');

    // Module Framework Tests
    await runConfigTests('typescript', 'modules', false, jsTsIgnore);
    await runConfigTests('angular', 'modules', false, [], 20);
    await runConfigTests('react', 'modules', false, reactIgnore);
    await runConfigTests('reactFunctional', 'modules', false, reactIgnore);
    await runConfigTests('vue', 'modules');
    await runConfigTests('vue3', 'modules');

    // Run tests for odd examples
    await runConfigTests('UNKNOWN', 'UNKNOWN');

})()