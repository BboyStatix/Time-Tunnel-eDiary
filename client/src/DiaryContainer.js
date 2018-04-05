import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import expandLogo from './img/expand.svg'

class DiaryContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.expandContainer = this.expandContainer.bind(this)
    this.closeContainerModal = this.closeContainerModal.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.state = {
      entries: [],
      expandedEntries: [],
      modalTitle: "Title",
      modalBody: "Body",
      modalVisible: false,
      containerExpanded: false
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
      this.setState({entries: json.entries, expandedEntries: json.entries})
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

  expandContainer() {
    this.setState({ containerExpanded: true })
  }

  closeContainerModal(e) {
    const modal = document.getElementById('containerModal')
    if(e.target === modal){
      this.setState({ containerExpanded: false , expandedEntries: this.state.entries})
    }
  }

  handleFormSubmit(e) {
    e.preventDefault()
  }

  handleSearch(e){
    const query = e.target.value.toLowerCase()
    var expandedEntries = this.state.entries.filter((entry) => {
      const name = entry.name.toLowerCase()
      const description = entry.description.toLowerCase()
      const eventType = entry.eventType.toLowerCase()
      return name.indexOf(query) !== -1 || description.indexOf(query) !== -1 || eventType.indexOf(query) !== -1
    })
    this.setState({
      expandedEntries: expandedEntries
    })
  }

  render() {

    function ExpandedEntries(props){
      return <tbody>
        {
          props.entries.map((expandedEntry, index) =>
            <tr key={'expanded' + index}>
              <td className="text-truncate">{expandedEntry.name}</td>
              <td className="text-truncate">{expandedEntry.description}</td>
              <td>{expandedEntry.eventType}</td>
            </tr>
          )
        }
      </tbody>
    }

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
        {
          this.state.containerExpanded ?
          <div className="custom-modal" id="containerModal" onClick={this.closeContainerModal}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <nav className='navbar'>
                  <form className="form-inline my-2 my-lg-0" onSubmit={this.handleFormSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Search" onChange={this.handleSearch} />
                  </form>
                  <Link to={{pathname: "/search", search: 'type=Diary'}}>
                    <button className="btn btn-outline-primary" style={{'marginRight': '10px'}}>Search</button>
                  </Link>
                </nav>
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Event</th>
                    </tr>
                  </thead>
                  <ExpandedEntries entries={this.state.expandedEntries} />
                </table>
              </div>
            </div>
          </div>
          :
          null
        }
        <div className="card">
          <div className="card-header bg-primary text-light">
            Diary
            <img className='expandLogo float-right' src={expandLogo} onClick={this.expandContainer} />
          </div>
          <div className="card-body" style={{padding: 0}}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Event</th>
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
                      <td className="text-truncate">{entry.description}</td>
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
