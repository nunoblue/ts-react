const webpack = require('webpack');
const path = require('path');

module.exports = {
    // entry: {
    //     bundle: path.join(__dirname + '/src/index.js')
    // },

//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: ['babel-loader?' + JSON.stringify({
//                     cacheDirectory: true,
//                     presets: ['es2015', 'react']
//                 }), 'eslint-loader'],
//       }
//     ],
//   },
    module: {
        rules: [
            // {
            //     test: /\.js?$/, // both .js and .jsx
            //     loader: 'eslint-loader',
            //     include: path.resolve(process.cwd(), 'src'),
            //     enforce: 'pre',
            //     options: {
            //         fix: true,
            //     }
            // },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                options: {
                    presets: [['es2015', { loose: true, modules: false }], 'stage-0', 'react'],
                    plugins: ['react-hot-loader/babel', "syntax-dynamic-import"]
                },
                exclude: /node_modules/,
            },
             {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader?importLoaders=1', 'less-loader']
            }
        ]
    }
  // plugins: [
  //   new webpack.EnvironmentPlugin([
  //     'NODE_ENV',
  //   ]),
  // ],
};
