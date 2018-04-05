import React, { Component } from 'react'

class PhotoModal extends Component {
  render() {
    return (
      <div className="custom-modal" id="myModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.modalTitle}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span id="cross" aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <img src={"/photo/view?jwt=" + localStorage.jwt + "&filename=" + this.props.filename}></img>
            </div>
            <div className="modal-footer">
              <button id="closeButton" type="button" className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PhotoModal
