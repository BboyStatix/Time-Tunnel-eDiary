import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import AuthContainer from './AuthContainer'
import MainContainer from './MainContainer'
import EntryContainer from './EntryContainer'
import Header from './Header'

import './css/App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: this.setAuthenticationState()
    }
  }

  setAuthenticationState() {
    if (localStorage.jwt){
      fetch('/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jwt: localStorage.jwt
        })
      }).then((res) => {
        return res.json()
      }).then((json) => {
        this.setState({authenticated: json.success})
      })
    }
  }

  render() {
    return (
      <div className='App'>
        <Header />
        {
          this.state.authenticated ?
          <Switch>
            <Route exact path="/" component={MainContainer} />
            <Route path="/search" component={EntryContainer} />
          </Switch>
          :
          <AuthContainer />
        }
      </div>
    )
  }
}

export default App
