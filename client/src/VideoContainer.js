import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import expandLogo from './img/expand.svg'

class VideoContainer extends Component {
  constructor(props){
    super(props)
    this.fetchEntries = this.fetchEntries.bind(this)
    this.expandContainer = this.expandContainer.bind(this)
    this.closeContainerModal = this.closeContainerModal.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.state = {
      entries: [],
      expandedEntries: [],
      containerExpanded: false
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
      this.setState({entries: json.entries, expandedEntries: json.entries})
    })
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
      return name.indexOf(query) !== -1 || description.indexOf(query) !== -1
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
              <td className="text-truncate" title={expandedEntry.name}>{expandedEntry.name}</td>
              <td className="text-truncate" title={expandedEntry.description}>{expandedEntry.description}</td>
              <td className="text-truncate">{expandedEntry.channel}</td>
              <td className="text-truncate">{expandedEntry.duration}</td>
            </tr>
          )
        }
      </tbody>
    }

    return (
      <div>
        {
          this.state.containerExpanded ?
          <div className="custom-modal" id="containerModal" onClick={this.closeContainerModal}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <nav className='navbar'>
                  <form className="form-inline my-2 my-lg-0" onSubmit={this.handleFormSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Search" onChange={this.handleSearch} />
                  </form>
                  <Link to={{pathname: "/search", search: 'type=Video'}}>
                    <button className="btn btn-outline-dark" style={{'marginRight': '10px'}}>Search</button>
                  </Link>
                </nav>
                <table className="table table-hover table-bordered main-page-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Channel</th>
                      <th scope="col">Duration</th>
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
          <div className="card-header bg-dark text-light">
            Video
            <img className='expandLogo float-right' src={expandLogo} onClick={this.expandContainer} />
          </div>
          <div className="card-body" style={{padding: 0}}>
            <table className="table table-hover main-page-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th className="video-description-header" scope="col">Description</th>
                  <th scope="col">Channel</th>
                  <th scope="col">Duration</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.entries.map((entry,idx) =>
                    <tr key={idx}>
                      <td className="text-truncate">{entry.name}</td>
                      <td className="video-description text-truncate">{entry.description}</td>
                      <td className="text-truncate">{entry.channel}</td>
                      <td className="text-truncate">{entry.duration}</td>
                      <td><button className="btn btn-outline-dark" onClick={this.props.popupHandler.bind(this, entry.name, entry.filename, '', 'Video')}>Watch</button></td>
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
