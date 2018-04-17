import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import moment from 'moment';

import Markdown from 'components/markdown';

import './log-item.scss';

const LogItem = ({ log }) => (
  <div className="card LogItem">
    <div className="card-body">
      <div className="card-text">
        <small className="text-muted">
          <em>
            {moment(log.get('createdAt')).format('L')}{' '}
            {moment(log.get('createdAt')).format('LT')}
          </em>
        </small>
        <Markdown text={log.get('content')} />
      </div>
    </div>
  </div>
);

LogItem.propTypes = {
  log: ImmutablePropTypes.map.isRequired,
};

export default LogItem;
