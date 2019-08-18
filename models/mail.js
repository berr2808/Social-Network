const nodemailer = require('nodemailer')
appConfig = require('../public/js/src/functions/config'),
AppConfig = appConfig.AppConfig

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AppConfig.MAIL,
    pass: AppConfig.MAIL_PASSWORD
  }
})

let mail = options => {
  return new Promise((resolve, reject) => {
    let o = Object.assign({}, {
      from: `${AppConfig.BRANDNAME}"app" <${AppConfig.MAIL}>`
    }, options)
    transporter.sendMail(o, (err, res) => err ? reject(err) : resolve('Mail sent!!'))
  })
}

module.exports = mail
