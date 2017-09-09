import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import AuthContainer from './AuthContainer'
import MainContainer from './MainContainer'

import './App.css'

class App extends Component {
  isAuthenticated() {
    return false
  }

  render() {
    return (
      <div className='App'>
        {
          this.isAuthenticated() ?
          <MainContainer />
          :
          <AuthContainer />
        }
      </div>
    )
  }
}

export default App
