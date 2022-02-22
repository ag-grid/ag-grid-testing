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

const {
  addMatchImageSnapshotPlugin,
} = require('cypress-image-snapshot/plugin');


/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {

  addMatchImageSnapshotPlugin(on, config);

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const configFile = './config/cypress.config.json';
  if (!fs.existsSync(configFile)) {
    throw new Error('Missing cypress.config.json file. Please run the `npm run download-cypress-config` task first.')
  }

  const testConfigFile = fs.readFileSync(configFile);
  const testConfig = JSON.parse(testConfigFile);
  config.env.examples = testConfig.examples;
  config.env.apiPages = testConfig.apiPages;
  return config;
}

