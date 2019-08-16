import $ from 'jquery'
import { post } from 'axios'
import Notify from 'handy-notification'
import P from 'bluebird'

import * as notes_action from '../actions/notes-action'
import * as user_action from '../actions/user-action'
import * as follow_action from '../actions/follow-action'
import * as note_int_action from '../actions/note-int-action'

// FUNCTION FOR SHORTENING
const shortener = (elem, length) => {
  let
    parse = parseInt(length),
    len = elem.length
  if (!parse) { return; }
  return (len >= parse) ? `${elem.substr(0, length-2)}..` : (len < parse) ? elem : null
}

// FUNCTION TO TOGGLE
const toggle = el => {
  let style = el.style.display
  style === "none" ? el.style.display = "block" : el.style.display = "none"
}

// FUNCTION FOR COMMON LOGIN
const commonLogin = options => {
  let
    { data, btn, url, redirect, defBtnValue } = options,
    overlay2 = $('.overlay-2')

  btn
    .attr('value', 'Por favor espera..')
    .addClass('a_disabled')
  overlay2.show()

  post(url, data)
    .then(s => {
      let { data: { mssg, success } } = s
      if (success) {
        Notify({
          value: mssg,
          done: () => location.href = redirect
        })
        btn.attr('value','Redireccionando ..')
        overlay2.show()
      } else {
        Notify({ value: mssg })
        btn
          .attr('value', defBtnValue)
          .removeClass('a_disabled')
        overlay2.hide()
      }
      btn.blur()
    })
    .catch(e => console.log(e))

}

// FUNCTION TO CAPITALIZE FIRST LETTER OF A WORD
const c_first = str =>
  str.charAt(0).toUpperCase()+str.substr(1)

// FUNCTION TO CHECK WHETHER ITS ME OR NOT
const Me = user =>
  user == $('#data').data('session') ? true : false

// FUNCTION TO CHECK WHETHER EMAIL IS ACTIVATED ON NOT
const e_v = () => {
  let ea = $('.data').data('email-verified')
  return ea == 1 || ea =="yes" ? true : false
}

// TO REMOVE LINE OF LAST ELEMENT
const last_line_remover = () => {
  let
    f = $('.modal_main').children(),
    s = $('.display_content').children().length - 1
  f.eq(s).find('hr').remove()
}

// FUNCTION FOR PROFILE DATA UPDATING
const forProfile = obj => {
  P.coroutine(function *(){
		let
			{ dispatch, username, invalidUser } = obj,
      valid = yield post('/api/is-user-valid', { username }),
      s_username = $('.data').data('username')

    if(!valid.data){
			invalidUser()
    } else {

      if (username != s_username) {
        post('/api/view-profile', { username })
        dispatch(follow_action.is_following(username))
      }

      dispatch(user_action.user_details(username))
      dispatch(notes_action.getNotes(username))
      dispatch(follow_action.get_followers(username))
      dispatch(follow_action.get_followings(username))
      dispatch(follow_action.get_profile_views(username))

    }

  })()
}

// FUNCTION FOR GOING BACK
const back = (e, history) => {
  e.preventDefault()
  history.goBack()
}

// FUNCTION FOR EDTITNG PROFILE
const edit_profile = options => {
  P.coroutine(function *(){

    let
      { susername, semail, username, email, bio } = options,
      button = $('.e_done'),
      { data: uCount} = yield post('/api/what-exists', { what: "username", value: username }),
      { data: eCount } = yield post('/api/what-exists', { what: "email", value: email })

    button.
      addClass('a_disabled')
      .text('Procesando ...')
      .blur()

    if(!username){
        Notify({ value: "¡El nombre de usuario no debe estar vacío!" })
    } else if(!email){
        Notify({ value: "¡El correo electrónico no debe estar vacío!" })
    } else if(uCount == 1 && username != susername){
        Notify({ value: "¡Nombre de usuario ya existe!" })
    } else if(eCount == 1 && email != semail){
        Notify({ value: "¡El Email ya existe!" })
    } else {

      let { data: { mssg, success } } = yield post('/api/edit-profile', { username, email, bio })

      Notify({
        value: mssg,
        done: () => success ? location.reload() : null
      })

    }

    button
      .removeClass('a_disabled')
      .text('Edición realizada')
      .blur()

  })().catch(e => console.log(e.stack) )

}

// FUNCTION FOR CHANGING AVATAR
const change_avatar = options => {
  let
    { file } = options,
    form = new FormData()

	$('.overlay-2').show()
    $('.avatar_span')
      .text('Cambio de avatar ...')
      .addClass('sec_btn_disabled')

    form.append('avatar', file)

    $.ajax({
      url: "/api/change-avatar",
      method: "POST",
      processData: false,
      contentType: false,
      data: form,
      dataType: "JSON",
      success: data => {
        Notify({
          value: data.mssg,
          done: () => location.reload()
        })
      }
    })

}

