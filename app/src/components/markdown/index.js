import React from 'react';
import PropTypes from 'prop-types';

import remark from 'remark';
import remarkEmoji from 'remark-emoji';
import remarkReact from 'remark-react';
import remarkReactLowlight from 'remark-react-lowlight';
import githubSanitize from 'hast-util-sanitize/lib/github.json';
import merge from 'deepmerge';

import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

import todayReference, { handler } from './references';

import TodayReference from './components/today-reference';

import './markdown.scss';

const createElement = (name, attrs, children) => {
  switch (name) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return React.createElement('strong', attrs, children);
    case 'TodayReference':
      return <TodayReference autoLoad={attrs['auto-load']} {...attrs} />;
    default:
      break;
  }
  return React.createElement(name, attrs, children);
};

export const Markdown = ({ text, className, autoLoadReferences }) => {
  const sanitize = merge(githubSanitize, {
    attributes: {
      '*': ['className'],
      TodayReference: ['uuid', 'autoLoad'],
    },
    tagNames: ['TodayReference'],
  });
  try {
    const md = remark()
      .use(remarkEmoji)
      .use(todayReference, {
        autoLoad: autoLoadReferences,
      })
      .use(remarkReact, {
        createElement,
        // remarkReactComponents: {
        //   code: remarkReactLowlight({ js }),
        // },
        sanitize,
        toHast: {
          handlers: handler,
        },
      })
      .processSync(text).contents;
    return <div className={`Markdown ${className}`}>{md}</div>;
  } catch (e) {
    console.log(e);
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
  autoLoadReferences: PropTypes.bool.isRequired,
};

Markdown.defaultProps = {
  className: '',
  autoLoadReferences: false,
};

export default Markdown;
