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
                    plugins: ['react-hot-loader/babel', 'syntax-dynamic-import', ['import', { libraryName: 'antd', style: true }]],
                },
                exclude: /node_modules/,
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
