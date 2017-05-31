const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webapck.common.config.js')

module.exports = merge(baseConfig, {
  output: {
    path: path.join(__dirname, '/build'),
    filename: '[name].bundle.[chunkhash].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader',
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('[name].bundle.[chunkhash].css'),
    new UglifyJsPlugin({
      sourceMap: false,
      compress: true,
    }),
    new webpack.LoaderOptionsPlugins({
      minimize: true,
    }),
  ],

});
