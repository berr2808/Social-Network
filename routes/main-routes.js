const
  app = require('express').Router(),
  mw = require('../models/middlewares'),
appconfig = require('../public/js/src/functions/config')
const
  Appconfig = appconfig.appconfig
app.get('/welcome', mw.NotLoggedIn, (req, res) => {
  let options = { title: `${AppConfig.BRANDNAME}` }
  res.render('welcome', { options })
})

app.get('/404', (req, res) => {
  let options = { title: `Oops!! Error • ${AppConfig.BRANDNAME}` }
  req.session.id ? res.redirect('/error') : res.render('404', { options })
})

app.get('/*', mw.LoggedIn, (req, res) => {
  res.render('app')
})

module.exports = app
