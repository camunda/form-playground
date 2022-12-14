const coverage = process.env.COVERAGE;

const { DefinePlugin } = require('webpack');

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const singleStart = process.env.SINGLE_START;

// use puppeteer provided Chrome for testing
process.env.CHROME_BIN = require('puppeteer').executablePath();

const suite = coverage ? 'test/coverageBundle.js' : 'test/testBundle.js';

module.exports = function(karma) {

  const config = {

    frameworks: [
      'webpack',
      'mocha',
      'sinon-chai'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [ suite ]: [ 'webpack', 'env' ]
    },

    reporters: [ 'progress' ].concat(coverage ? 'coverage' : []),

    coverageReporter: {
      reporters: [
        { type: 'lcov', subdir: '.' }
      ]
    },

    browsers,

    singleRun: true,
    autoWatch: false,

    webpack: {
      mode: 'development',
      resolve: {
        modules: [
          'node_modules',
          __dirname
        ]
      },
      module: {
        rules: [
          {
            test: /\.css$/i,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [].concat(
                  coverage ? [
                    [
                      'istanbul', {
                        include: [
                          'src/**'
                        ]
                      }
                    ]
                  ] : []
                )
              }
            }
          }
        ]
      },
      plugins: [
        new DefinePlugin({

          // @barmac: process.env has to be defined to make @testing-library/preact work
          'process.env': {}
        })
      ],
      devtool: 'eval-source-map'
    }
  };

  if (singleStart) {
    config.browsers = [].concat(config.browsers, 'Debug');
    config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
  }

  karma.set(config);
};
