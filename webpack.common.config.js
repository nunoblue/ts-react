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
        loader: ['babel-loader?' + JSON.stringify({
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }), 'eslint-loader'],
      }
    ],
  },

  // plugins: [
  //   new webpack.EnvironmentPlugin([
  //     'NODE_ENV',
  //   ]),
  // ],
};
