import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import Header from './Header'
import DiaryContainer from './DiaryContainer'
import PhotoContainer from './PhotoContainer'
import AudioContainer from './AudioContainer'
import VideoContainer from './VideoContainer'

class MainContainer extends Component {
  render() {
    return (
      <div>
        <Header />
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
