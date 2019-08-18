import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import {AppConfig }from '../../functions/config'

export default class Title extends React.Component {
  render(){
    return (
      <Helmet>
        <title>{ this.props.value } • {AppConfig.BRANDNAME}</title>
      </Helmet>
    )
  }
}

Title.propTypes = {
  value: PropTypes.string
}
