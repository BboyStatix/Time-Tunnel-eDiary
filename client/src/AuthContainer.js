import React, { Component } from 'react'

class AuthContainer extends Component {

  submitCredentials() {
    fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    })
  }

  render() {
    return (
      <div>
        <label>Enter your username and password</label>
        <br/>
        <input id='username' type='text' placeholder='username'/>
        <br/>
        <input id='password' type='password' placeholder='password'/>
        <br/>
        <button onClick={ this.submitCredentials }>Submit</button>
      </div>
    )
  }
}

export default AuthContainer
