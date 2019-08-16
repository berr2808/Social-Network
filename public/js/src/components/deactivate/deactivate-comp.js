import React from 'react'
import $ from 'jquery'
import axios from 'axios'
import { FadeIn } from 'animate-components'
import Title from '../others/title-comp'
import * as fn from '../../functions/functions'

import Overlay from '../others/overlay-comp'
import Prompt from '../others/prompt-comp'

export default class Deactivate extends React.Component{

  state = { deactivate: false }

  toggle_ = (e, what) => {
    e ? e.preventDefault() : null
    switch (what) {
      case "deactivate":
        this.setState(state => ({ deactivate: !state.deactivate }))
        break
    }
  }

  deactivate = e => {
    e.preventDefault()
    fn.deactivate()
  }

  render(){
    let { deactivate } = this.state

    return (
      <div>
        <Title value="Deactivate your account" />
        <FadeIn duration="300ms" >
          <div class="registered deactivate" >
            <span className="deactivate_title" >¿Estas seguro de desactivar tu cuenta?</span>
            <span>Todas sus publiciones, seguidores, seguidores e información se eliminarán permanentemente. Y no podrás volver a encontrarlo.</span>
            <div className="deactivate_btn">
              <a href="#" className="pri_btn d_btn" onClick={e => this.toggle_(e, "deactivate")} >Desactivar</a>
            </div>
          </div>
        </FadeIn>

        {deactivate ? <Overlay /> : null}
        {
          deactivate ?
            <Prompt
              title="Desactiva tu cuenta"
              content="Estás seguro de que quieres desactivar permanentemente tu cuenta? No hay deshacer, por lo que no podrá iniciar sesión con esta cuenta."
              actionText="Desactivar"
              action={this.deactivate}
              state_updater="deactivate"
              close={this.toggle_}
            />
          : null
        }

      </div>
    )
  }

}
