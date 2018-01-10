import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import Header from './Header'
import DiaryContainer from './DiaryContainer'
import PhotoContainer from './PhotoContainer'
import AudioContainer from './AudioContainer'
import VideoContainer from './VideoContainer'

class MainContainer extends Component {
  uploadFile (e){
    var formData = new FormData()
    formData.append('jwt', localStorage.jwt)
    formData.append('file', document.getElementById('file').files[0])
    fetch('/upload/file', {
      method: 'POST',
      body: formData
    })
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <Header />
        <br />
        <form onSubmit={this.uploadFile}>
          <div className="form-group">
            <input id="file" type="file" />
          </div>
          <button type="submit">Submit</button>
        </form>
        <br />
        <div className="container">
          <div className="row">
            <div className="col">
              <DiaryContainer />
            </div>
            <div className="col">
              <PhotoContainer />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <AudioContainer />
            </div>
            <div className="col">
              <VideoContainer />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MainContainer
