import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import AutosizeTextarea from 'react-textarea-autosize';
import getCaretCoordinates from 'textarea-caret';

import axios from 'axios';
import qs from 'qs';
import apiUrl from 'utils/apiUrl';

import Autosuggest from './react-autosuggest';

import './textarea.scss';

const TAG_REGEX = /^(?:\B)(#(?:\w|-|:)+)\b$/;

class Textarea extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this,
    );
    this.fetchTags = this.fetchTags.bind(this);
    this.getSuggestionQueryAndIndex = this.getSuggestionQueryAndIndex.bind(
      this,
    );
    this.handleClick = this.handleClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.selectTag = this.selectTag.bind(this);
    this.resetTags = this.resetTags.bind(this);
    this.renderInputComponent = this.renderInputComponent.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(
      this,
    );

    this.textarea = null;

    const { value } = this.props;
    this.state = {
      hideSuggestions: false,
      value,
      tags: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({ value });
  }

  onChange(evt, { newValue, method }) {
    let { value } = evt.target;

    switch (method) {
      case 'enter':
        value = this.handleEnter(evt, { newValue });
        break;
      case 'click':
        value = this.handleClick(evt, { newValue });
        break;
      default:
        this.setState({ hideSuggestions: false });
        break;
    }

    this.setState({ value });
    this.props.onChange(value);
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

    this.setState({ hideSuggestions: true, value: newContent }, () => {
      this.textarea.selectionStart = newPosition;
      this.textarea.selectionEnd = newPosition;
    });
    return newContent;
  }

  handleEnter(evt, { newValue }) {
    evt.preventDefault();
    evt.stopPropagation();

    const { newContent, newPosition } = this.selectTag(newValue);

    this.setState({ hideSuggestions: true, value: newContent }, () => {
      this.textarea.selectionStart = newPosition;
      this.textarea.selectionEnd = newPosition;
    });
    return newContent;
  }

  selectTag(tag) {
    const { value } = this.state;
    const { query, index } = this.getSuggestionQueryAndIndex(value);

    const newContent = `${value.substring(0, index)}${tag}${value.substring(
      index + query.length,
    )}`;
    const newPosition = index + tag.length;
    return { newContent, newPosition };
  }

  resetTags() {
    this.setState({ tags: [] });
  }

  renderInputComponent(inputProps) {
    const { className } = inputProps;

    return (
      <AutosizeTextarea
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
          className: classNames(className, 'Textarea__Content'),
          ref: null,
        })}
      />
    );
  }

  renderSuggestion(s, { isHighlighted }) {
    return (
      <div
        className={classNames('Textarea__Item', {
          'Textarea__Item--selected': isHighlighted,
        })}
      >
        {s}
      </div>
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
      <div style={style} {...containerProps} className="TextareaContainer">
        {children}
      </div>
    );
  }

  render() {
    const { placeholder, onKeyDown } = this.props;
    const { value, tags } = this.state;

    return (
      <Autosuggest
        suggestions={tags}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.resetTags}
        getSuggestionValue={s => s}
        renderSuggestion={this.renderSuggestion}
        inputProps={{
          placeholder,
          value,
          onKeyDown,
          onChange: this.onChange,
        }}
        renderInputComponent={this.renderInputComponent}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
      />
    );
  }
}

Textarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
};

Textarea.defaultProps = {
  placeholder: '',
  onKeyDown: () => {},
};

export default Textarea;
