import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import MainContainer from './MainContainer'
import EntryContainer from './EntryContainer'
import AudioModal from './AudioModal'

class ParentContainer extends Component {
  constructor(props){
    super(props)
    this.audioHandler = this.audioHandler.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      audioPlayerVisible: false,
      songName: '',
      filename: ''
    }
  }

  audioHandler(songName, filename) {
    this.setState({audioPlayerVisible: true, songName: songName, filename: filename})
  }

  closeModal(e) {
    const modal = document.getElementById('myModal')
    const cross = document.getElementById('cross')
    const closeButton = document.getElementById('closeButton')
    if(e.target === modal || e.target === cross || e.target === closeButton){
      this.setState({audioPlayerVisible: false})
    }
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
          <div onClick={this.closeModal}>
            <AudioModal name={this.state.songName} filename={this.state.filename}/>
          </div>
          :
          null
        }
      </div>
    )
  }
}

export default ParentContainer
