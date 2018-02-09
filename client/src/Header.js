import React, { Component } from 'react'
import './css/Header.css'
import logo from './img/logo.svg'

class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h4>Time Tunnel Website</h4>
      </div>
    )
  }
}

export default Header
