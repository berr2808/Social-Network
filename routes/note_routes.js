const
  app = require('express').Router(),
  P = require('bluebird'),
  db = require('../models/db')

// FOR GETTING ALL THE USER NOTES
app.post('/get-notes', (req, res) => {
  P.coroutine(function* () {
    let
      id = yield db.getId(req.body.get)
    let notes = yield CRUD("Notes").ListBYAsync("user=" + id.id)
    let array = []
    if (!Array.isArray(notes.data)) {
      array.push(notes.data)
    } else {
      array = notes.data
    }
    res.json(array)
  })()
})

// FOR GETTING ALL THE DETAILS OF A NOTE BY A NOTE_ID
app.post('/get-note-details', (req, res) => {
  P.coroutine(function* () {
    let note = yield CRUD("Notes").ListBYAsync("note_id=" + req.body.note)
    res.json(note.data)
  })()
})

// FOR GETTING ALL THE DETAILS OF A NOTE BY A NOTE_ID
app.post('/delete-note', (req, res) => {
  P.coroutine(function* () {
    let { note } = req.body
    yield CRUD("Likes").Delete("note_id=" + note)
    yield CRUD("Notes").Delete("note_id=" + note)
    res.json({ mssg: "Note Deleted!!" })
  })()
})

// FOR EDITING THE NOTE
app.post('/edit-note', (req, res) => {
  P.coroutine(function* () {
    let { title, content, note_id } = req.body
    let
      insert = {
        note_id: note_id,
        user: req.session.id,
        username: req.session.username,
        title: title,
        content: content,
        note_time: new Date().getTime()
      },
      f = yield CRUD("Notes").Update(note_id,insert)

    if (f.isError != true) {
      res.json({ mssg: 'Nota editada!' })

    } else {
      res.json({ mssg: 'Error al editar!' })

    }
  })()


})

// FOR CREATING A NOTE
app.post('/create-note', (req, res) => {
  P.coroutine(function* () {
    let
      { session, body } = req,
      insert = {
        user: session.id,
        username: session.username,
        title: body.title,
        content: body.content,
        note_time: new Date().getTime()
      },
      f = yield CRUD("Notes").Insert(insert)

    let n = Object.assign({}, insert, { note_id: f.insertId })
    res.json(n)
  })()

})

app.post('/no-of-notes', (req, res) => {

  P.coroutine(function* () {
    let notes = yield CRUD("Notes").ListBYAsync("user=" + req.body.user)
    let array = []
    if (notes.data != null) {
      if (!Array.isArray(notes.data)) {
        array.push(notes.data)
      } else {
        array = notes.data
      }
    }
    res.json(array.length)
  })()
})

// GET ALL FEEDS
app.post('/feeds', (req, res) => {
  P.coroutine(function* () {

    let notes = yield CRUD("Notes").ListBYAsync("op=followers&orderDescBy=note_time&user="+ req.session.id)
    let array = []
    if (notes.data != null) {
      if (!Array.isArray(notes.data)) {
        array.push(notes.data)
      } else {
        for (let n of notes.data) {
          if(n.note_id!=null||n.note_id!=undefined){
            array.push(n)
          }
        }
      }
    }
    res.json(array)
  })()
})

module.exports = app
