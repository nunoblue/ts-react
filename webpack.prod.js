const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./webapck.common.js')

module.exports = merge(baseConfig, {
  output: {
    path: 'build',
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
