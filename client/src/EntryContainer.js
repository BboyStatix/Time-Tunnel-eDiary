import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Table from './Table.js'

import './css/Container.css'

class EntryContainer extends Component {
  constructor(props){
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.selectEntryType = this.selectEntryType.bind(this)
    this.logout = this.logout.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.state = {
      entries: [],
      type: 'All',
      query: ''
    }
  }

  componentDidMount() {
    const queryString = require('query-string')
    const parsed = queryString.parse(this.props.location.search)
    if(parsed.type !== undefined){
      this.setState({type: parsed.type})
    }
    this.fetchEntries(parsed.type)
  }

  fetchEntries(type) {
    fetch('/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt,
        type: type
      })
    }).then((res) => {
      return res.json()
    })
    .then((json) => {
      const entryArray = json.entries.reverse()
      this.setState({ entries: entryArray })
    })
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase()
    this.setState({ query: query })
  }

  selectEntryType(e) {
    const type = e.target.value
    this.props.history.push('?type=' + type)
    this.setState({type: type})
    this.fetchEntries(type)
  }

  logout(){
    localStorage.jwt = null
    window.location.reload()
  }

  handleFormSubmit(e){
    e.preventDefault()
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0" onSubmit={this.handleFormSubmit}>
            <input className="form-control mr-sm-2" placeholder="Search" onChange={this.handleSearch} />
            <select className="form-control" onChange={this.selectEntryType} value={this.state.type}>
              <option>All</option>
              <option>Diary</option>
              <option>Photo</option>
              <option>Audio</option>
              <option>Video</option>
            </select>
          </form>
          <form className="form-inline my-2 my-lg-0">
            <Link to="/">
              <button className="btn btn-outline-success" style={{'marginRight': '10px'}}>Go Back</button>
            </Link>
            <button className="btn btn-outline-danger" onClick={this.logout}>Log out</button>
          </form>
        </nav>
        <Table type={this.state.type} entries={this.state.entries} query={this.state.query} />
      </div>
    )
  }
}

export default EntryContainer
