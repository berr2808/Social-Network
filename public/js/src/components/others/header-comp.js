import React from 'react'
import $ from 'jquery'
import { NavLink } from 'react-router-dom'
import * as fn from '../../functions/functions'

export default class Header extends React.Component {
  toggle = e => {
    let op = e.currentTarget.parentNode.nextSibling
    fn.toggle(op)
  }
  render() {
    let
      username = $('.data').data('username'),
      id = $('.data').data('session')

    return (
      <div class='header_loggedin' >
        <div class="left">

        </div>
        <div className="right">
          <NavLink activeClassName="ha_active" exact={true} to="/" >Inico</NavLink>
          <NavLink activeClassName="ha_active" to="/explore" >Explorar</NavLink>

          <a class='goto gotoUserNav'>
            <div className="goto_link">
            <img class='avatarHeader' src={id ? `/users/${id}/user.jpg` : '/images/userPlaceholder.jpg'} alt={username} />

              <span className="goto_label">{username}</span>
              <span class="show_more" onClick={this.toggle} >
                <i class="material-icons">expand_more</i>
              </span>
            </div>
            <div className="options goto_options" style={{ display: "none" }} >
              <ul className="o_ul">
                <li className="o_li" ><NavLink to={`/profile/${username}`} className="o_a">Perfil</NavLink></li>
                <li className="o_li" ><NavLink to={`/profile/${username}/edit`} className="o_a">Editar</NavLink></li>
                <li className="o_li" ><a href="/logout" >Cerrar sesion</a></li>
              </ul>
            </div>
          </a>
        </div>
      </div>
    )
  }
}
