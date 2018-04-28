import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Autosuggest from 'react-autosuggest';

import classNames from 'classnames';

import axios from 'axios';
import qs from 'qs';
import apiUrl from 'utils/apiUrl';

import Textarea from 'react-textarea-autosize';
import getCaretCoordinates from 'textarea-caret';

import { separateActions } from 'utils/redux';

import { createLog, updateContent } from './actions';
import { selectContent, selectTitleDetected } from './selectors';

import './new-log.scss';

const mapStateToProps = state => ({
  content: selectContent(state),
  titleDetected: selectTitleDetected(state),
});

const mapDispatchToProps = {
  createLog,
  updateContent,
};

const TAG_REGEX = /^(?:\B)(#(?:\w|-|:)+)\b$/;

const renderSuggestion = (s, { isHighlighted }) => (
  <div
    className={classNames('TodayAutoComplete__Item', {
      'TodayAutoComplete__Item--selected': isHighlighted,
    })}
  >
    {s}
  </div>
);

export class NewLogInput extends PureComponent {
  constructor(props) {
    super(props);

    this.onCreate = this.onCreate.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this,
    );
    this.getSuggestionQueryAndIndex = this.getSuggestionQueryAndIndex.bind(
      this,
    );
    this.fetchTags = this.fetchTags.bind(this);
    this.resetTags = this.resetTags.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.renderInputComponent = this.renderInputComponent.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(
      this,
    );

    this.textarea = null;
    this.state = { tags: [], hideSuggestions: false, tmpContent: '' };
  }

  onCreate() {
    this.props.actions.createLog();
  }

  onChange(evt, { newValue, method }) {
    const { actions } = this.props;
    let { value } = evt.target;

    switch (method) {
      case 'enter':
        value = this.handleEnter(evt, { newValue });
        break;
      case 'click':
        value = this.handleClick(evt, { newValue });
        break;
      default:
        this.setState({ hideSuggestions: false, tmpContent: '' });
    }

    actions.updateContent(value);
  }

  onSuggestionsFetchRequested({ value }) {
    const { query, index } = this.getSuggestionQueryAndIndex(value);
    if (!query || index < 0) {
      this.resetTags();
    } else {
      this.fetchTags(query, index);
    }
  }

  getSuggestionQueryAndIndex(value) {
    if (!this.textarea) {
      return { query: '', index: -1 };
    }

    const lastTagIndex = value.lastIndexOf('#', this.textarea.selectionStart);
    if (lastTagIndex < 0) {
      return { query: '', index: -1 };
    }

    const substr = value.substr(
      lastTagIndex,
      this.textarea.selectionStart - lastTagIndex,
    );
    const match = substr.match(TAG_REGEX);
    if (!match) {
      return { query: '', index: -1 };
    }

    return { query: substr, index: lastTagIndex };
  }

  async fetchTags(query, tagStart) {
    let tags = [];
    try {
      const response = await axios.get(
        `${apiUrl}/api/tags${qs.stringify(
          { q: query.substr(1) },
          { skipNulls: true, indices: false, addQueryPrefix: true },
        )}`,
      );
      tags = response.data;
    } catch (error) {
      console.log(error);
    }

    this.setState({ tags, tagStart });
  }

  handleClick(evt, { newValue }) {
    const { newContent, newPosition } = this.selectTag(newValue);

    this.setState({ hideSuggestions: true, tmpContent: newContent }, () => {
      this.textarea.selectionStart = newPosition;
      this.textarea.selectionEnd = newPosition;
    });
    return newContent;
  }

  handleEnter(evt, { newValue }) {
    evt.preventDefault();
    evt.stopPropagation();

    const { newContent, newPosition } = this.selectTag(newValue);

    this.setState({ hideSuggestions: true, tmpContent: newContent }, () => {
      this.textarea.selectionStart = newPosition;
      this.textarea.selectionEnd = newPosition;
    });
    return newContent;
  }

  resetTags() {
    this.setState({ tags: [] });
  }

  selectTag(value) {
    const { content } = this.props;
    const { query, index } = this.getSuggestionQueryAndIndex(content);

    const newContent = `${content.substring(
      0,
      index,
    )}${value}${content.substring(index + query.length)}`;
    const newPosition = index + value.length;
    return { newContent, newPosition };
  }

  renderInputComponent(inputProps) {
    const { className } = inputProps;

    return (
      <Textarea
        inputRef={textarea => {
          this.textarea = textarea;

          // For correctly setting the autowhatever.input
          // When clicking on a suggestion to use it, the reference
          // is needed to '.focus()'
          if (inputProps.ref) {
            inputProps.ref(textarea);
          }
        }}
        {...Object.assign({}, inputProps, {
          className: classNames(className, 'NewLogInput__Content'),
          ref: null,
        })}
      />
    );
  }

  renderSuggestionsContainer({ containerProps, children }) {
    if (!this.textarea) return null;

    const { tagStart, hideSuggestions } = this.state;
    if (hideSuggestions) return null;

    const style = containerProps.style || {};
    const { top, left, height } = getCaretCoordinates(this.textarea, tagStart);

    const y = top + height;
    const x = left;
    style.top = y;
    style.left = x;
    style.position = 'absolute';

    return (
      <div style={style} {...containerProps} className="TodayAutoComplete">
        {children}
      </div>
    );
  }

  render() {
    const { content, titleDetected } = this.props;
    const { tags, tmpContent } = this.state;

    const classes = {
      NewLogInput: true,
    };

    return (
      <div className={classNames(classes)}>
        <Autosuggest
          suggestions={tags}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.resetTags}
          getSuggestionValue={s => s}
          renderSuggestion={renderSuggestion}
          inputProps={{
            placeholder: 'Tell me about your day...',
            value: tmpContent || content,
            onChange: this.onChange,
          }}
          renderInputComponent={this.renderInputComponent}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          alwaysRenderSuggestions
        />
        <div className="flex flex-space-between flex-align-items-center">
          <small className="text-muted text-sm">
            <a href="https://guides.github.com/features/mastering-markdown/">
              Use markdown styling
            </a>
            &nbsp;(with no title)
            {titleDetected && (
              <span className="NewLogInput__TitleDetected">
                <i className="fas fa-exclamation-triangle NewLogInput__TitleDetectedIcon" />A
                title was detected. It will be used as a <strong>strong</strong>{' '}
                tag
              </span>
            )}
          </small>
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
  titleDetected: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    createLog: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps, separateActions)(
  NewLogInput,
);
