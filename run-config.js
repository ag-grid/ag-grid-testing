const cypress = require('cypress')
const fs = require('fs');
const filterPageExamples = require('./cypress/support/filter-config')
const commander = require('commander');

const options = commander
    .option('--base-url [url]', 'if not provided defaults to https://build.ag-grid.com', 'https://build.ag-grid.com')
    .option('--charts', 'run chart config tests', false)
    .parse(process.argv)
    .opts();

let baseUrl = options.baseUrl === true || !options.baseUrl ? 'https://build.ag-grid.com' : options.baseUrl;
console.log('Using baseUrl:', baseUrl)

let runChartTests = options.charts === true;

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
            spec: './cypress/e2e/ag-grid/validate-config.cy.js',
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
        { page: 'testing-async' },
    ];

    const angularIgnore = [];

    const reactIgnore = [
        { page: 'master-detail-grids', example: 'string-template-customisation' },
        { page: 'master-detail-grids', example: 'template-callback-customisation' },
        { page: 'testing-async' },
    ];

    const vueIgnore = [
        { page: 'testing-async' },
    ]

    const chartsIgnore = [
        { page: 'charts-api-explorer' },
        { page: 'charts-overview', example: 'large-datasets' },
    ];

    if (runChartTests) {

        console.log('Running Chart Tests')
        // All the charts
        const runCharts = true;
        await runConfigTests('vanilla', 'packages', runCharts, chartsIgnore);
        await runConfigTests('typescript', 'packages', runCharts, chartsIgnore);
        await runConfigTests('react', 'packages', runCharts, chartsIgnore); // There are no reactFunctional tests.
        await runConfigTests('vue', 'packages', runCharts, chartsIgnore);
        await runConfigTests('vue3', 'packages', runCharts, chartsIgnore);
        // Memory issues with Angular tests
        await runConfigTests('angular', 'packages', runCharts, chartsIgnore, 10);

    } else {
        console.log('Running Grid Tests')
        // Run standard vanilla packages
        await runConfigTests('vanilla', 'packages', false, jsTsIgnore);

        // Package Framework Tests
        await runConfigTests('typescript', 'packages', false, jsTsIgnore);
        await runConfigTests('angular', 'packages', false, angularIgnore, 20);
        await runConfigTests('react', 'packages', false, reactIgnore);
        await runConfigTests('reactFunctional', 'packages', false, reactIgnore);
        await runConfigTests('reactFunctionalTs', 'packages', false, reactIgnore);
        await runConfigTests('vue', 'packages', false, vueIgnore);
        await runConfigTests('vue3', 'packages', false, vueIgnore);

        // Module Framework Tests
        await runConfigTests('typescript', 'modules', false, jsTsIgnore);
        await runConfigTests('angular', 'modules', false, angularIgnore, 20);
        await runConfigTests('react', 'modules', false, reactIgnore);
        await runConfigTests('reactFunctional', 'modules', false, reactIgnore);
        await runConfigTests('reactFunctionalTs', 'modules', false, reactIgnore);
        await runConfigTests('vue', 'modules', false, vueIgnore);
        await runConfigTests('vue3', 'modules', false, vueIgnore);

        // Run tests for odd examples
        await runConfigTests('UNKNOWN', 'UNKNOWN');
    }
})()