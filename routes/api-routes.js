const
  app = require('express').Router(),
  db = require('../models/db'),
  P = require('bluebird')

// FOR GETTING THE ID OF ANY USER
app.post('/get-id', (req, res) => {
  db.getId(req.body.username)
    .then(s => res.json(s))
    .catch(e => res.json(e))
})

// FOR CHECKING IF IT'S A VALID USER
app.post('/is-user-valid', (req, res) => {
  P.coroutine(function* () {
    let user = yield CRUD("Users").Count("username=" + req.body.username)
    if (user.data != null) {
      res.json(user.data.id >= 1 ? true : false)
    } else {
      res.json(false)
    }
  })()
})

// /FOR DETAILS OF GIVEN USER
app.post('/get-details', (req, res) => {
  P.coroutine(function* () {
    let user = yield CRUD("Users").ListBYAsync("username=" + req.body.get)
    res.json(user.data)
  })()
})

// FOR EXPLORING NEW USERS
app.post('/explore', (req, res) => {

  P.coroutine(function* () {
    let
      { id: session } = req.session,
      exp = []
    let followings = yield CRUD("Users").ListAsync(),
      data = followings.data
    for (let f of data) {
      let isfollowing = yield CRUD("FollowSystem").ListBYAsync("follow_by=" + session + "&follow_to=" + f.id)
      i = session == f.id ? false : true

      is = isfollowing.data == null ? false : true
      !is && i ? exp.push(f) : null
    }
    res.json(exp)
  })()

})

module.exports = app
