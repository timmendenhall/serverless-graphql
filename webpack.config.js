const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: [/node_modules/, /dist/], loader: 'babel-loader' }
        ]
    },
    stats: {
        colors: true
    },
    // devtool: 'source-map',
    target: 'node',
    externals: [nodeExternals()],
    mode: 'production',
    plugins: [
        new CopyPlugin([
            { from: 'package.json', to: '' },
            { from: 'credentials.json', to: '' },
            { from: '.env.production.yaml', to: '' },
            { from: '.gcloudignore', to: '' },
        ]),
    ],
};