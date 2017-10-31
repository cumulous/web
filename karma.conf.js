const chromeSandboxed = !process.env.CODEBUILD_BUILD_ID;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-scss-preprocessor'),
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false },
      { pattern: './src/**/*.css' },
      { pattern: './src/theme.scss', watched: true, included: true },
      { pattern: './node_modules/@swimlane/ngx-datatable/release/**/+(index|material|icons).css',
        watched: false, included: false },
      { pattern: './node_modules/swagger-ui-dist/swagger-ui.css', watched: false, included: false },
    ],
    preprocessors: {
      './src/theme.scss': ['scss'],
    },
    coverageIstanbulReporter: {
      reports: [ config.watch === false ? 'text-summary' : 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'test',
    },
    reporters: ['progress', 'kjhtml'],
    port: 8081,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: config.browsers.length ? config.browsers : ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
        ].concat(chromeSandboxed ? [] : '--no-sandbox'),
      },
    },
    singleRun: false
  });
};
