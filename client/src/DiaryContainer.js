import React, { Component } from 'react'

class DiaryContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      entries: [],
      modalTitle: "Title",
      modalBody: "Body",
      modalVisible: false
    }
  }

  componentWillReceiveProps(newProps) {
    this.fetchEntries(newProps.date)
  }

  fetchEntries(date) {
    fetch('/diary/entries', {
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

  showModal(name, objectID) {
    fetch('/diary/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt,
        objectID: objectID
      })
    }).then((res) => {
      return res.json()
    })
    .then((json) => {
      this.setState({modalVisible: true, modalTitle: name, modalBody: json.data})
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
          <div className="custom-modal" id="myModal" onClick={this.closeModal}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{this.state.modalTitle}</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span id="cross" aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body diary-body">
                  <p>{this.state.modalBody}</p>
                </div>
                <div className="modal-footer">
                  <button id="closeButton" type="button" className="btn btn-secondary">Close</button>
                </div>
              </div>
            </div>
          </div>
          :
          null
        }
        <div className="card">
          <div className="card-header bg-primary text-light">
            Diary
          </div>
          <div className="card-body" style={{padding: 0}}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Type</th>
                  <th scope="col"></th>
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
                      <td className="text-truncate">{entry.name}</td>
                      {
                        entry.description === undefined ?
                        <td></td>
                        :
                        <td className="text-truncate">{entry.description}</td>
                      }
                      <td>{entry.eventType}</td>
                      <td><button className="btn btn-outline-primary" onClick={() => this.showModal(entry.name, entry._id)}>View</button></td>
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

export default DiaryContainer
