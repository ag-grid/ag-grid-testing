/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs');

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {

  /* on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-dev-shm-usage')
      return launchOptions
    }

    return launchOptions
  }) */

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env.examples = getExamples();
  config.env.apiPages = getApiDocumentationPages();
  return config;
}

function getExamples() {
  const basePath = './ag-grid/grid-packages/ag-grid-docs/documentation/doc-pages/'
  var files = fs.readdirSync(basePath);
  var pageGroups = [];

  files.forEach(page => {
    const exampleDir = basePath + page + '/examples/';
    if (fs.existsSync(exampleDir)) {
      const examples = fs.readdirSync(exampleDir);
      let pageExamples = [];

      examples.forEach(example => {
        const exFolder = exampleDir + '/' + example;

        const generatedFolder = `${exFolder}/_gen`
        if (fs.existsSync(generatedFolder)) {
          // Examples follow the _gen generated pattern           
          ['modules', 'packages'].forEach(importType => {
            const importTypeFolder = `${exFolder}/_gen/${importType}/`;
            if (fs.existsSync(importTypeFolder)) {
              const frameworks = fs.readdirSync(importTypeFolder);
              frameworks.forEach(framework => {
                pageExamples.push({ page, example, importType, framework, url: `${page}/${example}/${importType}/${framework}/index.html` });
              })
            }
          })
        } else {

          // Follows the hand written direct copy examples
          const customExampleFolder = exampleDir + example;

          const customContents = fs.readdirSync(customExampleFolder);
          if (customContents.some(f => f === 'app' || !fs.lstatSync(customExampleFolder + '/' + f).isDirectory())) {
            // if there is a file at this level then assume it is the example code
            pageExamples.push({ page, example, url: `${page}/${example}/index.html` });

          } else {
            // assume we have framework folders 
            const frameworks = fs.readdirSync(customExampleFolder);
            frameworks.forEach(framework => {
              pageExamples.push({ page, example, framework, url: `${page}/${example}/${framework}/index.html` });
            })
          }
        }
      })
      pageGroups.push({ page: page, examples: pageExamples });
    }
  })
  return pageGroups;
}

function getApiDocumentationPages() {
  const basePath = './ag-grid/grid-packages/ag-grid-docs/documentation/doc-pages/'
  var files = fs.readdirSync(basePath);
  var pageGroups = [];

  files.forEach(page => {
    const indexFilePath = basePath + page + '/index.md';
    if (fs.existsSync(indexFilePath)) {
      const indexFile = fs.readFileSync(indexFilePath);
      if (indexFile.includes('<api-documentation')) {
        pageGroups.push({ page: page });
      }
    }
  })
  return pageGroups;
}

/* 
function getPages() {
  const basePath = '../ag-grid/grid-packages/ag-grid-docs/documentation/doc-pages/'
  var files = fs.readdirSync(basePath);
  return files;
} */

