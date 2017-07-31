const chromeSandboxed = !process.env.CODEBUILD_BUILD_ID;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-scss-preprocessor'),
      require('@angular/cli/plugins/karma'),
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false },
      { pattern: './src/**/*.css' },
      { pattern: './src/theme.scss', included: true, watched: true },
      { pattern: './node_modules/@swimlane/ngx-datatable/release/**/+(index|material|icons).css',
        watched: false, included: false },
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli'],
      './src/theme.scss': ['scss'],
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ config.watch === false ? 'text-summary' : 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul']
              : ['progress', 'kjhtml'],
    port: 8081,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: config.watch === false ? ['ChromeHeadless'] : [],
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
