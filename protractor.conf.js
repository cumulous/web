const protractorPath = require.resolve('protractor-cucumber-framework');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    'e2e/features/*.feature',
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'custom',
  frameworkPath: protractorPath,
  cucumberOpts: {
    require: 'e2e/**/*.ts',
    format: 'pretty',
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.json',
    });
  },
  plugins: [{
    package: 'protractor-console-plugin',
    exclude: [
      'favicon',
      'geoloc',
      'gravatar',
    ],
  }],
};
