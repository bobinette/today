import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import moment from 'moment';

import Markdown from 'components/markdown';
import { separateActions } from 'utils/redux';

import { fetchLogs } from './actions';
import { selectLogs } from './selectors';

import NewLogInput from './components/new-log';

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
  }),
};

LogList.LogItem = ({ log }) => (
  <div className="card LogItem">
    <div className="card-body">
      <div className="card-title flex flex-space-between">
        <h5>{log.get('title')}</h5>
        <small className="text-muted">
          <em>
            {moment(log.get('createdAt')).format('L')}{' '}
            {moment(log.get('createdAt')).format('LT')}
          </em>
        </small>
      </div>
      <div className="card-text">
        <Markdown text={log.get('content')} />
      </div>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  LogList,
);
