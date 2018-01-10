import React, { Component } from 'react'

class PhotoContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      entries: this.setEntryState()
    }
  }

  setEntryState() {
    fetch('/photo/entries', {
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">name</th>
                <th scope="col">created_at</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.entries === undefined ?
                <tr>
                  <th scope="row">1</th>
                </tr>
                :
                this.state.entries.map((entry,idx) =>
                  <tr key={idx}>
                    <th scope="row">{idx+1}</th>
                    <td>{entry.name}</td>
                    <td>{entry.created_at}</td>
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
