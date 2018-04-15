import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Draggable from 'react-draggable'

import MainContainer from './MainContainer'
import EntryContainer from './EntryContainer'
import AudioPlayer from './AudioPlayer'
import VideoModal from './VideoModal'
import PhotoModal from './PhotoModal'
import DiaryModal from './DiaryModal'

import './css/AudioPlayer.css'

class ParentContainer extends Component {
  constructor(props){
    super(props)
    this.popupHandler = this.popupHandler.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.closeAudioPlayer = this.closeAudioPlayer.bind(this)
    this.state = {
      name: '',
      filename: '',
      songName: '',
      songFileName: '',
      modalBody: '',
      modalVisible: false,
      audioPlayerVisible: false,
      modalType: ''
    }
  }

  popupHandler(name, filename, description, type) {
    switch (type) {
      case 'Audio':
        this.setState({audioPlayerVisible: true, modalType: 'Audio', songName: name, songFileName: filename})
        break
      case 'Diary':
        this.setState({modalVisible: true, modalType: 'Diary', name: name, filename: filename, modalBody: description})
        break
      case 'Photo':
        this.setState({modalVisible: true, modalType: 'Photo', name: name, filename: filename})
        break
      case 'Video':
        this.setState({modalVisible: true, modalType: 'Video', name: name, filename: filename})
        break
      default:
        this.setState({modalVisible: false, modalType: '', name: name, filename: filename})
        break
    }
  }

  closeModal(e) {
    const modal = document.getElementById('myModal')
    const cross = document.getElementById('cross')
    const closeButton = document.getElementById('closeButton')
    if(e.target === modal || e.target === cross || e.target === closeButton){
      this.setState({modalVisible: false})
    }
  }

  closeAudioPlayer() {
    this.setState({audioPlayerVisible: false})
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={(props) => <MainContainer popupHandler={this.popupHandler} {...props} />} />
          <Route path="/search" render={(props) => <EntryContainer popupHandler={this.popupHandler} {...props} />} />
        </Switch>
        {
          this.state.audioPlayerVisible ?
            <Draggable
              handle=".audio-header"
              onStart={this.handleStart}
              onDrag={this.handleDrag}
              onStop={this.handleStop}>
              <div className='audio-player card' key={this.state.songName}>
                <div className='audio-header card-header bg-danger text-light'>
                  Audio
                  <button type="button" className="close" aria-label="Close" onClick={this.closeAudioPlayer}>
                    <span style={{color: 'black'}} aria-hidden="true">&times;</span>
                  </button>
                </div>
                <br />
                <AudioPlayer songName={this.state.songName} filename={this.state.songFileName}/>
              </div>
            </Draggable>
            :
            null
        }
        {
          this.state.modalVisible ?
          <Modal
            this={this}
            type={this.state.modalType}
            name={this.state.name}
            filename={this.state.filename}
            modalBody={this.state.modalBody}
            closeModal={this.closeModal}
          />
          :
          null
        }
      </div>
    )
  }
}

function Modal(props) {
  const type=props.type

  switch (type) {
    case 'Diary':
      return (
        <div onClick={props.closeModal}>
          <DiaryModal modalTitle={props.name} modalBody={props.modalBody} />
        </div>
      )
    case 'Photo':
      return (
        <div onClick={props.closeModal}>
          <PhotoModal modalTitle={props.name} filename={props.filename} />
        </div>
      )
    case 'Video':
      return (
        <div onClick={props.closeModal}>
          <VideoModal modalTitle={props.name} filename={props.filename}/>
        </div>
      )
    default:
      return null
  }
}

export default ParentContainer
