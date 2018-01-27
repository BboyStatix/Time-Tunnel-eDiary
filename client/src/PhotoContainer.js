import React, { Component } from 'react'

class PhotoContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.state = {
      entries: [],
      modalTitle: "Title",
      filename: "",
      modalVisible: false
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
                <div className="modal-body">
                <img src={"/photo/view?jwt=" + localStorage.jwt + "&filename=" + this.state.filename}></img>
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
                    <td>{entry.name}</td>
                    <td>{entry.created_at}</td>
                    <td><button className="btn btn-outline-success" onClick={() => this.setState({modalVisible: true, modalTitle: entry.name, filename: entry.filename})}>View</button></td>
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

export default PhotoContainer
