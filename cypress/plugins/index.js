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


  // let's increase the browser window size when running headlessly
  // this will produce higher resolution images and videos
  // https://on.cypress.io/browser-launch-api
  // https://www.cypress.io/blog/2021/03/01/generate-high-resolution-videos-and-screenshots/
  on('before:browser:launch', (browser = {}, launchOptions) => {
    console.log(
      'launching browser %s is headless? %s',
      browser.name,
      browser.isHeadless,
    )

    // the browser width and height we want to get
    // our screenshots and videos will be of that resolution
    const width = 1280
    const height = 800

    console.log('setting the browser window size to %d x %d', width, height)

    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push(`--window-size=${width},${height}`)

      // force screen to be non-retina and just use our given resolution
      launchOptions.args.push('--force-device-scale-factor=1')
    }

    // IMPORTANT: return the updated browser launch options
    return launchOptions
  })

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  //const configFile = './config/cypress.config.json';
  const configFile = './cypress.config.json';
  if (!fs.existsSync(configFile)) {
    throw new Error('Missing cypress.config.json file. Please run the `npm run download-cypress-config` task first.')
  }

  const testConfigFile = fs.readFileSync(configFile);
  const testConfig = JSON.parse(testConfigFile);
  config.env.examples = testConfig.examples;
  config.env.apiPages = testConfig.apiPages;
  return config;
}
