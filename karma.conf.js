const path = require('path');
const puppeteer= require('puppeteer');

const webpackConfig = {
  mode: 'development',
  resolve: {
    alias: {
      src: path.resolve('src')
    },
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|\.spec\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post'
      }
    ]
  },
  devtool: 'inline-source-map'
};

process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (config) {
  config.set({
    basePath: __dirname,
    singleRun: true,
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'src/**/*',
      'test/**/*'
    ],
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'src/**/*.ts': ['webpack']
    },
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-coverage-istanbul-reporter'
    ],
    reporters: [
      'coverage-istanbul'
    ],
    coverageIstanbulReporter: {
      fixWebpackSourcePaths: true,
      reports: ['html'],
      dir: path.join(__dirname, 'coverage')
    },
    webpackMiddleware: {
      stats: 'errors-only',
      logLevel: 'silent'
    },
    webpack: webpackConfig,
  });
};
