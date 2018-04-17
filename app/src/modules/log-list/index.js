import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import SearchBar from 'components/searchbar';

import NewLogInput from 'modules/new-log';
import { separateActions } from 'utils/redux';

import { fetchLogs, onSearchChange, onUpdate } from './actions';
import { selectLogs, selectQ } from './selectors';

import LogItem from './components/log-item';

import './log-list.scss';

const mapStateToProps = state => ({
  logs: selectLogs(state),
  q: selectQ(state),
});

const mapDispatchToProps = {
  fetchLogs,
  onSearchChange,
  onUpdate,
};

export class LogList extends PureComponent {
  constructor(props) {
    super(props);

    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchLogs();
  }

  onUpdate(uuid, content, done) {
    console.log(uuid, content, done);
    const { actions: { onUpdate } } = this.props;
    onUpdate(uuid, content, done);
  }

  render() {
    const { q, actions, logs } = this.props;

    return (
      <div className="container">
        <NewLogInput />
        <SearchBar
          className="LogList__searchBar col-md-8 offset-md-2"
          q={q}
          onChange={actions.onSearchChange}
        />
        {logs.map(log => (
          <div key={log.get('uuid')}>
            <LogItem log={log} onUpdate={this.onUpdate} />
          </div>
        ))}
      </div>
    );
  }
}

LogList.propTypes = {
  logs: ImmutablePropTypes.list.isRequired,
  q: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    fetchLogs: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  LogList,
);
