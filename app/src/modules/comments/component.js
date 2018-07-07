import React, { PureComponent } from 'react';
import PropType from 'prop-types';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import moment from 'moment';

import Textarea from 'components/textarea';

import { saveComment, updateNewCommentValue } from './actions';
import { selectComments } from './selectors';

const mapStateToProps = (state, ownProps) => ({
  comments: selectComments(state).getIn([ownProps.logUuid, 'source']) || List(),
  creating:
    selectComments(state).getIn([ownProps.logUuid, 'edited', 'saving']) ||
    false,
  newCommentValue:
    selectComments(state).getIn([ownProps.logUuid, 'edited', 'content']) || '',
});

const mapDispatchToProps = {
  onAddComment: saveComment,
  onUpdateNewCommentValue: updateNewCommentValue,
};

export class Comments extends PureComponent {
  state = { commentsVisible: false, editorVisible: false };

  onHideComments = () => {
    this.setState({ commentsVisible: false });
  };

  onShowComments = () => {
    this.setState({ commentsVisible: true });
  };

  onHideEditor = () => {
    this.setState({ editorVisible: false });
  };

  onShowEditor = () => {
    this.setState({ editorVisible: true });
  };

  onUpdateNewCommentValue = comment => {
    const { onUpdateNewCommentValue, logUuid } = this.props;
    onUpdateNewCommentValue(logUuid, comment);
  };

  onEditorKeyDown = evt => {
    if (evt.keyCode === 27) {
      // esc
      evt.preventDefault();
      evt.stopPropagation();

      this.onHideEditor();
    } else if (evt.keyCode === 13 && evt.metaKey) {
      // cmd+enter
      evt.preventDefault();
      this.onAddComment();
    }
  };

  onAddComment = () => {
    const { logUuid, onAddComment, newCommentValue } = this.props;
    onAddComment(logUuid, newCommentValue);
  };

  renderComment(comment) {
    return (
      <div>
        <div>
          <small className="text-muted flex-1">
            <em>
              {moment(comment.get('createdAt')).format('L')}&nbsp;
              {moment(comment.get('createdAt')).format('LT')}
            </em>
          </small>
        </div>
        <div>{comment.get('content')}</div>
      </div>
    );
  }

  renderComments() {
    const { comments } = this.props;
    const { commentsVisible } = this.state;

    if (!commentsVisible) {
      if (!comments.size) {
        return null;
      }
      return (
        <button
          className="btn btn-link btn-sm btn-no-padding btn-action"
          onClick={this.onShowComments}
        >
          <em className="text-muted">{comments.size} comments</em>
        </button>
      );
    }

    return (
      <div>
        <div className="flex flex-align-items-center">
          <div className="v-line flex-1" />
          <button
            className="btn btn-link btn-sm btn-no-padding btn-action"
            onClick={this.onHideComments}
          >
            <em className="text-muted">Hide comments</em>
          </button>
          <div className="v-line flex-1" />
        </div>
        {comments.map(comment => (
          <div key={comment.get('uuid')}>{this.renderComment(comment)}</div>
        ))}
      </div>
    );
  }

  renderEditor() {
    const { newCommentValue, creating } = this.props;
    const { editorVisible } = this.state;

    if (!editorVisible) {
      return (
        <button
          className="btn btn-link btn-sm btn-no-padding btn-action"
          onClick={this.onShowEditor}
        >
          Add a comment
        </button>
      );
    }

    return (
      <div>
        <Textarea
          value={newCommentValue}
          placeholder="Enter a new comment"
          onChange={this.onUpdateNewCommentValue}
          onKeyDown={this.onEditorKeyDown}
        />
        <button
          className="btn btn-primary btn-sm LogItemEditing__Update"
          onClick={this.onAddComment}
          disabled={creating}
        >
          {creating ? (
            <span>
              Commenting...<i className="fas fa-circle-notch fa-spin btn-spinner" />
            </span>
          ) : (
            'Comment'
          )}
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="Comments">
        <div>
          {this.renderComments()}
          {this.renderEditor()}
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  logUuid: PropType.string.isRequired,
  newCommentValue: PropType.string.isRequired,
  creating: PropType.bool.isRequired,
  comments: ImmutablePropTypes.list.isRequired,
  onAddComment: PropType.func.isRequired,
  onUpdateNewCommentValue: PropType.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
