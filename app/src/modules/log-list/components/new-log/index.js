import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Textarea from 'react-textarea-autosize';

import { createLog } from 'modules/log-list/actions';

import { separateActions } from 'utils/redux';

import './new-log.scss';

const mapDispatchToProps = {
  createLog,
};

class NewLog extends PureComponent {
  _timeoutID;

  constructor(props) {
    super(props);

    this.onUpdateTitle = this.onUpdateTitle.bind(this);
    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onCreate = this.onCreate.bind(this);

    this.state = { title: '', content: '', showContent: false };
  }

  onUpdateTitle(evt) {
    this.setState({ title: evt.target.value });
  }

  onUpdateContent(evt) {
    this.setState({ content: evt.target.value });
  }

  onFocus() {
    clearTimeout(this._timeoutID);
    if (!this.state.showContent) {
      this.setState({
        showContent: true,
      });
    }
  }

  onBlur() {
    this._timeoutID = setTimeout(() => {
      if (this.state.showContent) {
        this.setState({ showContent: false });
        this.setState({
          showContent: false,
        });
      }
    }, 0);
  }

  onCreate() {
    const { title, content } = this.state;
    this.props.actions.createLog({ title, content });
  }

  render() {
    const { title, content, showContent } = this.state;
    return (
      <div className="NewLogInput" onFocus={this.onFocus} onBlur={this.onBlur}>
        <input
          className="NewLogInput__Title"
          onChange={this.onUpdateTitle}
          placeholder="You don't know what happened today..."
        />
        {showContent && (
          <div>
            <Textarea
              className="NewLogInput__Content"
              placeholder="Tell me all about your day..."
              onChange={this.onUpdateContent}
              value={content}
            />
            <div className="flex flex-align-right">
              <button
                className="btn btn-primary btn-sm"
                onClick={this.onCreate}
              >
                Create
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

NewLog.propTypes = {
  actions: PropTypes.shape({
    createLog: PropTypes.func.isRequired,
  }),
};

export default connect(() => ({}), mapDispatchToProps, separateActions)(NewLog);
