import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MarkdownInput from 'components/markdown-input';

import './log-item-editing.scss';

class LogItemEditing extends PureComponent {
  constructor(props) {
    super(props);

    this.onEditContent = this.onEditContent.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onEditContent(value) {
    const { onEditContent, uuid } = this.props;
    onEditContent(uuid, value);
  }

  onKeyDown(evt) {
    const { uuid, onUpdate } = this.props;
    // Cmd+Enter
    if (evt.keyCode === 13 && evt.metaKey) {
      evt.preventDefault();
      onUpdate(uuid);
    }
  }

  render() {
    const { uuid, content, updating, onCancel, onUpdate } = this.props;

    return (
      <div className="card LogItemEditing">
        <div className="card-body">
          <div className="card-text LogItemEditing__Content">
            <MarkdownInput
              placeholder="Editing..."
              onChange={this.onEditContent}
              onKeyDown={this.onKeyDown}
              value={content}
            >
              <div className="LogItemEditing__UpdateActions">
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
            </MarkdownInput>
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
