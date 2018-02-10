import React, { Component } from 'react'

class EntryContainer extends Component {
  constructor(props){
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
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
      const entryArray = json.entries.reverse()
      this.setState({
        entries: entryArray,
        displayedEntries: entryArray
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

  downloadFile(name, filename) {
    fetch('/download/file?jwt=' + localStorage.jwt + "&filename=" + filename)
    .then((res) => {
      return res.blob()
    })
    .then((blob) => {
      const FileSaver = require('file-saver')
      FileSaver.saveAs(blob, name)
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
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">name</th>
              <th scope="col">description</th>
              <th scope="col">artist</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
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
                  {
                    (entry.description === undefined) ?
                    <td></td>
                    :
                    <td>{entry.description.slice(0,20)+ '...'}</td>
                  }
                  <td>{entry.artist}</td>
                  <td>{entry.created_at.slice(0,10)}</td>
                  <td><button className="btn btn-outline-primary" onClick={() => this.downloadFile(entry.name, entry.filename)}>Download</button></td>
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
