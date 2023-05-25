const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  reporter: 'junit',
  reporterOptions: {
    toConsole: false,
  },
  numTestsKeptInMemory: 1,
  modifyObstructiveCode: false,
  trashAssetsBeforeRuns: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
  blockHosts: [
    "*youtube.com",
    "*geolocation.onetrust.com",
    "*google-analytics.com",
    '*cdn.cookielaw.org',
    "*stats.g.doubleclick.net",
    "*googletagmanager.com",
    "plausible.io"
  ]
})
