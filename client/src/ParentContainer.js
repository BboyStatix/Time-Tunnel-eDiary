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
      modalBody: '',
      modalVisible: false,
      modalType: ''
    }
  }

  popupHandler(name, filename, description, type) {
    switch (type) {
      case 'Audio':
        this.setState({modalVisible: true, modalType: 'Audio', name: name, filename: filename})
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
    this.setState({modalVisible: false})
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={(props) => <MainContainer popupHandler={this.popupHandler} {...props} />} />
          <Route path="/search" render={(props) => <EntryContainer popupHandler={this.popupHandler} {...props} />} />
        </Switch>
        {
          this.state.modalVisible ?
          <Modal this={this} type={this.state.modalType} name={this.state.name} filename={this.state.filename} modalBody={this.state.modalBody} />
          :
          null
        }
      </div>
    )
  }
}

function Modal(props) {
  const type=props.type
  const _this = props.this

  switch (type) {
    case 'Diary':
      return (
        <div onClick={_this.closeModal}>
          <DiaryModal modalBody={props.modalBody} modalTitle={props.name} />
        </div>
      )
    case 'Photo':
      return (
        <div onClick={_this.closeModal}>
          <PhotoModal modalTitle={props.modalTitle} filename={props.filename} />
        </div>
      )
    case 'Video':
      return (
        <div onClick={_this.closeModal}>
          <VideoModal modalTitle={props.modalTitle} filename={props.filename}/>
        </div>
      )
    case 'Audio':
      return (
        <Draggable
          handle=".audio-header"
          onStart={_this.handleStart}
          onDrag={_this.handleDrag}
          onStop={_this.handleStop}>
          <div className='audio-player card' key={props.filename}>
            <div className='audio-header card-header bg-danger text-light'>
              Audio
              <button type="button" className="close" aria-label="Close" onClick={_this.closeAudioPlayer}>
                <span style={{color: 'black'}} aria-hidden="true">&times;</span>
              </button>
            </div>
            <br />
            <AudioPlayer songName={props.name} filename={props.filename}/>
          </div>
        </Draggable>
      )
    default:
      return null
  }
}

export default ParentContainer
