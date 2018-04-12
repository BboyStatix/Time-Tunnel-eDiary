import React, { Component } from 'react'
import expandLogo from './img/expand.svg'

import { Link } from 'react-router-dom'

class AudioContainer extends Component {
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
      this.setState({entries: json.entries, expandedEntries: json.entries})
    })
  }

  expandContainer() {
    this.setState({ containerExpanded: true})
  }

  closeContainerModal(e){
    const modal = document.getElementById('containerModal')
    if(e.target === modal){
      this.setState({ containerExpanded: false , expandedEntries: this.state.entries})
    }
  }

  handleFormSubmit(e){
    e.preventDefault()
  }

  handleSearch(e) {
    const query = e.target.value.toLowerCase()
    var expandedEntries = this.state.entries.filter((entry) => {
      const name = entry.name.toLowerCase()
      const artist = entry.artist.toLowerCase()
      const album = entry.album.toLowerCase()
      const information = entry.information.toLowerCase()
      return (name.indexOf(query) !== -1 || artist.indexOf(query) !== -1 || album.indexOf(query) !== -1 || information.indexOf(query) !== -1)
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
              <td className="text-truncate" title={expandedEntry.name}>
                <a target='_blank' href={'http://www.google.com/search?q=' + expandedEntry.name.toLowerCase()}>
                  {expandedEntry.name}
                </a>
              </td>
              <td className="text-truncate" title={expandedEntry.artist}>
                <a target='_blank' href={'http://www.google.com/search?q=' + expandedEntry.artist.toLowerCase()}>
                  {expandedEntry.artist}
                </a>
              </td>
              <td className="text-truncate" title={expandedEntry.album}>{expandedEntry.album}</td>
              <td className="text-truncate" title={expandedEntry.information}>{expandedEntry.information}</td>
              <td>{expandedEntry.usChartDate}</td>
              <td>{expandedEntry.usPeakNumOfWeeks}</td>
              <td>{expandedEntry.usPeakPosition}</td>
              <td>{expandedEntry.ukChartDate}</td>
              <td>{expandedEntry.ukPeakNumOfWeeks}</td>
              <td>{expandedEntry.ukPeakPosition}</td>
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
              <div className="modal-content audio-modal">
                <nav className='navbar'>
                  <form className="form-inline my-2 my-lg-0" onSubmit={this.handleFormSubmit}>
                    <input className="form-control mr-sm-2" placeholder="Search" onChange={this.handleSearch} />
                  </form>
                  <Link to={{pathname: "/search", search: 'type=Audio'}}>
                    <button className="btn btn-outline-danger" style={{'marginRight': '10px'}}>Search</button>
                  </Link>
                </nav>
                <table className="table table-hover table-bordered main-page-table">
                  <thead>
                    <tr>
                      <th scope="col">Song</th>
                      <th scope="col">Artist</th>
                      <th scope="col">Album</th>
                      <th scope="col">Information</th>
                      <th scope="col">US chart date</th>
                      <th scope="col">US Peak Position</th>
                      <th scope="col">US no. of weeks</th>
                      <th scope="col">UK chart date</th>
                      <th scope="col">UK Peak Position</th>
                      <th scope="col">UK no. of weeks</th>
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
          <div className="card-header bg-danger text-light">
            Audio
            <img className='expandLogo float-right' src={expandLogo} onClick={this.expandContainer}/>
          </div>
          <div className="card-body" style={{padding: 0}}>
            <table className="table table-hover main-page-table">
              <thead>
                <tr>
                  <th scope="col">Song</th>
                  <th scope="col">Artist</th>
                  <th scope="col">Album</th>
                  <th scope="col">Information</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.entries.map((entry,idx) =>
                    <tr key={idx}>
                      <td className="text-truncate">{entry.name}</td>
                      <td className="diary-description text-truncate">{entry.artist}</td>
                      <td>{entry.album}</td>
                      <td>{entry.information}</td>
                      <td><button className="btn btn-outline-danger" onClick={this.props.popupHandler.bind(this, entry.name, entry.filename, '', 'Audio')}>Play</button></td>
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

export default AudioContainer
