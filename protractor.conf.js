const protractorPath = require.resolve('protractor-cucumber-framework');

const chromeSandboxed = !process.env.CODEBUILD_BUILD_ID;

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    'e2e/features/*.feature',
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        '--headless',
        '--disable-gpu',
        '--disable-web-security',
      ].concat(chromeSandboxed ? [] : '--no-sandbox'),
    },
  },
  directConnect: true,
  framework: 'custom',
  frameworkPath: protractorPath,
  cucumberOpts: {
    require: 'e2e/**/*.ts',
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.json',
    });
  },
  plugins: [{
    package: 'protractor-console-plugin',
  }],
};
