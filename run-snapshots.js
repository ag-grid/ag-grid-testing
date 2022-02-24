const cypress = require('cypress')

const shouldUpdateSnapshots = process.argv[3] == 'updateSnapshots';
if (shouldUpdateSnapshots) {
    console.log('updateSnapshots passed so will update snapshots');
}

async function runSnapshotTests(framework) {
    console.log('Running example snapshots for ', framework)
    return await cypress.run({
        browser: 'chrome',
        headless: true,
        spec: './cypress/integration/themes/examples.spec.js',
        reporterOptions: `mochaFile=test-results/snapshots_${framework}.xml`,
        env: {
            framework: framework,
            updateSnapshots: shouldUpdateSnapshots
        },
    })
}

async function runDemoSnapshot() {
    console.log('Running demo snapshot')
    return await cypress.run({
        browser: 'chrome',
        headless: true,
        spec: './cypress/integration/themes/demo.spec.js',
        reporterOptions: `mochaFile=test-results/snapshots_demo.xml`,
        env: {
            updateSnapshots: shouldUpdateSnapshots
        }
    })
}

; (async () => {
    await runDemoSnapshot();
    await runSnapshotTests('vanilla');
    await runSnapshotTests('typescript');
    await runSnapshotTests('angular');
    await runSnapshotTests('react');
    await runSnapshotTests('reactFunctional');
    await runSnapshotTests('vue');
    await runSnapshotTests('vue3');
})()