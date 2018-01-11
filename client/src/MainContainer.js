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

  logout (){
    localStorage.jwt = null
  }

  render() {
    return (
      <div>
        <Header />
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0" onSubmit={this.uploadFile}>
              <input className="form-control mr-sm-2" id="file" type="file" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Submit</button>
          </form>
          <a className="nav-link" onClick={this.logout} href="/">Log out</a>
        </nav>
        <br />
        <div className="container-fluid">
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
