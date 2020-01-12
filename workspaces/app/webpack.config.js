/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')


const sourcePath = path.join(__dirname, './src');
const IS_PRODUCTION = process.argv.indexOf('--production') >= 0;


module.exports = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    entry: {
        main: [
            '@babel/polyfill',
            './src/index',
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        },
    },
    module: {
        rules: [
            { test: /\.css$/, loaders: [ 'style-loader', 'css-loader' ] },
            { test: /\.html$/, use: 'html-loader' },
            { test: /\.svg$/, use: 'svg-loader?name=img/[name].[ext]?[hash]' },
            { test: /\.jpg$/, use: 'file-loader?name=img/[name].[ext]?[hash]' },
            { test: /\.png$/, use: 'file-loader?name=img/[name].[ext]?[hash]' },
            { test: /\.woff2?$/, use: 'file-loader?name=fonts/[name].[ext]?[hash]' },
            // { test: /\.png$/, use: 'url-loader?limit=10000' },
            { test: /\.sbc$/, loader: 'file-loader?name=data/[name].[ext]?[hash]' },

            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                "@babel/preset-env",
                                { targets: { browsers: "> 1%" } } // or whatever your project requires
                            ],
                            "@babel/preset-typescript",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                            ["@babel/plugin-proposal-decorators", { legacy: true }],
                            ["@babel/plugin-proposal-class-properties", { loose: true }],
                            ["@babel/plugin-proposal-optional-chaining"],
                            ["@babel/plugin-proposal-nullish-coalescing-operator"],
                            // "react-hot-loader/babel",  // Breaks RHL: https://github.com/gaearon/react-hot-loader/issues/1236
                        ]
                    }
                }
            },
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({silent: process.argv.includes('--json'), tsconfig: 'tsconfig-src.json'}),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({template: path.join('static', 'index.html') }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/)  // Leave out moment.js locales.
    ],

    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                },
            },
        },
    },

    devServer: {
        https: true,
    }

}
