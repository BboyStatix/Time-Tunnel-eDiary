import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactAudioPlayer from 'react-audioplayer'

class AudioPlayer extends Component {

  componentWillUnmount() {
    ReactDOM.findDOMNode(this.audioComponent).dispatchEvent(new Event('audio-pause'))
  }

  render() {
    return (
      <ReactAudioPlayer
        playlist={[{name: this.props.songName, src: "/audio/view?jwt=" + localStorage.jwt + "&filename=" + this.props.filename}]}
        autoPlay={true}
        ref={audioComponent => { this.audioComponent = audioComponent }}
      />
    )
  }
}

export default AudioPlayer
