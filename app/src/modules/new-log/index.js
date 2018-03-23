import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import classNames from 'classnames';

import Textarea from 'react-textarea-autosize';

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

    this.onUpdateContent = this.onUpdateContent.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  onUpdateContent(evt) {
    this.props.actions.updateContent(evt.target.value);
  }

  onCreate() {
    this.props.actions.createLog();
  }

  render() {
    const { content } = this.props;

    const classes = {
      NewLogInput: true,
    };

    return (
      <div className={classNames(classes)}>
        <Textarea
          className="NewLogInput__Content"
          placeholder="Tell me all about your day..."
          onChange={this.onUpdateContent}
          value={content}
        />
        <div className="flex flex-align-right">
          <button className="btn btn-primary btn-sm" onClick={this.onCreate}>
            Create
          </button>
        </div>
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
