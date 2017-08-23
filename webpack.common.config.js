const webpack = require('webpack');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                options: {
                    presets: [['es2015', { loose: true, modules: false }], 'stage-0', 'react'],
                    plugins: ['syntax-async-functions', 'react-hot-loader/babel', 'syntax-dynamic-import', ['import', { libraryName: 'antd', style: true }], 'transform-decorators-legacy'],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                use: 'json-loader',
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'less-loader'],
            },
        ],
    },
  // plugins: [
  //   new webpack.EnvironmentPlugin([
  //     'NODE_ENV',
  //   ]),
  // ],
};
