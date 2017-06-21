const fs = require('fs');
const ini = require('ini');
const protractorPath = require.resolve('protractor-cucumber-framework');
const request = require('request-promise-native');

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
      ],
    },
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
  onPrepare: authenticate,
  plugins: [{
    package: 'protractor-console-plugin',
    exclude: [
      'favicon',
      'geoloc',
      'gravatar',
    ],
  }],
};

function authenticate() {
  const authConfig = ini.parse(fs.readFileSync('tmp/.auth0.conf', 'utf-8'));
  browser.driver.get('http://localhost:49152/favicon.ico');
  return request.post(authConfig.url, {
      body: JSON.parse(authConfig.data),
      json: true,
    })
    .then(data => browser.driver.executeScript(
      `localStorage.setItem('accessToken', '${data.access_token}')`
    ));
};
