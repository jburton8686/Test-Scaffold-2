'use strict'

const merge = require('lodash.merge')
const webpack = require('webpack')
const baseConfig = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

module.exports = merge(baseConfig, {
  entry: './app/src/client.js',
  output: {
    path: `${__dirname}/../app/static/dist`,
    publicPath: '/static/dist/'
  },
  performance: {
    hints: 'warning'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      DEVMODE: false
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ExtractTextPlugin('style.css'),
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
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract({
          loader: [
            'css-loader?-autoprefixer', // Disable css-loader's internal autoprefixer
            'csso-loader',
            'postcss-loader',
            'sass-loader'
          ],
          fallbackLoader: 'style-loader'
        })
      }
    ]
  }
})
