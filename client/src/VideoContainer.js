import React, { Component } from 'react'

class VideoContainer extends Component {
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
    fetch('/video/entries', {
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
        <div className="card-header bg-dark text-light">
          Video
        </div>
        <div className="card-body" style={{padding: 0}}>
          <table className="table table-hover main-page-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col video-description-header">Description</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.entries.map((entry,idx) =>
                  <tr key={idx}>
                    <td className="text-truncate">{entry.name}</td>
                    <td className="video-description text-truncate">{entry.description}</td>
                    <td><button className="btn btn-outline-dark" onClick={this.props.popupHandler.bind(this, entry.name, entry.filename, '', 'Video')}>Watch</button></td>
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

export default VideoContainer
