import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import MarkdownInput from 'components/markdown-input';

import { separateActions } from 'utils/redux';

import { createLog, updateContent } from './actions';
import { selectContent } from './selectors';

import './new-log.scss';

const mapStateToProps = state => ({
  content: selectContent(state),
});

const mapDispatchToProps = {
  createLog,
  updateContent,
};

export class NewLogInput extends PureComponent {
  constructor(props) {
    super(props);

    this.onCreate = this.onCreate.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  onCreate() {
    this.props.actions.createLog();
  }

  onKeyDown(evt) {
    // Cmd+Enter
    if (evt.keyCode === 13 && evt.metaKey) {
      evt.preventDefault();
      this.onCreate();
    }
  }

  render() {
    const { actions, content } = this.props;

    const classes = {
      NewLogInput: true,
    };

    return (
      <div className={classNames(classes)}>
        <MarkdownInput
          placeholder="Tell me about your day..."
          value={content}
          onChange={actions.updateContent}
          onKeyDown={this.onKeyDown}
        >
          <button
            className="btn btn-primary btn-sm"
            onClick={this.onCreate}
            disabled={!content}
          >
            Create
          </button>
        </MarkdownInput>
      </div>
    );
  }
}

NewLogInput.propTypes = {
  content: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    createLog: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  NewLogInput,
);
