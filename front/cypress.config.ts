import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    charts: true,
    reportPageTitle: 'Angular Cypress E2E Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // JUnit Reporter (for CI/CD)
      // require('cypress-junit-reporter/plugin')(on);
      return require('./cypress/plugins/index.ts').default(on, config);
    },
    baseUrl: 'http://localhost:4200',
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
