import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import './searchbar.scss';

const SearchBar = ({ className, q, onChange }) => (
  <div className={classNames('SearchBar', className)}>
    <i className="fas fa-search" />
    <input
      className="SearchBar__input"
      value={q}
      onChange={evt => onChange(evt.target.value)}
      placeholder="Search your logs..."
    />
  </div>
);

SearchBar.propTypes = {
  className: PropTypes.string,
  q: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

SearchBar.defaultProps = {
  className: '',
};

export default SearchBar;
