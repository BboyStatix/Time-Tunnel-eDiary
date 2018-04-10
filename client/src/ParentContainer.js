import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import MainContainer from './MainContainer'
import EntryContainer from './EntryContainer'

class ParentContainer extends Component {
  constructor(props){
    super(props)
    this.audioHandler = this.audioHandler.bind(this)
  }

  audioHandler() {
    console.log('going to play audio!!!')
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={(props) => <MainContainer audioHandler={this.audioHandler} {...props} />} />
          <Route path="/search" render={(props) => <EntryContainer audioHandler={this.audioHandler} {...props} />} />
        </Switch>
      </div>
    )
  }
}

export default ParentContainer
