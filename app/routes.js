'use strict'

module.exports = app => {
  // Pass all GET requests onto the client router
  app.get('/', (req, res) => {
    res.render('pages/home', {
      title: 'Home'
    })
  })
}
