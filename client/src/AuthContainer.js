import React, { Component } from 'react'

class AuthContainer extends Component {

  submitCredentials(e) {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      })
    }).then((res) => {
      return res.json()
    }).then((json) => {
      if (json.success){
        console.log(json.message)
        localStorage.jwt = json.token
        window.location.reload()
      }
      else {
        console.log(json.message)
        // TODO: need an else condition here when authentication fails should show red error msg
      }
    })
    e.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.submitCredentials}>
        <label>Enter your username and password</label>
        <br/>
        <input id='username' type='text' placeholder='username'/>
        <br/>
        <input id='password' type='password' placeholder='password'/>
        <br/>
        <input type='submit' value='Submit'/>
      </form>
    )
  }
}

export default AuthContainer
