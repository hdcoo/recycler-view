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
        test: /\.js/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      }
    ]
  }
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
      'test/**/*': ['webpack'],
      'src/**/*': ['webpack']
    },
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher'
    ],
    webpack: webpackConfig,
  });
};
