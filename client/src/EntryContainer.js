import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class EntryContainer extends Component {
  render() {
    return (
      <div className="container">
        <Link to="/">Go back</Link>
      </div>
    )
  }
}

export default EntryContainer
