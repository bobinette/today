import React from 'react';
import PropTypes from 'prop-types';

import remark from 'remark';
import remarkEmoji from 'remark-emoji';
import remarkReact from 'remark-react';
import githubSanitize from 'hast-util-sanitize/lib/github.json';
import merge from 'deepmerge';

const createElement = (name, attrs, children) => {
  switch (name) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return React.createElement('strong', attrs, children);
    default:
      break;
  }
  return React.createElement(name, attrs, children);
};

export const Markdown = ({ text, className }) => {
  const sanitize = merge(githubSanitize, {
    attributes: { '*': ['className'] },
  });
  try {
    const md = remark()
      .use(remarkEmoji)
      .use(remarkReact, {
        createElement,
        sanitize,
      })
      .processSync(text).contents;
    return <div className={`Markdown ${className}`}>{md}</div>;
  } catch (e) {
    return (
      <div className={`Markdown ${className} Markdown__Error`}>
        Could not parse markdown
      </div>
    );
  }
};

Markdown.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
};

Markdown.defaultProps = {
  className: '',
};

export default Markdown;
