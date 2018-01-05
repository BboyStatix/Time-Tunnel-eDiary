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
        <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
        <Switch>
          <Route exact path='/' render={() => <Link to='/temp'>Click Here</Link>}/>
          <Route exact path='/temp' render={() => <Link to='/'>Go Back</Link>}/>
        </Switch>
        <DiaryContainer /> 
        <PhotoContainer />
        <AudioContainer />
        <VideoContainer />
      </div>
    )
  }
}

export default MainContainer
