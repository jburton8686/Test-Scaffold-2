'use strict'

// Dependencies
require('dotenv').config({ silent: false })
const express = require('express')
const helmet = require('helmet')

// Configuration
const app = express()
app.set('port', process.env.WEB_SERVER_PORT || 5000)
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
app.use('/static', express.static(`${__dirname}/static`))
app.use(helmet())

// Database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)

// Webpack HMR for development
if (process.env.APP_ENV === 'development') {
  // Create & configure a webpack compiler
  const webpack = require('webpack')
  const webpackConfig = require('../build/webpack.development.config')
  const compiler = webpack(webpackConfig)

  // Attach the dev middleware to the compiler & the server
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))

  // Attach the hot middleware to the compiler & the server
  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
  }))
}

// Routes
require('./routes')(app)

// Start the server
app.listen(app.get('port'), err => {
  if (err) console.error(err)
  else console.log(`Server started: http://localhost:${app.get('port')}/`)
})
