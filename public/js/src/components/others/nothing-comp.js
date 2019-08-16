import React from 'react'
import PropTypes from 'prop-types'

export default class Nothing extends React.Component{

  render(){
    let { mssg, showMssg } = this.props
    return(
      <div class='home_last_mssg' style={ !showMssg ? { border: "none" } : null } >
        <img src='/images/loading.gif' />
        { showMssg ? <span>{mssg}</span> : null }
      </div>
    )
  }
}

Nothing.defaultProps = {
  mssg: " Hola, un mensaje para ti!",
  showMssg: true
}

Nothing.propTypes = {
  mssg: PropTypes.string,
  showMssg: PropTypes.bool
}
