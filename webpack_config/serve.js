'use strict';

const path = require('path');
const merge = require('webpack-merge');
const common = require('./common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const templateName = process.env.NODE_ENV === 'serve' ? 'example.ejs' : 'example_mini.ejs';
const template = path.resolve('example', templateName);

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publ icPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: '../',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            minimize: true,
                            sourceMap: false,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                    remove: false,
                                }),
                            ],
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template,
            title: 'Entry Example',
            filename: path.resolve('dist', 'index.html'),
            // template: path.resolve('./example/example.html'),
            inject: false,
            hash: true,
        }),
    ],
    devServer: {
        contentBase: './',
        port: 8080,
        historyApiFallback: true,
        // hot: true,
        // inline: true,
        publicPath: '/',
        // historyApiFallback: {
        //     index: '/example/example.html',
        //     rewrites: [
        //         { from: /^\/$/, to: '/example/example.html' },
        //         { from: /^\/lib\/entry-js/, to: '/' },
        //     ],
        // },
        proxy: {
            '/lib/entry-js': {
                target: 'http://localhost:8080',
                pathRewrite: { '^/lib/entry-js': '' },
            },
            '/dist': {
                target: 'http://localhost:8080',
                pathRewrite: { '^/dist': '' },
            },
        },
    },
    devtool: 'source-map',
});
