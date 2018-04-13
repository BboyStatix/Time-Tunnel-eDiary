import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import DiaryContainer from './DiaryContainer'
import PhotoContainer from './PhotoContainer'
import AudioContainer from './AudioContainer'
import VideoContainer from './VideoContainer'

import './css/Modal.css'
import './css/Container.css'
import './css/reset.css'
import './css/timeline.css'
import $ from "jquery"

class MainContainer extends Component {
  constructor(props){
    super(props)
    this.formatDates = this.formatDates.bind(this)
    this.changeDateFormat = this.changeDateFormat.bind(this)
    this.setDateFromDropDown = this.setDateFromDropDown.bind(this)
    this.loadJquery = this.loadJquery.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.state = {
      dates: [],
      selectedDate: this.changeDateFormat(new Date()),
      uploading: false
    }
  }

  componentWillMount() {
    fetch('/entries/dates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jwt: localStorage.jwt
      })
    }).then((res) => {
    return res.json()
    }).then((json) => {
      const formattedDates = this.formatDates(json.dates)
      this.setState({dates: formattedDates})
      this.loadJquery()
    })
  }

  loadJquery(){
    $(document).ready(function($){
      var timelines = $('.cd-horizontal-timeline'),
        eventsMinDistance = 75;

      (timelines.length > 0) && initTimeline(timelines);

      function initTimeline(timelines) {
        timelines.each(function(){
          var timeline = $(this),
            timelineComponents = {};
          //cache timeline components
          timelineComponents['timeline'] = timeline.find('.timeline');
          timelineComponents['timelineWrapper'] = timeline.find('.events-wrapper');
          timelineComponents['eventsWrapper'] = timelineComponents['timelineWrapper'].children('.events');
          timelineComponents['fillingLine'] = timelineComponents['eventsWrapper'].children('.filling-line');
          timelineComponents['timelineEvents'] = timelineComponents['eventsWrapper'].find('a');
          timelineComponents['timelineDates'] = parseDate(timelineComponents['timelineEvents']);
          timelineComponents['eventsMinLapse'] = minLapse(timelineComponents['timelineDates']);
          timelineComponents['timelineNavigation'] = timeline.find('.cd-timeline-navigation');

          //assign a left postion to the single events along the timeline
          setDatePosition(timelineComponents, eventsMinDistance);
          //assign a width to the timeline
          var timelineTotWidth = setTimelineWidth(timelineComponents, eventsMinDistance);
          //the timeline has been initialize - show it
          timeline.addClass('loaded');

          //detect click on the next arrow
          timelineComponents['timelineNavigation'].on('click', '.next', function(event){
            event.preventDefault();
            updateSlide(timelineComponents, timelineTotWidth, 'next');
          });
          //detect click on the prev arrow
          timelineComponents['timelineNavigation'].on('click', '.prev', function(event){
            event.preventDefault();
            updateSlide(timelineComponents, timelineTotWidth, 'prev');
          });
          //detect click on the a single event - show new event content
          timelineComponents['eventsWrapper'].on('click', 'a', function(event){
            event.preventDefault();
            timelineComponents['timelineEvents'].removeClass('selected');
            $(this).addClass('selected');
            updateOlderEvents($(this));
            updateFilling($(this), timelineComponents['fillingLine'], timelineTotWidth);
          });
        });
      }

      function updateSlide(timelineComponents, timelineTotWidth, string) {
        //retrieve translateX value of timelineComponents['eventsWrapper']
        var translateValue = getTranslateValue(timelineComponents['eventsWrapper']),
          wrapperWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', ''));
        //translate the timeline to the left('next')/right('prev')
        (string === 'next')
          ? translateTimeline(timelineComponents, translateValue - wrapperWidth + eventsMinDistance, wrapperWidth - timelineTotWidth)
          : translateTimeline(timelineComponents, translateValue + wrapperWidth - eventsMinDistance);
      }

      function updateTimelinePosition(string, event, timelineComponents) {
        //translate timeline to the left/right according to the position of the selected event
        var eventStyle = window.getComputedStyle(event.get(0), null),
          eventLeft = Number(eventStyle.getPropertyValue("left").replace('px', '')),
          timelineWidth = Number(timelineComponents['timelineWrapper'].css('width').replace('px', '')),
          timelineTotWidth = Number(timelineComponents['eventsWrapper'].css('width').replace('px', ''));
        var timelineTranslate = getTranslateValue(timelineComponents['eventsWrapper']);

            if( (string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < - timelineTranslate) ) {
              translateTimeline(timelineComponents, - eventLeft + timelineWidth/2, timelineWidth - timelineTotWidth);
            }
      }

      function translateTimeline(timelineComponents, value, totWidth) {
        var eventsWrapper = timelineComponents['eventsWrapper'].get(0);
        value = (value > 0) ? 0 : value; //only negative translate value
        value = ( !(typeof totWidth === 'undefined') &&  value < totWidth ) ? totWidth : value; //do not translate more than timeline width
        setTransformValue(eventsWrapper, 'translateX', value+'px');
        //update navigation arrows visibility
        (value === 0 ) ? timelineComponents['timelineNavigation'].find('.prev').addClass('inactive') : timelineComponents['timelineNavigation'].find('.prev').removeClass('inactive');
        (value === totWidth ) ? timelineComponents['timelineNavigation'].find('.next').addClass('inactive') : timelineComponents['timelineNavigation'].find('.next').removeClass('inactive');
      }

      function updateFilling(selectedEvent, filling, totWidth) {
        //change .filling-line length according to the selected event
        var eventStyle = window.getComputedStyle(selectedEvent.get(0), null),
          eventLeft = eventStyle.getPropertyValue("left"),
          eventWidth = eventStyle.getPropertyValue("width");
        eventLeft = Number(eventLeft.replace('px', '')) + Number(eventWidth.replace('px', ''))/2;
        var scaleValue = eventLeft/totWidth;
        setTransformValue(filling.get(0), 'scaleX', scaleValue);
      }

      function setDatePosition(timelineComponents, min) {
        for (var i = 0; i < timelineComponents['timelineDates'].length; i++) {
            var distance = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][i]),
              distanceNorm = Math.round(distance/timelineComponents['eventsMinLapse']) + 2;
            timelineComponents['timelineEvents'].eq(i).css('left', distanceNorm*min+'px');
        }
      }

      function setTimelineWidth(timelineComponents, width) {
        var timeSpan = daydiff(timelineComponents['timelineDates'][0], timelineComponents['timelineDates'][timelineComponents['timelineDates'].length-1]),
          timeSpanNorm = timeSpan/timelineComponents['eventsMinLapse'],
          timeSpanNorm = Math.round(timeSpanNorm) + 4,
          totalWidth = timeSpanNorm*width;
        var eventsWrapperWidth = timelineComponents['timeline'].width() - 2 * timelineComponents['eventsWrapper'].width();
        if(totalWidth < eventsWrapperWidth){
          totalWidth = eventsWrapperWidth
        };
        timelineComponents['eventsWrapper'].css('width', totalWidth+'px');
        updateFilling(timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents['fillingLine'], totalWidth);
        updateTimelinePosition('next', timelineComponents['eventsWrapper'].find('a.selected'), timelineComponents);

        return totalWidth;
      }

      function updateOlderEvents(event) {
        event.parent('li').prevAll('li').children('a').addClass('older-event').end().end().nextAll('li').children('a').removeClass('older-event');
      }

      function getTranslateValue(timeline) {
        var timelineStyle = window.getComputedStyle(timeline.get(0), null),
          timelineTranslate = timelineStyle.getPropertyValue("-webkit-transform") ||
                timelineStyle.getPropertyValue("-moz-transform") ||
                timelineStyle.getPropertyValue("-ms-transform") ||
                timelineStyle.getPropertyValue("-o-transform") ||
                timelineStyle.getPropertyValue("transform");

            if( timelineTranslate.indexOf('(') >=0 ) {
              var timelineTranslate = timelineTranslate.split('(')[1];
            timelineTranslate = timelineTranslate.split(')')[0];
            timelineTranslate = timelineTranslate.split(',');
            var translateValue = timelineTranslate[4];
            } else {
              var translateValue = 0;
            }

            return Number(translateValue);
      }

      function setTransformValue(element, property, value) {
        element.style["-webkit-transform"] = property+"("+value+")";
        element.style["-moz-transform"] = property+"("+value+")";
        element.style["-ms-transform"] = property+"("+value+")";
        element.style["-o-transform"] = property+"("+value+")";
        element.style["transform"] = property+"("+value+")";
      }

      //based on http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
      function parseDate(events) {
        var dateArrays = [];
        events.each(function(){
          var singleDate = $(this),
            dateComp = singleDate.data('date').split('T');
          if( dateComp.length > 1 ) { //both DD/MM/YEAR and time are provided
            var dayComp = dateComp[0].split('/'),
              timeComp = dateComp[1].split(':');
          } else if( dateComp[0].indexOf(':') >=0 ) { //only time is provide
            var dayComp = ["2000", "0", "0"],
              timeComp = dateComp[0].split(':');
          } else { //only DD/MM/YEAR
            var dayComp = dateComp[0].split('/'),
              timeComp = ["0", "0"];
          }
          var	newDate = new Date(dayComp[2], dayComp[1]-1, dayComp[0], timeComp[0], timeComp[1]);
          dateArrays.push(newDate);
        });
          return dateArrays;
      }

      function daydiff(first, second) {
          return Math.round((second-first));
      }

      function minLapse(dates) {
        //determine the minimum distance among events
        var dateDistances = [];
        for (var i = 1; i < dates.length; i++) {
            var distance = daydiff(dates[i-1], dates[i]);
            dateDistances.push(distance);
        }
        return Math.min.apply(null, dateDistances);
      }
    })
  }

  formatDates(dates){
    const dateArray = dates.map((dateString) => {
      return this.changeDateFormat(new Date(dateString))
    })
    dateArray.push(this.state.selectedDate)
    return [...new Set(dateArray)]
  }

  changeDateFormat(date){
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return day + '/' + month + '/' + year
  }

  setDateFromDropDown(e){
    const date = e.target.value
    const element = document.getElementById(date)
    element.click()
  }

  uploadFile (e){
    e.preventDefault()
    const files = document.getElementById('file').files
    if(files.length !== 0){
      this.setState({uploading: true})
      var formData = new FormData()
      formData.append('jwt', localStorage.jwt)
      for(var i=0; i<files.length; i++){
        formData.append('files', files[i])
      }
      fetch('/upload/file', {
        method: 'POST',
        body: formData
      }).then((res) => {
        return res.json()
      }).then((json) => {
        $('#file').val('')
        this.setState({uploading: false})
        if(json.success !== true) {
          alert(json.error)    
        }
        if(json.reload === true){
          window.location.reload()
        }
      })
    }
  }

  logout (){
    localStorage.jwt = null
    window.location.reload()
  }

  render() {
    return (
      <div>
        {
          this.state.uploading === true ?
          <div className='custom-modal'>
            <div className='loadingSpinner'></div>
          </div>
          :
          null
        }
        <nav className="navbar">
          <form className="form-inline my-2 my-lg-0" onSubmit={this.uploadFile}>
              <input className="form-control mr-sm-2" id="file" type="file" multiple />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Upload</button>
          </form>
          <form className="form-inline my-2 my-lg-0">
            <select id='date-select-dropdown' className="form-control" onChange={this.setDateFromDropDown} value={this.state.selectedDate}>
              {
                this.state.dates.map((date, idx) =>
                  <option key={idx}>{date}</option>
                )
              }
            </select>
            <Link to={{pathname: "/search"}} >
              <button id="searchButton" className="btn btn-outline-success">Search</button>
            </Link>
            <button id="logoutButton" className="btn btn-outline-danger" onClick={this.logout}>Log out</button>
          </form>
        </nav>
        {
          (this.state.dates.length !== 0) ?
          <section className="cd-horizontal-timeline">
          	<div className="timeline">
          		<div className="events-wrapper">
          			<div className="events">
          				<ol>
                    {
                      this.state.dates.map((date,idx) =>
                        <li key={idx}>
                          <a id={date} onClick={() => this.setState({selectedDate: date})} data-date={date} className={(date === this.state.selectedDate) ? "selected" : null}>{date}</a>
                        </li>
                      )
                    }
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
          :
          null
        }
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <DiaryContainer date={this.state.selectedDate} popupHandler={this.props.popupHandler}/>
            </div>
            <div className="col">
              <PhotoContainer date={this.state.selectedDate} popupHandler={this.props.popupHandler}/>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <AudioContainer date={this.state.selectedDate} popupHandler={this.props.popupHandler}/>
            </div>
            <div className="col">
              <VideoContainer date={this.state.selectedDate} popupHandler={this.props.popupHandler}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MainContainer
