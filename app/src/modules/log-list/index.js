import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import SearchBar from 'components/searchbar';

import NewLogInput from 'modules/new-log';
import { separateActions } from 'utils/redux';

import {
  deleteLog,
  fetchLogs,
  onSearchChange,
  onUpdate,
  startEditing,
  edit,
  stopEditing,
} from './actions';
import { selectLogs, selectQ } from './selectors';

import LogItem from './components/log-item';
import LogItemEditing from './components/log-item-editing';

import './log-list.scss';

const mapStateToProps = state => ({
  logs: selectLogs(state),
  q: selectQ(state),
});

const mapDispatchToProps = {
  deleteLog,
  fetchLogs,
  onSearchChange,
  onUpdate,
  startEditing,
  edit,
  stopEditing,
};

export class LogList extends PureComponent {
  componentDidMount() {
    this.props.actions.fetchLogs();
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
          <div key={log.getIn(['source', 'uuid'])}>
            {log.getIn(['edited', 'editing']) ? (
              <LogItemEditing
                content={log.getIn(['edited', 'content'])}
                updating={log.getIn(['edited', 'updating'])}
                onEditContent={content =>
                  actions.edit(log.getIn(['source', 'uuid']), content)}
                onCancel={() =>
                  actions.stopEditing(log.getIn(['source', 'uuid']))}
                onUpdate={() => actions.onUpdate(log.getIn(['source', 'uuid']))}
              />
            ) : (
              <LogItem
                log={log.get('source')}
                onEdit={() =>
                  actions.startEditing(log.getIn(['source', 'uuid']))}
                onDelete={() =>
                  actions.deleteLog(log.getIn(['source', 'uuid']))}
              />
            )}
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
    deleteLog: PropTypes.func.isRequired,
    fetchLogs: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    startEditing: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    stopEditing: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  LogList,
);
