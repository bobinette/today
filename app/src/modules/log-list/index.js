import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import moment from 'moment';

import Markdown from 'components/markdown';
import NewLogInput from 'modules/new-log';
import { separateActions } from 'utils/redux';

import { fetchLogs } from './actions';
import { selectLogs } from './selectors';

import './log-list.scss';

const mapStateToProps = state => ({
  logs: selectLogs(state),
});

const mapDispatchToProps = {
  fetchLogs,
};

export class LogList extends PureComponent {
  componentDidMount() {
    this.props.actions.fetchLogs();
  }

  render() {
    const { logs } = this.props;

    return (
      <div className="container">
        <NewLogInput />
        {logs.map(log => (
          <div key={log.get('uuid')}>
            <LogList.LogItem log={log} />
          </div>
        ))}
      </div>
    );
  }
}

LogList.propTypes = {
  logs: ImmutablePropTypes.list.isRequired,
  actions: PropTypes.shape({
    fetchLogs: PropTypes.func.isRequired,
  }).isRequired,
};

LogList.LogItem = ({ log }) => (
  <div className="card LogItem">
    <div className="card-body">
      <div className="card-text">
        <Markdown text={log.get('content')} />
        <small className="text-muted">
          <em>
            {moment(log.get('createdAt')).format('L')}{' '}
            {moment(log.get('createdAt')).format('LT')}
          </em>
        </small>
      </div>
    </div>
  </div>
);

LogList.LogItem.propTypes = {
  log: ImmutablePropTypes.map.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  LogList,
);
