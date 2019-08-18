const
  app = require('express').Router(),
  P = require('bluebird'),
  root = process.cwd(),
  db = require('../models/db'),
  mail = require('../models/mail'),
  upload = require('multer')({
    dest: `${root}/public/temp/`
  }),
  fs = require('fs'),
  { promisify } = require('util'),
  { ProcessImage, DeleteAllOfFolder } = require('handy-image-processor'),
  appConfig = require('../public/js/src/functions/config'),
  AppConfig = appConfig.AppConfig
// FOR GETTING THE COUNT OF GIVEN FIELD
app.post('/what-exists', (req, res) => {
  P.coroutine(function* () {
    let { what, value } = req.body
    let exists = yield CRUD("Users").ListBYAsync(what + "=" + value)
    let array = []
    if (!Array.isArray(exists.data)) {
      array.push(exists.data)
    } else {
      array = exists.data
    }
    res.json(array.length)
  })()
})

// FOR EDTING PROFILE
app.post('/edit-profile', (req, res) => {
  P.coroutine(function* () {
    let
      { username, email, bio } = req.body,
      { id: session } = req.session

    req.checkBody('username', 'Username is empty').notEmpty()
    req.checkBody('username', 'Username must contain only leters').isAlpha()
    req.checkBody('username', 'Username must be greater than 4').isLength({ min: 4 })
    req.checkBody('username', 'Username must be less than 32').isLength({ max: 32 })

    req.checkBody('email', 'Email is empty').notEmpty()
    req.checkBody('email', 'Email is invalid').isEmail()

    let errors = yield req.getValidationResult()

    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(item => array.push(item.msg))
      res.json({ mssg: array })

    } else {
      let user = yield CRUD("Users").ListBYAsync("id=" + session)
      let notes = yield CRUD("Notes").ListBYAsync("user=" + session)
      let Profileviews = yield CRUD("Profileviews").ListBYAsync("view_by=" + session)
      let FollowSystem = yield CRUD("FollowSystem").ListBYAsync("follow_by=" + session)
      let Likes = yield CRUD("Likes").ListBYAsync("like_by=" + session)
      if (username != user.data["username"]) {
        if (Likes.data != null) {
          if (Array.isArray(Likes.data)) {
            for (let n of Likes.data) {
              n.like_by_username = username
              yield CRUD("Likes").Update(n.like_id, Likes.data)
            }
          } else {
            yield CRUD("Profileviews").Update(Likes.data.like_id, Likes.data)

          }

        }
        if (FollowSystem.data != null) {
          if (Array.isArray(FollowSystem.data)) {
            for (let n of FollowSystem.data) {
              n.follow_by_username = username
              yield CRUD("FollowSystem").Update(n.follow_id, n)
            }
          } else {
            yield CRUD("Profileviews").Update(FollowSystem.data.follow_id, FollowSystem.data)

          }

        }
        if (Profileviews.data != null) {
          if (Array.isArray(Profileviews.data)) {
            for (let n of Profileviews.data) {
              n.view_by_username = username
              yield CRUD("Profileviews").Update(n.view_id, n)
            }
          } else {
            yield CRUD("Profileviews").Update(Profileviews.data.view_id, Profileviews.data)

          }
        }
        if (notes.data != null) {
          for (let n of notes.data) {
            n.username = username
            yield CRUD("Notes").Update(n.note_id, n)
          }
        }
      }

      user.data["username"] = username
      user.data["email"] = email
      user.data["bio"] = bio
      let responseUser = yield CRUD("Users").Update(session, user.data)
      req.session.username = username

      if (responseUser.data >= 1) {
        res.json({
          mssg: 'Perfil editado!!',
          success: true
        })
      } else {
        res.json({
          mssg: 'Error al editar perfil!',
          success: false
        })
      }
    }

  })()
})

// FOR CHANGING AVATAR
app.post('/change-avatar', upload.single('avatar'), (req, res) => {
  P.coroutine(function* () {
    let obj = {
      srcFile: req.file.path,
      width: 200,
      height: 200,
      destFile: `${root}/public/users/${req.session.id}/user.jpg`
    }

    yield ProcessImage(obj)
    yield DeleteAllOfFolder(`${root}/public/temp/`)

    res.json({ mssg: "Avatar changed!" })
  })()
})

// FOR RESENDING THE VERIFICATION LINK
app.post('/resend_vl', (req, res) => {
  P.coroutine(function* () {
    let
      { id } = req.session
    let userRow = yield db.getRowId(id),
      email = userRow.data.email
    url = `${AppConfig.HOST}/deep/most/topmost/activate/${id}`,
      options = {
        to: email,
        subject:` " Active su cuenta de la aplicación ${AppConfig.BRANDNAME}"`,
        html: `<span>${AppConfig.BRANDNAME}.<span><br><span>Haga clic en el botón a continuación para activar su cuenta y explorar.</span><br><br><a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Activar</a>`
      }
    yield mail(options)
    res.json({ mssg: "Enlace de verificación enviado a su correo electrónico!" })
  })()
})

app.post('/deactivate', (req, res) => {
  P.coroutine(function* () {
    let
      { id, username } = req.session,
      rmdir = promisify(fs.rmdir)
    yield CRUD("Profileviews").Delete("view_by" + id)
    yield CRUD("Profileviews").Delete("view_t" + id)
    yield CRUD("FollowSystem").Delete("follow_by" + id)
    yield CRUD("FollowSystem").Delete("follow_to" + id)

    yield CRUD("Likes").Delete("like_by" + id)
    yield CRUD("Profileviews").Delete("view_by" + id)
    yield CRUD("Profileviews").Delete("view_by" + id)

    let notes = yield CRUD("Notes").ListBYAsync("user=" + id)
    if (notes.data != null) {
      if (Array.isArray(notes.data)) {
        for (let n of notes.data) {
          yield CRUD("Likes").Delete("note_id" + n.note_id)
        }
      } else {
        yield CRUD("Likes").Delete("note_id" + notes.data.note_id)

      }
    }
    let notesA = yield CRUD("Notes").ListBYAsync("user=" + id)
    if (notesA.data != null) {
      if (Array.isArray(notesA.data)) {
        for (let n of notesA.data) {
          yield CRUD("Notes").Delete("note_id" + n.note_id)
        }
      } else {
        yield CRUD("Notes").Delete("note_id" + notesA.data.note_id)
      }
    }
    yield CRUD("Users").Delete("id" + id)

    yield DeleteAllOfFolder(`${root}/public/users/${id}/`)
    yield rmdir(`${root}/public/users/${id}/`)

    req.session.id = null

    res.json({ success: true })

  })().catch(e => console.log(e.stack))

})

module.exports = app
