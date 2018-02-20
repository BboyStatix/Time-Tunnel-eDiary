import React, { Component } from 'react'
import './css/Header.css'
import logo from './img/logo.svg'

import { Link } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <Link to='/'>
          <img src={logo} className="App-logo" alt="logo" />
        </Link>
        <h4>Time Tunnel Website</h4>
      </div>
    )
  }
}

export default Header
