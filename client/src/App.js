import React, { Component } from 'react'
import { Link, Switch, Route } from 'react-router-dom'

import './App.css'

import Header from './Header'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <p className="App-intro">To get started, edit <code>src/App.js</code> and save to reload.</p>
        <Switch>
          <Route exact path='/' render={() => <Link to='/temp'>Click Here</Link>}/>
          <Route exact path='/temp' render={() => <Link to='/'>Go Back</Link>}/>
        </Switch>
      </div>
    )
  }
}

export default App
