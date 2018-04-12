import React, { Component } from 'react'

class PhotoContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.state = {
      entries: []
    }
  }

  componentWillReceiveProps(newProps) {
    this.fetchEntries(newProps.date)
  }

  fetchEntries(date) {
    fetch('/photo/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt,
        date: date
      })
    }).then((res) => {
      return res.json()
    })
    .then((json) => {
      this.setState({entries: json.entries})
    })
  }

  render() {
    return (
      <div className="card">
        <div className="card-header bg-success text-light">
          Photo
        </div>
        <div className="card-body" style={{padding: 0}}>
          <table className="table table-hover main-page-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Resolution</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.entries.map((entry,idx) =>
                  <tr key={idx}>
                    <td className="text-truncate">{entry.name}</td>
                    <td>{entry.resolution}</td>
                    <td><button className="btn btn-outline-success" onClick={this.props.popupHandler.bind(this, entry.name, entry.filename, '', 'Photo')}>View</button></td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default PhotoContainer
