import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import expandLogo from './img/expand.svg'

class DiaryContainer extends Component {
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
              <td><button className="btn btn-outline-primary" onClick={props.popupHandler.bind(this, expandedEntry.name, '', expandedEntry.description, 'Diary')}>View</button></td>
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
                  <Link to={{pathname: "/search", search: 'type=Diary'}}>
                    <button className="btn btn-outline-primary" style={{'marginRight': '10px'}}>Search</button>
                  </Link>
                </nav>
                <table className="table table-hover table-bordered main-page-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Event</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <ExpandedEntries entries={this.state.expandedEntries} popupHandler={this.props.popupHandler}/>
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
            <table className="table table-hover main-page-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th className='diary-description-header' scope="col">Description</th>
                  <th scope="col">Event</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.entries.map((entry,idx) =>
                    <tr key={idx}>
                      <td className="text-truncate">{entry.name}</td>
                      <td className="diary-description text-truncate">{entry.description}</td>
                      <td>{entry.eventType}</td>
                      <td><button className="btn btn-outline-primary" onClick={this.props.popupHandler.bind(this, entry.name, '', entry.description, 'Diary')}>View</button></td>
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
