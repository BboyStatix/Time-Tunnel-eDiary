import React, { Component } from 'react'

class Table extends Component {

  render() {
    return (
      <div className="entry_container">
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">name</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.entries === undefined ?
              <tr>
              </tr>
              :
              this.props.entries.map((entry,idx) =>
                <tr key={idx}>
                  <td className="text-truncate">{entry.name}</td>
                  <td>{entry.created_at.slice(0,10)}</td>
                  <td><button className="btn btn-outline-primary" onClick={() => this.downloadFile(entry.name, entry.filename)}>Download</button></td>
                  <td><button className="btn btn-outline-danger" onClick={() => this.deleteFile(entry.filename)}>Delete</button></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table
