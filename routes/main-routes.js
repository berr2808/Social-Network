const
  app = require('express').Router(),
  mw = require('../models/middlewares')

app.get('/welcome', mw.NotLoggedIn, (req, res) => {
	let options = { title: "(K)-UCA!" }
	res.render('welcome', { options })
})

app.get('/404', (req, res) => {
	let options = { title: "Oops!! Error • (K)-UCA" }
	req.session.id ? res.redirect('/error') : res.render('404', { options })
})

app.get('/*', mw.LoggedIn,  (req, res) => {
	res.render('app')
})

module.exports = app
