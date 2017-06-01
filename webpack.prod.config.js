const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.common.config.js');

module.exports = merge(baseConfig, {
    devtool: 'cheap-module-source-map',

    entry: {
        app: path.resolve(__dirname, 'src/index.js'),
        // 아래와 같이 수동적으로 서드 파티들을 다 추가해줘야한다.
        // 장점으로는 자기가 빼고 싶은 서드 파티만 지정할 수 있다는 점이다.
        // 자신의 앱과 벤더의 크기를 균형있게 맞출 수가 있다.
    },
    output: {
        // entry에 존재하는 app.js, vendor.js로 뽑혀 나온다.
        path: path.resolve(__dirname, 'public'),
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[id].[chunkhash:8].js',
        publicPath: '/js/'
    },

    plugins: [
        // 로더들에게 옵션을 넣어주는 플러그인
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false,
                unused: true // tree shaking(export된 모듈 중 사용하지 않는 모듈은 포함하지않음)
            }
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production'
        }),
        // new ExtractTextPlugin({
        //     filename: '[name].[chunkhash:8].css'
        // }),
        // app.js에 들어갈만한 내용을 vendor로 빼주는 플러그인
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                // this assumes your vendor imports exist in the node_modules directory
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
            // 요 놈은 vendor에 대한 내용
            fileName: '[name].[chunkhash:8]'
        }),
        // index.html 로 의존성 파일들 inject해주는 플러그인
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],

    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             loader: 'babel-loader',
    //             include: path.resolve(__dirname, 'src'),
    //             options: {
    //                 presets: [['es2015', { modules: false }], 'stage-0', 'react'],
    //             },
    //             exclude: /node_modules/,
    //         },
    //         // CSS를 모듈 단위로 사용할 때, (import 구문을 이용한) 사용방법
    //         // {
    //         //     test: /\.(css|less)$/,
    //         //     use: ExtractTextPlugin.extract({
    //         //         fallback: 'style-loader',
    //         //         use: [{loader: 'css-loader', query: {modules: false, sourceMap: true, minimize: true}}, {loader: 'less-loader'}]
    //         //     })
    //         // },
    //         {
    //             test: /\.(css|less)$/,
    //             use: ['style-loader', 'css-loader', 'less-loader']
    //         }
    //     ]
    // }

});
