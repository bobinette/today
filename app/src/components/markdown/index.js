import React from 'react';
import PropTypes from 'prop-types';

import remark from 'remark';
import remarkEmoji from 'remark-emoji';
import remarkReact from 'remark-react';
import remarkMath from 'remark-math';
import remarkKatex from 'remark-html-katex';

import githubSanitize from 'hast-util-sanitize/lib/github.json';
import merge from 'deepmerge';

import camelCase from 'lodash.camelcase';

import todayReference, { handler } from './references';
import tag from './tags';

import TodayReference from './components/today-reference';

import './markdown.scss';

const createElement = (name, attrs, children) => {
  let eltName = name;
  let attributes = attrs;

  switch (name) {
    // Because hast-to-hyperscript kebab-cases the attributes, I have to re-camelCase
    // them in order for the svg in katex to work...
    case 'svg':
    case 'path':
      attributes = {}; // reset
      Object.keys(attrs).forEach(key => {
        attributes[camelCase(key)] = attrs[key];
      });
      break;

    // Transform the titles into simple strong tags
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      eltName = 'strong';
      break;
    // Custom elements:
    case 'TodayReference':
      return <TodayReference autoLoad={attrs['auto-load']} {...attrs} />;
    default:
      break;
  }
  return React.createElement(eltName, attributes, children);
};

export const Markdown = ({ text, className, autoLoadReferences }) => {
  const sanitize = merge(githubSanitize, {
    attributes: {
      '*': ['className'],
      TodayReference: ['uuid', 'autoLoad'],
      span: ['className', 'style'],
      svg: ['height', 'width', 'viewBox', 'preserveAspectRatio'],
      path: ['d'],
    },
    tagNames: ['TodayReference', 'span', 'svg', 'path'],
  });
  try {
    const md = remark()
      .use(remarkEmoji)
      .use(todayReference, {
        autoLoad: autoLoadReferences,
      })
      .use(tag)
      .use(remarkMath)
      .use(remarkKatex)
      .use(remarkReact, {
        createElement,
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
