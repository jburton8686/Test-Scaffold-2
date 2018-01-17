'use strict'

const fs = require('fs')
const merge = require('lodash.merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.config')
const browsersync = require('browser-sync-webpack-plugin')
const autoprefixer = require('autoprefixer')

// Set var with fallbacks in case the env file failed to load or the env var is missing
require('dotenv').config({ silent: true })

const port = Number(process.env.WEB_SERVER_PORT) || 5000

module.exports = merge(baseConfig, {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './app/src/client.js'
  ],
  output: {
    publicPath: '/dev-assets/'
  },
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new browsersync(
      // BrowserSync options
      {
        host: 'localhost',
        port: port + 1,
        proxy: `localhost:${String(port)}`,
        ui: false,
        files: 'app/views/**/*.pug',
        open: false,
        notify: false,
        injectChanges: false
      },
      // Plugin options
      {
        reload: false
      }
    ),
    // This is until these loaders are updated for the new config system
    new webpack.LoaderOptionsPlugin({
      options: {
        // Enables this workaround setup to work
        context: __dirname,
        // Actual options
        postcss: () => [
          autoprefixer({
            browsers: ['last 1 version']
          })
        ]
      }
    })
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc',
          emitError: true,
          emitWarning: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader?fixUrls', // This is to fix sourcemaps breaking relative URLs in CSS
          'css-loader?sourceMap&-autoprefixer', // Disable css-loader's internal autoprefixer
          'postcss-loader',
          'sass-loader?sourceMap'
        ]
      }
    ]
  }
})
