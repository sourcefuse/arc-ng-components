// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, '../../coverage/ai-assistant-lib'),
      subdir: '.',
      reporters: [
        {type: 'html'},
        {type: 'text-summary'},
        {
          type: 'lcov',
        },
        {
          type: 'json-summary',
        },
      ],
      check: {
        global: {
          statements: 5,
          functions: 5,
        },
      },
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    // by default Chrome UI is used, but we want to run Chrome in headless mode in the CI
    // for that, the CI test script passes the browser name ChromeHeadlessCI
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--remote-debugging-address=0.0.0.0',
          '--remote-debugging-port=9222',
        ],
        debug: true,
      },
    },
    singleRun: false,
    restartOnFileChange: true,
  });
};
