"use strict";

// tslint:disable: no-require-imports
const {resolve} = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isVerbose = process.argv.includes("--verbose");
const isProduction = process.env.NODE_ENV === "production";
console.log(
            resolve(__dirname, '..', 'src'))
module.exports = ({ config, mode }) => {
    // config.bail = true;
    config.mode = isProduction ? "production" : "development";
    config.module.rules.push(
        { test: /\.sbc$/, loader: 'file-loader?name=data/[name].[ext]?[hash]' },
        {
            include: [
                resolve(__dirname, '..', 'blueprints'),
                resolve(__dirname, '..', 'src'),
                resolve(__dirname, '..', '..', 'app'),
            ],
            test: /\.tsx?$/,
            use: {
                loader: "babel-loader",
                options: {
                    babelrc: false,
                    cacheDirectory: true,
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { legacy: true }],
                        ["@babel/plugin-proposal-class-properties", { loose: true }],
                        ["@babel/plugin-syntax-dynamic-import"],
                        ["@babel/plugin-proposal-optional-chaining"],
                        ["@babel/plugin-proposal-nullish-coalescing-operator"],
                    ],
                    presets: [
                        [
                            "@babel/preset-env",
                            { targets: { browsers: "> 1%" } },
                        ],
                        "@babel/preset-typescript",
                        "@babel/preset-react",
                    ],
                },
            },
        },
    );

    config.plugins.push(
        new ForkTsCheckerWebpackPlugin({silent: process.argv.includes('--json'), tsconfig: 'tsconfig-src.json'}),
    )

    config.devServer = {
        open: false
    }

    config.stats = {
        all: undefined,
        assets: isVerbose,
        assetsSort: "field",
        builtAt: false,
        children: false,
        chunkGroups: isVerbose,
        chunkModules: false,
        chunkOrigins: false,
        chunks: true,
        chunksSort: "field",
        colors: true,
        depth: false,
        entrypoints: false,
        env: false,
        errorDetails: false,
        errors: true,
        hash: isVerbose,
        moduleTrace: true,
        modules: false,
        performance: true,
        providedExports: true,
        publicPath: true,
        timings: true,
        version: isVerbose,
        warnings: true,
        warningsFilter: [/ed25519/],
    };

    // Dont want to see typescript errors in console here.
    // // config.plugins.push(
    // //     new ForkTsCheckerWebpackPlugin({tsconfig: "tsconfig-src.json", silent: process.argv.includes("--json")}),
    // // );

    // Optional // config.plugins.push(new TSDocgenPlugin());
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = {
        "@sepraisal/app/lib": resolve(__dirname, '..', '..', 'app', 'src'),
        "@sepraisal/app": resolve(__dirname, '..', '..', 'app', 'src'),
    }

    return config;
};
