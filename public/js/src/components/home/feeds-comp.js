import React from 'react'
import $ from 'jquery'
import { connect } from 'react-redux'
import { Facebook } from 'react-content-loader'
import Nothing from '../others/nothing-comp'
import End from '../others/end-comp'
import Note from '../note/note-comp'
import * as fn from '../../functions/functions'

@connect(store => {
  return {
    notes: store.notes
  }
})

export default class Feeds extends React.Component {
  state = {
    loading: false
  }
  render() {
    let
      { notes: { feeds } } = this.props

    console.log(feeds)
    return (
      <div class='feeds_wrapper' >
        {feeds.length == 0
          ?
          <Nothing mssg="¡No hay publicaciones disponibles!" />
          :
          feeds.map(feed =>
            <Note key={feed.note_id} {...feed} />
          )
        }
        {feeds.length != 0 ? <End /> : null}
      </div>
    )
  }
}
