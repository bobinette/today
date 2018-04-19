import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import moment from 'moment';

import Textarea from 'react-textarea-autosize';

import Markdown from 'components/markdown';

import './log-item.scss';

class LogItem extends PureComponent {
  constructor(props) {
    super(props);

    this.onCloseEdit = this.onCloseEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditContent = this.onEditContent.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.state = { editing: false, editedContent: '', updating: false };
  }

  onCloseEdit() {
    this.setState({ editing: false, editedContent: '', updating: false });
  }

  onDelete() {
    const { log, onDelete } = this.props;
    onDelete(log.get('uuid'));
  }

  onEdit() {
    const { log } = this.props;
    this.setState({ editing: true, editedContent: log.get('content') });
  }

  onEditContent(evt) {
    this.setState({ editedContent: evt.target.value });
  }

  onUpdate() {
    const { log, onUpdate } = this.props;
    const { editedContent } = this.state;

    this.setState({ updating: true });
    onUpdate(log.get('uuid'), editedContent, () => {
      this.onCloseEdit();
    });
  }

  render() {
    const { log, onUpdate } = this.props;
    const { editedContent, editing, updating } = this.state;

    return (
      <div className="card LogItem">
        <div className="card-body">
          <div className="card-text">
            {!editing && (
              <div>
                <div className="flex flex-align-items-center flex-space-between">
                  <small className="text-muted flex-1">
                    <em>
                      {moment(log.get('createdAt')).format('L')}{' '}
                      {moment(log.get('createdAt')).format('LT')}
                    </em>
                  </small>
                  <button
                    className="btn btn-link btn-sm btn-icon LogItem__ActionIcon"
                    onClick={this.onEdit}
                  >
                    <i className="fas fa-edit" />
                  </button>
                  <button
                    className="btn btn-link btn-sm btn-icon LogItem__ActionIcon"
                    onClick={this.onDelete}
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
                <Markdown text={log.get('content')} />
              </div>
            )}
            {editing && (
              <div>
                <Textarea
                  className="LogItem__Content"
                  placeholder="Editing..."
                  onChange={this.onEditContent}
                  value={editedContent}
                />
                <div className="flex flex-align-right LogItem__UpdateActions">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={this.onCloseEdit}
                    disabled={updating}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={this.onUpdate}
                    disabled={updating}
                  >
                    {updating ? 'Updating' : 'Update'}
                    {updating && (
                      <i className="fas fa-circle-notch fa-spin btn-spinner" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

LogItem.propTypes = {
  log: ImmutablePropTypes.map.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default LogItem;
