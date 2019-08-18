const
	app = require('express').Router(),
	mw = require('../models/middlewares'),
	login = require('../models/userFn'),
	appConfig = require('../public/js/src/functions/config'),
	P = require('bluebird')
const
 AppConfig = appConfig.AppConfig
app.get('/login', mw.NotLoggedIn, (req, res) => {
	let options = { title: `Login to ${AppConfig.BRANDNAME}` }
	res.render('login', { options })
})

app.get('/signup', mw.NotLoggedIn, (req, res) => {
	let options = { title: `Signup to ${AppConfig.BRANDNAME}` }
	res.render('signup', { options })
})

app.get('/registered', mw.LoggedIn, (req, res) => {
	login.registered(req, res)
})

app.get('/deep/most/topmost/activate/:id', mw.LoggedIn, (req, res) => {
	login.activate(req, res)
})

app.post('/user/signup', (req, res) => {
	login.signup(req, res)
})

app.post('/user/login', (req, res) => {
	login.login(req, res)
})

app.get('/logout', mw.LoggedIn, (req, res) => {
	let url = req.session.reset() ? "/login" : "/"
	res.redirect(url)
})

module.exports = app
