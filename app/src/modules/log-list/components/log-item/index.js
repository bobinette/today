import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import moment from 'moment';
import Tooltip from 'rc-tooltip';

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
                <Tooltip
                  placement="top"
                  mouseEnterDelay={0.3}
                  overlay={log.get('uuid')}
                >
                  <em>
                    {moment(log.get('createdAt')).format('L')}{' '}
                    {moment(log.get('createdAt')).format('LT')}
                  </em>
                </Tooltip>
              </small>
              <button
                className="btn btn-link btn-sm btn-icon LogItem__ActionIcon LogItem__ActionEdit"
                onClick={() => onEdit(log.get('uuid'))}
              >
                <i className="fas fa-edit" />
              </button>
              <button
                className="btn btn-link btn-sm btn-icon LogItem__ActionIcon LogItem__ActionDelete"
                onClick={() => onDelete(log.get('uuid'))}
              >
                <i className="fas fa-trash-alt" />
              </button>
            </div>
            <Markdown text={log.get('content')} autoLoadReferences />
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
