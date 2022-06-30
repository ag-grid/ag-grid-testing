
const lodash = require('lodash')

module.exports = (pageExamples, framework, importType, isCharts, chunkSize) => {
    const filterPages = (ps) => ps.filter(p => (!isCharts && !p.page.startsWith('charts-')) || (isCharts && p.page.startsWith('charts-')));
    const filterFrameworks = (exs) => exs.filter(e => e.framework === framework);
    const filterImportType = (exs) => exs.filter(e => e.importType === importType);
    const filterExamples = (exs) => exs

    const pagesWithValidExamples = [];
    filterPages(pageExamples).forEach(page => {
        const validExamples = filterExamples(filterFrameworks(filterImportType(page.examples)));
        if (validExamples.length > 0) {
            pagesWithValidExamples.push(page)
        }
    })

    const chunks = lodash.chunk(pagesWithValidExamples, chunkSize)
    return chunks;
}

