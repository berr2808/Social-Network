import React from 'react'
import $ from 'jquery'
import * as fn from '../../functions/functions'
import { Link } from 'react-router-dom'

export default class Goto extends React.Component{

  toggle = e => {
    let op = e.currentTarget.parentNode.nextSibling
    fn.toggle(op)
  }

  render(){
    let username = $('.data').data('username')
    return(
      <div class='goto' >
        <div className="goto_link">
          <span className="goto_label">Ir</span>
          <span class="show_more" onClick={this.toggle} >
            <i class="material-icons">expand_more</i>
          </span>
        </div>
        <div className="options goto_options" style={{ display: "none" }} >
          <ul className="o_ul">
            <li className="o_li" ><Link to="/" className="o_a">Inicio</Link></li>
            <li className="o_li" ><Link to={`/profile/${username}`} className="o_a">Perfil</Link></li>
          </ul>
        </div>
      </div>
    )
  }
}
