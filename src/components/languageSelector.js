import React, { useState } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown } from 'react-icons/fa';
import checkKeyPress from '../utils/checkKeyPress';
import { LANGUAGE_SLUGS, REGION_SLUGS } from '../constants';
/* n.b. Shared CSS is imported in Header from dropdowns.scss */

const LanguageSelector = props => {
  const [openMenu, handleMenuState] = useState(false);
  const { activeLanguage, languages, region } = props;

  const handleClickDropDown = evt => {
    evt.preventDefault();
    handleMenuState(!openMenu);
  };

  checkKeyPress('Escape', () => {
    handleMenuState(false);
  });

  return (
    <div className="lang-selector">
      <button
        type="button"
        aria-expanded="false"
        aria-haspopup="true"
        className={`nav__trigger ${openMenu && 'is-open'}`}
        onClick={evt => {
          handleClickDropDown(evt);
        }}
      >
        <span className="dd-text-icon">
          {LANGUAGE_SLUGS[activeLanguage].toUpperCase()}
          <span aria-hidden="true" className="dd-icon">
            <IconContext.Provider value={{ className: 'chevron' }}>
              <FaAngleDown aria-hidden />
            </IconContext.Provider>
          </span>
        </span>
      </button>
      <ul role="menu" className={`lang-dropdown ${openMenu && 'visible'}`}>
        {languages.map(language => (
          <li className="nav__list" key={language}>
            <Link to={`/${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}`}>
              <span className="nav__link">{LANGUAGE_SLUGS[language].toUpperCase()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
  // }
};

LanguageSelector.defaultProps = {
  activeLanguage: '',
  languages: [],
  region: '',
};

LanguageSelector.propTypes = {
  activeLanguage: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  region: PropTypes.string,
};

export default LanguageSelector;
