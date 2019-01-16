import React from 'react';
import PropTypes from 'prop-types';

const LanguageSelector = ({ activeLanguage, languages }) => (
  <div className="lang-selector">
    It&apos;s {activeLanguage}
    <div>{languages[0]}</div>
    <div>{languages[1]}</div>
  </div>
);

LanguageSelector.defaultProps = {
  activeLanguage: 'en',
  languages: ['en'],
};

LanguageSelector.propTypes = {
  activeLanguage: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
};

export default LanguageSelector;
