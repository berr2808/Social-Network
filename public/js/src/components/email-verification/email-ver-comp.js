import React from 'react'
import PropTypes from 'prop-types'
import Title from '../others/title-comp'
import { FadeIn } from 'animate-components'
import { Link } from 'react-router-dom'

export default class EmailVerification extends React.Component{
  render(){
    let
      { params: { is } } = this.props.match,
      mssg

    if(is == "yes"){
      mssg = "Su correo electrónico ha sido verificado con éxito!"
    } else if(is == "alr"){
      mssg = "orreo electrónico ya verificado!"
    } else {
      mssg = "Something went wrong!"
    }

    return(
      <div>
        <Title value="E-mail verification"/>
        <FadeIn duration="300ms" >
          <div class="registered">
            <span>{mssg}</span>
            <Link ClassName="editar ha_active" to={`/`} >Inicio</Link>
          </div>
        </FadeIn>
      </div>
    )
  }
}
