import React, { PureComponent } from 'react';
import PropType from 'prop-types';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { toastr } from 'react-redux-toastr';

import moment from 'moment';

import CommentInput from './components/input';

import { appendComment, updateNewCommentValue } from './actions';
import actions from './api';
import { selectComments } from './selectors';

const mapStateToProps = (state, ownProps) => ({
  comments: selectComments(state).getIn([ownProps.logUuid, 'source']) || List(),
});

const mapDispatchToProps = {
  appendComment,
  onError: toastr.error,
  onUpdateNewCommentValue: updateNewCommentValue,
};

export class Comments extends PureComponent {
  constructor(props) {
    super(props);

    this.onAddComment = this.onAddComment.bind(this);
    this.state = { commentsVisible: false, editorVisible: false };
  }

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

  async onAddComment(comment) {
    const { logUuid } = this.props;
    const { data, error } = await actions.saveComment(logUuid, comment);

    if (error) {
      const { message } = error;
      this.props.onError('', `Could not save your comment: ${message}`);
      return;
    }

    this.props.appendComment(logUuid, data);
  }

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
        <button
          className="btn btn-link btn-sm btn-no-padding btn-action flex flex-align-items-center w-100"
          onClick={this.onHideComments}
        >
          <div className="v-line flex-1" />
          <em className="text-muted">Hide comments</em>
          <div className="v-line flex-1" />
        </button>
        {comments.map(comment => (
          <div key={comment.get('uuid')}>{this.renderComment(comment)}</div>
        ))}
      </div>
    );
  }

  renderEditor() {
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
      <div className="Comments__Input">
        <CommentInput
          placeholder="Type your comment here..."
          onSave={this.onAddComment}
          onCancel={this.onHideEditor}
        />
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
  comments: ImmutablePropTypes.list.isRequired,
  appendComment: PropType.func.isRequired,
  onError: PropType.func.isRequired,
  onUpdateNewCommentValue: PropType.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
