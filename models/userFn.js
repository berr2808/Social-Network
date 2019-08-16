const
  db = require('../models/db'),
  CRUD = require('../models/api'),
  mail = require('../models/mail'),
  hl = require('handy-log'),
  P = require('bluebird'),
  fs = require('fs'),
  { promisify } = require('util'),
  path = require('path'),
  dir = process.cwd()

const signup = (req, res) => {
  let {
    body: { username, email, password, password_again },
    session
  } = req

  req.checkBody('username', 'El nombre de usuario está vacío.').notEmpty()
  req.checkBody('username', 'El nombre de usuario debe contener solo letras').isAlpha()
  req.checkBody('username', 'El nombre de usuario debe ser mayor a 4 letras').isLength({ min: 4 })
  req.checkBody('username', 'El nombre de usuario debe ser menor a 32 letras').isLength({ max: 32 })

  req.checkBody('email', 'El correo esta vacio').notEmpty()
  req.checkBody('email', 'El correo electrónico es invalido').isEmail()

  req.checkBody('password', 'El campo de contraseña está vacío').notEmpty()
  req.checkBody('password_again', 'El campo de contraseña está vacío').notEmpty()
  req.checkBody('password', 'Las contraseñas no coinciden').equals(password_again)

  P.coroutine(function* () {

    let errors = yield req.getValidationResult()

    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(item => array.push(item.msg))
      res.json({ mssg: array })
    } else {
      let

        usernameCount = yield CRUD("Users").ListBYAsync("username=" + username)
      emailCount = yield CRUD("Users").ListBYAsync("email=" + email)
      if (usernameCount.data != null) {
        res.json({ mssg: "Usuario ya se encuentra en uso!" })
      } else if (emailCount.data != null) {
        res.json({ mssg: "Email ya se encuentra en uso!" })
      } else {
        let
          newUser = {
            username,
            email: req.body.email,
            password,
            email_verified: 0,
            bio: "",
            joined: new Date().getTime()
          },

          { affectedRows, insertId } = yield db.createUser(newUser)
        if (affectedRows == 1) {

          let mkdir = promisify(fs.mkdir)
          yield mkdir(dir + `/public/users/${insertId}`)
          fs
            .createReadStream(dir + '/public/images/userPlaceholder.jpg')
            .pipe(fs.createWriteStream(dir + `/public/users/${insertId}/user.jpg`))

          let
            url = `${process.env.HOST}/deep/most/topmost/activate/${insertId}`,
            options = {
              to: email,
              subject: "Active su cuenta de la aplicación (K)-UCA",
              html: `<span>Hola, Recibiste este mensaje porque creaste una cuenta en la aplicación (K)-UCA.<span><br><span>Haga clic en el botón a continuación para activar su cuenta y explorar.</span><br><br><a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Activate</a>`
            }

          mail(options)
            .then(m => {
              hl.success(m)
              session.id = insertId
              session.username = username
              session.email_verified = 1
              res.json({
                mssg: `Hola,¡ ${session.username}!`,
                success: true
              })
            })
            .catch(me => {
              hl.error(me)
              res.json({
                mssg: `Hola, ${session.username}.¡No se pudo enviar el correo!`,
                success: true
              })
            })

        }

      }

    }

  })()

}
const login = (req, res) => {
  P.coroutine(function* () {
    let {
      body: { username: rusername, password: rpassword },
      session
    } = req

    req.checkBody('username', 'El nombre de usuario está vacío.').notEmpty()
    req.checkBody('password', 'El campo de contraseña está vacío').notEmpty()

    let errors = yield req.getValidationResult()

    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(item => array.push(item.msg))
      res.json({ mssg: array })
    } else {
      let
        userRow = yield CRUD("Users").ListBYAsync("username=" + rusername)
      let data = userRow.data
      if (data === null || data.id === 0) {
        res.json({ mssg: "Usuario no encontrado!" })
      } else if (data.id > 0) {
        let same = yield db.comparePassword(rpassword, data.password)
        if (!same) {
          res.json({ mssg: "¡Contraseña incorrecta!" })
        } else {
          session.id = data.id
          session.username = rusername
          session.email_verified = data.email_verified
          session.token = data.id+rusername+data.email_verified
          res.json({ mssg: `Hola, ${session.username}!!`, success: true })
        }

      }
    }

  })()
}

const registered = (req, res) => {
  P.coroutine(function* () {
    let
      { id } = req.session
    let userRow = yield db.getRowId(id)
    email_verified = userRow.data.email_verified
    options = {
      title: "¡Ya estás registrado!",
      mssg: "E-mail ha sido enviado. ¡Revise su bandeja de entrada y haga clic en el enlace provisto!"
    }

    email_verified == 1 ?
      res.redirect('/')
      :
      res.render("registered", { options })

  })()
}

const activate = (req, res) => {
  P.coroutine(function* () {
    let
      { params: { id }, session } = req, mssg
    let userRow = yield db.getRowId(id)
    userRow.data["email_verified"] = 1
    let changedRows = yield db.updateUser(id, userRow.data)
    session.email_verified = 1
    mssg = changedRows == 0 ? "alr" : "yes"

    res.redirect(`/email-verification/${mssg}`)

  })()
}

module.exports = {
  signup,
  login,
  registered,
  activate,
}
