import React from 'react'
import $ from 'jquery'
import axios from 'axios'
import { connect } from 'react-redux'
import Title from '../others/title-comp'
import { FadeIn } from 'animate-components'
import { Link, Route, Redirect } from 'react-router-dom'
import Notify from 'handy-notification'
import Tooltip from 'handy-tooltip'
import Timeago from 'handy-timeago'

import Goto from '../others/goto-comp'
import Overlay from '../others/overlay-comp'
import Prompt from '../others/prompt-comp'
import Likes from '../note/likes-comp'
import NProgress from 'nprogress'
import * as fn from '../../functions/functions'
import * as note_int_action from '../../actions/note-int-action'

@connect(store => {
  return {
    note_int: store.note_int
  }
})

export default class View_note extends React.Component {

  state = {
    deleting: false,
    editing: false,
    liked: false,
    invalid_note: false
  }

  componentDidMount = async () => {
    NProgress.start()
    let { match: { params: { note } }, dispatch } = this.props
    let { data } = await axios.post('/api/liked-or-not', { note })
   await this.setState({ liked: data })
    dispatch(note_int_action.note_details(note))
    dispatch(note_int_action.likes(note))
    NProgress.done()

  }

  componentWillReceiveProps = async ({ note_int: { note_details: { note_id } } }) =>
    !note_id ? await this.setState({ invalid_note: true }) : null

  toggle_ = (e, what) => {
    e ? e.preventDefault() : null
    this.setState({ [what]: !this.state[what] })
    what == 'editing' ? $('.v_n_edit').blur() : null
  }

  back = e => fn.back(e, this.props.history)

  delete = e => {
    e.preventDefault()
    let { dispatch, history, match: { params: { note } } } = this.props
    fn.deleteNote({ note, dispatch, history })
  }

  edit = e => {
    this.toggle_(e, "editing")
    let
      title = $('.v_n_title').text(),
      content = $('.v_n_content').text(),
      { dispatch, note_int: { note_details: { note_id } } } = this.props
    fn.editNote({ title, content, note_id, setState: this.setState, dispatch })
  }

  like = e => {
    let
      { dispatch, match: { params: { note } } } = this.props,
      options = { note, dispatch, done: () => this.setState({ liked: true }) }
    fn.like(options)
  }

  unlike = e => {
    let
      { dispatch, match: { params: { note } } } = this.props,
      options = { note, dispatch, done: () => this.setState({ liked: false }) }
    fn.unlike(options)
  }
  toggle = e => {
    let op = e.currentTarget.parentNode.nextSibling
    fn.toggle(op)
  }

  render() {
    let
      { deleting, editing, liked, invalid_note } = this.state,
      { note_int: { likes, note_details: { user, username, title, content, note_time } }, match } = this.props

    Tooltip({
      selector: $('.like_unlike'),
      value: liked ? "No me gusta" : "Me gusta"
    })

    return (
      <div class='view_note modal'>

        {invalid_note ? <Redirect to="/error/note_notfound" /> : null}

        <Title value="View note" />

        <FadeIn duration="300ms" >
          <div className="v_n_header modal_header">
            <span class='title' >Descripcion </span>
            <div class='goto' >
              <div className="goto_link">
                <span className="goto_label">Ir</span>
                <span class="show_more" onClick={this.toggle} >
                  <i class="material-icons">expand_more</i>
                </span>
              </div>
              <div className="options goto_options" style={{ display: "none" }} >
                <ul className="o_ul">
                  {
                    fn.Me(user) ?
                      editing ?

                        <li className="o_li" >    <a
                          href="#"
                          className="v_n_edit sec_btn"
                          onClick={this.edit}
                        >Guardar</a></li>
                        :
                        <li className="o_li" >   <a
                          href="#"
                          className="v_n_edit sec_btn"
                          onClick={e => this.toggle_(e, "editing")}
                        >Editar</a></li>
                      : null
                  }

                  {
                    fn.Me(user) ?
                      <li className="o_li" > <a
                        href="#"
                        className={`v_n_delete sec_btn ${editing ? 'sec_btn_disabled' : ''} `}
                        onClick={e => this.toggle_(e, "deleting")}
                      >Eliminar</a></li>
                      : null
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className="v_n_middle modal_middle">
            <div className="v_n_info">
              <img src={user ? `/users/${user}/user.jpg` : '/images/userPlaceholder.jpg'} alt={username} />
              <div className="v_n_left">
                <Link to={`/profile/${username}`} className='v_n_username' >{username}</Link>
                <span className="v_n_time">{Timeago(note_time)}</span>
              </div>
            </div>
            <span
              className='v_n_title'
              contentEditable={editing}
              spellCheck='false'
              suppressContentEditableWarning={true}
            >{title}</span>
            <span
              className={`v_n_content ${editing ? 'content_editor' : ''} `}
              contentEditable={editing}
              spellCheck='false'
              suppressContentEditableWarning={true}
            >{content}</span>
          </div>
          <div className="v_n_bottom modal_bottom">
            <div className="v_n_int">
              {
                liked ?
                  <span
                    className={`v_n_unlike like_unlike ${editing ? 'like_unlike_disabled' : ''}`}
                    onClick={this.unlike}
                  ><i class="material-icons">favorite</i></span>
                  :
                  <span
                    className={`v_n_like like_unlike ${editing ? 'like_unlike_disabled' : ''}`}
                    onClick={this.like}
                  ><i class="material-icons">favorite_border</i></span>
              }
              <Link
                to={`${match.url}/likes`}
                className={`v_n_likes sec_btn ${editing ? 'sec_btn_disabled' : ''}`}
              >{`${likes.length}`}</Link>
            </div>


            {
              editing ?

                <li className="o_li" >    <a
                  href="#"
                  className="v_n_edit sec_btn"
                  onClick={this.edit}
                >Guardar</a></li>
                :
                <a
                  href='#'
                  className={`v_n_cancel pri_btn ${editing ? 'a_disabled' : ''} `}
                  onClick={this.back}
                >Guardar</a>
            }


          </div>
        </FadeIn>

        {(deleting) ? <Overlay type="white" /> : null}
        {
          deleting ?
            <Prompt
              title={"Eliminar Nota"}
              content={"Esta nota será eliminada y no la podras recuperar."}
              actionText="Eliminar"
              action={this.delete}
              state_updater="deleting"
              close={this.toggle_}
            />
            : null
        }

        <Route path={`${match.url}/likes`} component={() => <Overlay type="white" />} />
        <Route path={`${match.url}/likes`} component={Likes} />

      </div>
    )

  }

}
