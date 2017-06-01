const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.common.config.js');

const devPort = 3001;

module.exports = merge(baseConfig, {
    devtool: 'eval-source-map',

    entry: {
        bundle: [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:'+devPort,
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, 'src/index.js')
        ]
    },

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].[hash:8].js'
    },

    devServer: {
        inline: true,
        port: devPort,
        contentBase: path.resolve(__dirname, 'public'),
        hot: true,
        publicPath: '/',
        historyApiFallback: true,
        // proxy: {
        //     "**": {
        //         target: "http://localhost:8080/api",
        //         secure: false,
        //         prependPath: false
        //     }
        // }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(), // HMR을 사용하기 위한 플러그인
        new webpack.NamedModulesPlugin(), //브라우저에서 HMR 에러발생시 module name 표시
        new webpack.NoEmitOnErrorsPlugin(), // console에 에러로그 찍어줌
        new webpack.optimize.CommonsChunkPlugin({ // app.js에 들어갈만한 내용을 vendor로 빼주는 플러그인
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/src/index.html'
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        }),
    ],
});
