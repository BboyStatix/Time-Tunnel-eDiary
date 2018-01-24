import React, { Component } from 'react'

import DiaryContainer from './DiaryContainer'
import PhotoContainer from './PhotoContainer'
import AudioContainer from './AudioContainer'
import VideoContainer from './VideoContainer'

import './css/Modal.css'
import './css/reset.css'
import './css/style.css'
import './js/main.js'

class MainContainer extends Component {

  uploadFile (e){
    var formData = new FormData()
    formData.append('jwt', localStorage.jwt)
    formData.append('file', document.getElementById('file').files[0])
    fetch('/upload/file', {
      method: 'POST',
      body: formData
    })
    e.preventDefault()
  }

  logout (){
    localStorage.jwt = null
    window.location.reload()
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0" onSubmit={this.uploadFile}>
              <input className="form-control mr-sm-2" id="file" type="file" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Submit</button>
          </form>
          <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.logout}>Log out</button>
        </nav>
        <br />
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <DiaryContainer />
            </div>
            <div className="col">
              <PhotoContainer />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <AudioContainer />
            </div>
            <div className="col">
              <VideoContainer />
            </div>
          </div>
        </div>
        <section className="cd-horizontal-timeline">
        	<div className="timeline">
        		<div className="events-wrapper">
        			<div className="events">
        				<ol>
        					<li><a href="#0" data-date="16/01/2014" className="selected">16 Jan</a></li>
        					<li><a href="#0" data-date="28/02/2014">28 Feb</a></li>
        					<li><a href="#0" data-date="20/04/2014">20 Mar</a></li>
        					<li><a href="#0" data-date="20/05/2014">20 May</a></li>
        					<li><a href="#0" data-date="09/07/2014">09 Jul</a></li>
        					<li><a href="#0" data-date="30/08/2014">30 Aug</a></li>
        					<li><a href="#0" data-date="15/09/2014">15 Sep</a></li>
        					<li><a href="#0" data-date="01/11/2014">01 Nov</a></li>
        					<li><a href="#0" data-date="10/12/2014">10 Dec</a></li>
        					<li><a href="#0" data-date="19/01/2015">29 Jan</a></li>
        					<li><a href="#0" data-date="03/03/2015">3 Mar</a></li>
        				</ol>

        				<span className="filling-line" aria-hidden="true"></span>
        			</div>
        		</div>

        		<ul className="cd-timeline-navigation">
        			<li><a href="#0" className="prev inactive">Prev</a></li>
        			<li><a href="#0" className="next">Next</a></li>
        		</ul>
        	</div>
        </section>
      </div>
    )
  }
}

export default MainContainer
