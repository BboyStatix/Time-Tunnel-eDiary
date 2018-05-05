import React, { Component } from 'react'

class DiaryModal extends Component {
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
            <pre className="modal-body diary-body">
              <p>{this.props.modalBody}</p>
            </pre>
            <div className="modal-footer">
              <button id="closeButton" type="button" className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DiaryModal
