import React, { Component } from 'react'

class EntryContainer extends Component {
  constructor(props){
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.logout = this.logout.bind(this)
    this.state = {
      entries: [],
      displayedEntries: []
    }
  }

  componentDidMount() {
    fetch('/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt
      })
    }).then((res) => {
      return res.json()
    })
    .then((json) => {
      this.setState({
        entries: json.entries.reverse(),
        displayedEntries: json.entries.reverse()
      })
    })
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase()
    var displayedEntries = this.state.entries.filter((entry) => {
      const entryName = entry.name.toLowerCase()
      const entryDate = entry.created_at.slice(0,10)
      return entryName.search(query) !== -1 || entryDate.search(query) !== -1
    })
    this.setState({
      displayedEntries: displayedEntries
    })
  }

  logout (){
    localStorage.jwt = null
    window.location.reload()
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" placeholder="Search" onChange={this.handleSearch} />
          </form>
          <button className="btn btn-outline-success" onClick={this.logout}>Log out</button>
        </nav>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">name</th>
              <th scope="col">created_at</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.entries === undefined ?
              <tr>
              </tr>
              :
              this.state.displayedEntries.map((entry,idx) =>
                <tr key={idx}>
                  <td>{entry.name}</td>
                  <td>{entry.created_at.slice(0,10)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default EntryContainer
