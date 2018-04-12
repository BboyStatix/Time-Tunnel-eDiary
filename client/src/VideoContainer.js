import React, { Component } from 'react'

import VideoModal from './VideoModal'

class VideoContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      entries: [],
      modalTitle: "",
      filename: "",
      modalVisible: false
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

  closeModal(e) {
    const modal = document.getElementById('myModal')
    const cross = document.getElementById('cross')
    const closeButton = document.getElementById('closeButton')
    if(e.target === modal || e.target === cross || e.target === closeButton){
      this.setState({modalVisible: false})
    }
  }

  render() {
    return (
      <div>
        {
          this.state.modalVisible ?
          <div onClick={this.closeModal}>
            <VideoModal modalTitle={this.state.modalTitle} filename={this.state.filename}/>
          </div>
          :
          null
        }
        <div className="card">
          <div className="card-header bg-dark text-light">
            Video
          </div>
          <div className="card-body" style={{padding: 0}}>
            <table className="table table-hover main-page-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.entries.map((entry,idx) =>
                    <tr key={idx}>
                      <td className="text-truncate">{entry.name}</td>
                      <td><button className="btn btn-outline-dark" onClick={() => this.setState({modalVisible: true, modalTitle: entry.name, filename: entry.filename})}>Watch</button></td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default VideoContainer
