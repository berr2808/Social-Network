import $ from 'jquery'
import Notify from 'handy-notification'
import { commonLogin } from '../functions/functions'

$('form.form_register').submit(e => {
  e.preventDefault()

  let
    username = $('.r_username').val(),
    email = $('.r_email').val(),
    password =  $('.r_password').val(),
    password_again = $('.r_password_again').val()

  if(!username || !email || !password || !password_again ){
    Notify({ value: "Faltan valores !!" })
  } else if(password != password_again){
    Notify({ value: "¡Las contraseñas no coinciden!" })
  } else {

    let signupOpt = {
      data: {
        username,
        email,
        password,
        password_again
      },
      btn: $('.r_submit'),
      url: "/user/signup",
      redirect: "/registered",
      defBtnValue: "Registrate gratis",
    }
    commonLogin(signupOpt)

  }

})

$('form.form_login').submit(e => {
  e.preventDefault()

  let
    username = $('.l_username').val(),
    password = $('.l_password').val()

  if(!username || !password){
    Notify({ value: "Faltan valores!" })
  } else {

    let loginOpt = {
      data: {
        username: $('.l_username').val(),
        password: $('.l_password').val()
      },
      btn: $('.l_submit'),
      url: "/user/login",
      redirect: "/",
      defBtnValue: "Inicia sesión para continuar",
    }
    commonLogin(loginOpt)

  }

})
