import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import logo from './logo.svg'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
        <Switch>
          <Route exact path='/' render={() => <Link to='/temp'>Click Here</Link>}/>
          <Route exact path='/temp' render={() => <Link to='/'>Go Back</Link>}/>
        </Switch>
      </div>
    );
  }
}

export default App;
