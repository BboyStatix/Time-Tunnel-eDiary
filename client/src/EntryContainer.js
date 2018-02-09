import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class EntryContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      entries: []
    }
  }

  componentDidMount() {
    fetch('/entries', {
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
      this.setState({entries: json.entries.reverse()})
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </nav>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">name</th>
              <th scope="col">created_at</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.entries === undefined ?
              <tr>
              </tr>
              :
              this.state.entries.map((entry,idx) =>
                <tr key={idx}>
                  <td>{entry.name}</td>
                  <td>{entry.created_at.slice(0,10)}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default EntryContainer
