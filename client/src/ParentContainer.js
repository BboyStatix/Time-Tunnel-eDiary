import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import MainContainer from './MainContainer'
import EntryContainer from './EntryContainer'
import AudioPlayer from './AudioPlayer'

import './css/AudioPlayer.css'

import Draggable from 'react-draggable'

class ParentContainer extends Component {
  constructor(props){
    super(props)
    this.audioHandler = this.audioHandler.bind(this)
    this.state = {
      audioPlayerVisible: false,
      songName: '',
      filename: ''
    }
  }

  audioHandler(songName, filename) {
    this.setState({audioPlayerVisible: true, songName: songName, filename: filename})
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={(props) => <MainContainer audioHandler={this.audioHandler} {...props} />} />
          <Route path="/search" render={(props) => <EntryContainer audioHandler={this.audioHandler} {...props} />} />
        </Switch>
        {
          this.state.audioPlayerVisible ?
          <Draggable
            handle=".audio-header"
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}>
            <div className='audio-player card' key={this.state.filename}>
              <div className='audio-header card-header bg-danger text-light'>Audio</div>
              <br />
              <AudioPlayer songName={this.state.songName} filename={this.state.filename}/>
            </div>
          </Draggable>
          :
          null
        }
      </div>
    )
  }
}

export default ParentContainer
