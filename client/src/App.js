import React, { Component } from 'react'

import AuthContainer from './AuthContainer'
import MainContainer from './MainContainer'
import Header from './Header'

import './css/App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {authenticated: false}
  }

  componentWillMount() {
    this.setAuthenticationState()
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
          <MainContainer />
          :
          <AuthContainer />
        }
      </div>
    )
  }
}

export default App
