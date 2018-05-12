import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import debounce from 'lodash.debounce';

import Markdown from 'components/markdown';
import Textarea from 'components/textarea';

import { hasTitle } from './utils';

import './markdown-input.scss';

class MarkdownInput extends PureComponent {
  constructor(props) {
    super(props);

    this.detectTitle = debounce(this.detectTitle.bind(this), 200);

    this.state = { titleDetected: false };
  }

  componentWillReceiveProps(nextProps) {
    this.detectTitle(nextProps.value);
  }

  componentWillUnmount() {
    this.detectTitle.cancel();
  }

  detectTitle(value) {
    this.setState({ titleDetected: hasTitle(value) });
  }

  render() {
    const { value, placeholder, onChange, onKeyDown, children } = this.props;
    const { titleDetected } = this.state;

    return (
      <div>
        <Tabs>
          <TabList>
            <Tab>Edit</Tab>
            <Tab>Preview</Tab>
          </TabList>

          <TabPanel className="react-tabs__tab-panel MarkdownInput__InputTab">
            <Textarea
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </TabPanel>
          <TabPanel className="react-tabs__tab-panel MarkdownInput__PreviewTab">
            <Markdown
              className="MarkdownInput__Preview"
              text={value || 'Nothing to preview'}
            />
          </TabPanel>
        </Tabs>
        <div className="flex flex-space-between flex-align-items-center MarkdownInput__Footer">
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
          {children}
        </div>
      </div>
    );
  }
}

MarkdownInput.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
};

MarkdownInput.defaultProps = {
  placeholder: '',
  onKeyDown: () => {},
  children: null,
};

export default MarkdownInput;
