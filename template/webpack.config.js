const path = require('path');
const packageData = require('../package');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, 'app.js'),
  resolve: {
    alias: {
      dist: path.resolve(packageData.main)
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: __dirname,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        include: __dirname,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, 'app.html')
    })
  ],
  devtool: "source-map",
  devServer: {
    port: 5210,
    hot: true
  }
};

