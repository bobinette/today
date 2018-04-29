import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Textarea from 'react-textarea-autosize';

import './log-item-editing.scss';

class LogItemEditing extends PureComponent {
  constructor(props) {
    super(props);

    this.onEditContent = this.onEditContent.bind(this);
  }

  onEditContent(evt) {
    const { onEditContent, uuid } = this.props;
    onEditContent(uuid, evt.target.value);
  }

  render() {
    const { uuid, content, updating, onCancel, onUpdate } = this.props;

    return (
      <div className="card LogItemEditing">
        <div className="card-body">
          <div className="card-text">
            <Textarea
              className="LogItemEditing__Content"
              placeholder="Editing..."
              onChange={this.onEditContent}
              value={content}
            />
            <div className="flex flex-align-right LogItemEditing__UpdateActions">
              <button
                className="btn btn-outline-secondary btn-sm LogItemEditing__Cancel"
                onClick={() => onCancel(uuid)}
                disabled={updating}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm LogItemEditing__Update"
                onClick={() => onUpdate(uuid)}
                disabled={updating}
              >
                {updating ? (
                  <span>
                    Updating...<i className="fas fa-circle-notch fa-spin btn-spinner" />
                  </span>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LogItemEditing.propTypes = {
  uuid: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  updating: PropTypes.bool.isRequired,
  onEditContent: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default LogItemEditing;
