const
  app = require('express').Router(),
  P = require('bluebird'),
  db = require('../models/db')

// CHECK IF SESSION LIKED THE NOTE OR NOT
app.post('/liked-or-not', (req, res) => {
  P.coroutine(function* () {
    let
      { body, session } = req

    let Isliked = yield CRUD("Likes").ListBYAsync("like_by=" + session.id + "&note_id=" + body.note)
    if (Isliked.data != null) {
      let is = Isliked.data["like_id"]
      res.json(is == 0 ? false : true)
    } else {
      res.json(false)
    }

  })()
})

// FOR LIKING THE NOTE
app.post('/like', (req, res) => {
  P.coroutine(function* () {
    let
      { session, body } = req,
      insert = {
        like_by: session.id,
        like_by_username: session.username,
        note_id: parseInt(body.note),
        like_time: new Date().getTime()
      },
      f = yield CRUD("Likes").Insert(insert)
    res.json(Object.assign({}, insert, { like_id: f.insertId }))
  })()
})

app.post('/unlike', (req, res) => {
  P.coroutine(function* () {
    let { session, body } = req
    yield CRUD("Likes").Delete("note_id=" + body.note + "&like_by=" + session.id)
    res.json(null)
  })()
})

// GET LIKES OF THE NOTE
app.post('/likes', (req, res) => {
  P.coroutine(function* () {
    let { session, body } = req
    let likes = yield CRUD("Likes").ListBYAsync("note_id=" + req.body.note)
    let array = []
    if (likes.data != null) {
      if (!Array.isArray(likes.data)) {
        array.push(likes.data)
      } else {
        array = likes.data
      }
    }
    res.json(array)
  })()
})

module.exports = app
