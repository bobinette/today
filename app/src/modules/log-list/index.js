import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { List } from 'immutable';

import SearchBar from 'components/searchbar';

import { selectComments } from 'modules/comments/selectors';

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
  comments: selectComments(state),
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
    const { q, actions, logs, comments } = this.props;

    return (
      <div className="container">
        <NewLogInput />
        <SearchBar
          className="LogList__searchBar col-md-8 offset-md-2"
          q={q}
          onChange={actions.onSearchChange}
        />
        {logs.map(log => {
          const uuid = log.getIn(['source', 'uuid']);
          return (
            <div key={uuid}>
              {log.getIn(['edited', 'editing']) ? (
                <LogItemEditing
                  uuid={uuid}
                  content={log.getIn(['edited', 'content'])}
                  updating={log.getIn(['edited', 'updating'])}
                  onEditContent={actions.edit}
                  onCancel={actions.stopEditing}
                  onUpdate={actions.onUpdate}
                />
              ) : (
                <LogItem
                  log={log.get('source')}
                  onEdit={actions.startEditing}
                  onDelete={actions.deleteLog}
                  comments={comments.get(uuid)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

LogList.propTypes = {
  logs: ImmutablePropTypes.list.isRequired,
  q: PropTypes.string.isRequired,
  comments: ImmutablePropTypes.map.isRequired,
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
