import React, { Component } from 'react'

class Table extends Component {
  constructor(props){
    super(props)
    this.filterEntries = this.filterEntries.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.state = { entries: [] }
  }

  componentWillReceiveProps(props) {
    this.setState({entries: props.entries})
  }

  filterEntries(entries, query) {
    var displayedEntries = query === '' ? entries : entries.filter((entry) => {
      const name = entry.name.toLowerCase()
      const date = entry.created_at.slice(0,10)
      return name.indexOf(this.props.query) !== -1
    })
    return displayedEntries
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

  deleteFile(id, filename) {
    fetch('/delete/file', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt,
        filename: filename
      })
    }).then((res) => {
        return res.json()
    }).then((json) => {
      const entries = this.state.entries.filter((entry) => {
        return !(entry._id === id)
      })
      this.setState({entries: entries})
    })
  }

  render() {
    const entries = this.filterEntries(this.state.entries)

    return (
      <div className="entry_container">
        <table className="table table-hover table-bordered">
          <thead>
            <AllColumns />
          </thead>
          <tbody>
            {
              entries === undefined ?
              <tr>
              </tr>
              :
              entries.map((entry,idx) =>
                <tr key={idx}>
                  <td className="text-truncate">{entry.name}</td>
                  <td>{entry.created_at.slice(0,10)}</td>
                  <td><button className="btn btn-outline-primary" onClick={() => this.downloadFile(entry.name, entry.filename)}>Download</button></td>
                  <td><button className="btn btn-outline-danger" onClick={() => this.deleteFile(entry._id, entry.filename)}>Delete</button></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

function AllColumns() {
  return (
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Date</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  )
}

function DiaryColumns() {
  return (
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Description</th>
      <th scope="col">Type</th>
      <th scope="col">Date</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  )
}

export default Table
