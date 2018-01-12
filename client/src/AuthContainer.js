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
      }
    })
    e.preventDefault()
  }

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <form onSubmit={this.submitCredentials}>
          <div className="form-group row">
            <div className="col-sm-2"></div>
            <label className="col-sm-2 col-form-label">Username</label>
            <div className="col-sm-4">
              <input type="text" className="form-control" id="username" placeholder="Enter username" />
            </div>
            <div className="col-sm-4"></div>
          </div>
          <div className="form-group row">
            <div className="col-sm-2"></div>
            <label className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-4">
              <input type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            <div className="col-sm-4"></div>
          </div>
          <button type="submit" className="btn btn-primary">Log In / Register</button>
        </form>
      </div>
    )
  }
}

export default AuthContainer
