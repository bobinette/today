const webpackMerge = require('webpack-merge');
const path = require('path');

const prodConfig = require('./webpack.prod');

module.exports = webpackMerge(prodConfig, {
  output: {
    path: path.join(__dirname, '../build'),
  },
});
