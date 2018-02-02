import React, { Component } from 'react'
import ReactAudioPlayer from 'react-audioplayer'

class AudioContainer extends Component {
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
    fetch('/audio/entries', {
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
        <div className="card-header bg-danger text-light">
          Audio
        </div>
        <div className="card-body">
          <div className="container">
            {
              this.state.entries === undefined ?
              <div className="row"></div>
              :
              this.state.entries.map((entry,idx) =>
                <div className="row" key={idx}>
                  <ReactAudioPlayer
                    playlist={[{name: entry.name, src: "/audio/view?jwt=" + localStorage.jwt + "&filename=" + entry.filename}]}
                    style={{width: '100%'}}
                  />
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

export default AudioContainer
