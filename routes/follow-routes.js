const
  app = require('express').Router(),
  P = require('bluebird'),
  db = require('../models/db')
CRUD = require('../models/api')

// TO CHECK IF SESSION FOLLOWING USER
app.post('/is-following', (req, res) => {
  P.coroutine(function* () {
    let
      { body: { username }, session: { id: session } } = req,
      id = yield db.getId(username)
    let isfollowing = yield CRUD("FollowSystem").ListBYAsync("follow_by=" + session + "&follow_to=" + id.id)
    is = isfollowing.data == null ? false : true
    res.json(is)
  })().catch(e => res.json(e.stack))
})

app.post('/follow', (req, res) => {
  P.coroutine(function* () {
    let
      { user, username } = req.body,
      { username: susername, id: session } = req.session,
      insert = {
        follow_by: session,
        follow_by_username: susername,
        follow_to: user,
        follow_to_username: username,
        follow_time: new Date().getTime()
      },
      f = yield CRUD("FollowSystem").Insert(insert)
    res.json({ ...insert, follow_id: f.insertId })
  })()
})

// TO UNFOLLOW
app.post('/unfollow', (req, res) => {
  P.coroutine(function* () {
    let unfollow = yield CRUD("FollowSystem").Delete("follow_by=" + req.session.id + "&follow_to" + req.body.user)
  })()
})

// TO GET FOLLOWERS
app.post('/get-followers', (req, res) => {
  P.coroutine(function* () {
    let id = yield db.getId(req.body.username)
    let followers = yield CRUD("FollowSystem").ListBYAsync("follow_to=" + id.id)
    let array = []
    if (followers.data != null) {

      if (!Array.isArray(followers.data)) {
        array.push(followers.data)
      } else {
        array = followers.data
      }
    }
    res.json(array)
  })()
})

// TO GET FOLLOWINGS
app.post('/get-followings', (req, res) => {
  P.coroutine(function* () {
    let id = yield db.getId(req.body.username)
    let followings = yield CRUD("FollowSystem").ListBYAsync("follow_by=" + id.id)
    let array = []
    if (followings.data != null) {
      if (!Array.isArray(followings.data)) {
        array.push(followings.data)
      } else {
        array = followings.data
      }
    }
    res.json(array)
  })()
})

// FOR PROFILE VIEW
app.post('/view-profile', (req, res) => {
  P.coroutine(function* () {
    let
      { username } = req.body,
      { id: session } = req.session,
      id = yield db.getId(username)
    let followings = yield CRUD("Profileviews").ListBYAsync("view_by=" + session + "&view_to=" + id.id)
    timeuser = followings.data == null ? 0 : followings.data.view_time

    time = parseInt(new Date().getTime() - parseInt(timeuser))

    if (time >= 120000) {
      let insert = {
        view_by: session,
        view_by_username: username,
        view_to: id.id,
        view_time: new Date().getTime()
      }
      yield CRUD("Profileviews").Insert(insert)

    }

    res.json('Hello, World!!')

  })()
})


// FOR GETTING PROFILE VIEWS
app.post('/get-profile-views', (req, res) => {
  P.coroutine(function* () {
    let
      { username } = req.body,
      id = yield db.getId(username),
      count = 0
    let views = yield CRUD("Profileviews").ListBYAsync("view_to=" + id.id)
    let array = []
    if (views.data != null) {
      if (!Array.isArray(views.data)) {
        array.push(views.data)
      } else {
        array = views.data
      }
    }

    count = array.length
    res.json(count)
  })()
})

module.exports = app
