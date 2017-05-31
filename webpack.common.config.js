const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    bundle: path.join(__dirname + '/src/index.js')
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
    ]),
  ],
};
