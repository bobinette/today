import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import moment from 'moment';

import Markdown from 'components/markdown';

import './log-item.scss';

class LogItem extends PureComponent {
  render() {
    const { log, onDelete, onEdit } = this.props;

    return (
      <div className="card LogItem">
        <div className="card-body">
          <div className="card-text">
            <div className="flex flex-align-items-center flex-space-between">
              <small className="text-muted flex-1">
                <em>
                  {moment(log.get('createdAt')).format('L')}{' '}
                  {moment(log.get('createdAt')).format('LT')}
                </em>
              </small>
              <button
                className="btn btn-link btn-sm btn-icon LogItem__ActionIcon LogItem__ActionEdit"
                onClick={() => onEdit()}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-link btn-sm btn-icon LogItem__ActionIcon LogItem__ActionDelete"
                onClick={() => onDelete()}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <Markdown text={log.get('content')} />
          </div>
        </div>
      </div>
    );
  }
}

LogItem.propTypes = {
  log: ImmutablePropTypes.map.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default LogItem;