// FUNCTION FOR RE-SENDING EMAIL VERIFICATION LINK
const resend_vl = () => {
  let
    vl = $('.resend_vl'),
    o = $('.overlay-2')

  vl
    .addClass('a_disabled')
    .text('Enviando enlace de verificación.')

  o.show()

  post('/api/resend_vl')
    .then(s => {
      let { mssg } = s.data
      Notify({ value: mssg })
      vl
        .removeClass('a_disabled')
        .text('Enviar enlace de verificación')
        .blur()
      o.hide()
    })

}

// FUNCTION TO DEACTIVATE ACCOUNT
const deactivate = () => {
  let
    btn = $('.prompt-done'),
    o = $('.overlay')

  btn
    .addClass('a_disabled')
    .text('Desactivando ..')

  o.show()

  post('/api/deactivate')
    .then(d => {
      btn
        .removeClass('a_disabled')
        .text('Desactivado')
      Notify({
        value: "Desactivado",
        done: () => location.href = "/login"
      })
    })
}

// FUNCTION FOR CREATING A NOTE
const createNote = options => {
  let { title, content, dispatch, history } = options

  if(!title || !content){
    Notify({ value: "Faltan valores !" })
  } else {

  post('/api/create-note', { title, content })
    .then(s => {
      dispatch(notes_action.updateNote(s.data))
      history.goBack()
      Notify({ value: 'Nota creada !' })
    })
    .catch(e => console.log(e) )

  }
}

// FUNCTION FOR DELETING NOTE
const deleteNote = options => {
  let { note, dispatch, history } = options
  post('/api/delete-note', { note })
    .then(s => {
      dispatch(notes_action.deleteNote(note))
      history.goBack()
      Notify({ value: s.data.mssg })
    })
    .catch(e => console.log(e) )
}

// FUNCTION FOR EDITING THE NOTE
const editNote = options => {
  let { title, content, note_id, setState, dispatch } = options

  if(title == "" || content == "" ){
    Notify({ value: "Los campos están vacíos!" })
    setState({ editing: true })
  } else {

    post('/api/edit-note', { title, content, note_id })
      .then(s => {
        Notify({ value: s.data.mssg })
        dispatch(notes_action.editNote({ note_id, title, content }))
      })
      .catch(e => console.log(e))

  }

}

// FUNCTION TO FOLLOW
const follow = options => {
  let
    defaults = {
      user: null,
      username: null,
      dispatch: () => { return null },
      update_followers: false,
      update_followings: false,
      done: () => { return null }
    },
    obj = { ...defaults, ...options },
    { user, username, dispatch, update_followers, update_followings, done } = obj

  post('/api/follow', { user, username })
    .then(s => {

      let
        { follow_id, follow_time } = s.data,
        fwing = {
          follow_id: follow_id,
          follow_by: $('.data').data('session'),
          follow_by_username: $('.data').data('username'),
          follow_time: follow_time,
          follow_to: user,
          follow_to_username: username
        }

      update_followers ? dispatch(follow_action.follower(s.data)) : null
      update_followings ? dispatch(follow_action.following(fwing)) : null

      Notify({ value: "Seguido" })
      done()

    })
    .catch(e => console.log(e) )

}

const unfollow = options => {
  let
    defaults = {
      user: null,
      dispatch: () => { return null },
      update_followers: false,
      update_followings: false,
      done: () => { return null }
    },
    obj = { ...defaults, ...options },
    { user, dispatch, update_followers, update_followings, done } = obj

  post('/api/unfollow', { user })
    .then(s => {
      update_followers ? dispatch(follow_action.unfollower($('.data').data('session'))) : null
      update_followings ? dispatch(follow_action.unfollowing(user)) : null

      Notify({ value: "No seguido" })
      done()
    })
    .catch(e => console.log(e) )

}

// TO LIKE THE NOTE
const like = options => {
  let { note, dispatch, done } = options

  post('/api/like', { note })
    .then(s => {
      Notify({ value: "Te gusto" })
      dispatch(note_int_action.liked(s.data))
      done()
    })

}

// TO UNLIKE THE NOTE
const unlike = options => {
  let { note, dispatch, done } = options

  post('/api/unlike', { note })
    .then(u => {
      Notify({ value: "No me gusta" })
      dispatch(note_int_action.unliked(note))
      done()
    })

}

module.exports = {
  shortener,
  toggle,
  commonLogin,
  c_first,
  Me,
  e_v,
  last_line_remover,
  forProfile,
  back,
  edit_profile,
  change_avatar,
  resend_vl,
  deactivate,
  createNote,
  deleteNote,
  editNote,
  follow,
  unfollow,
  like,
  unlike
}
