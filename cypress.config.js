const { defineConfig } = require('cypress');
const { cloudPlugin } = require('cypress-cloud/plugin');
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return cloudPlugin(on, config);
    }
  }
});
