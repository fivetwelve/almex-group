import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import * as log from 'loglevel';
import constants from '../constants';
import '../styles/languageSelector.scss';

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.classList.toggle('clicked');
    evt.target.nextElementSibling.classList.toggle('lang-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  handleClickLanguage = (evt, language) => {
    evt.preventDefault();
    log.warn(`lang: ${language}`);
  };

  render() {
    const { activeLanguage, languages, region } = this.props;
    const { clicked } = this.state;
    const { langList, regionList } = constants;

    return (
      <div className="language lang-selector">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className="nav__trigger"
          onClick={evt => {
            this.handleClickDropDown(evt);
          }}
          onKeyDown={evt => {
            this.handleClickDropDown(evt);
          }}
        >
          <span className="dd-text-icon">
            {activeLanguage}
            <span aria-hidden="true" className="dd-icon">
              <IconContext.Provider value={{ className: 'brands-icon' }}>
                {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
              </IconContext.Provider>
            </span>
          </span>
        </button>
        <ul id="dropdown-1" role="menu" className="lang-dropdown">
          {languages.map(language => (
            <li className="nav__list">
              <a href={`/${regionList[region]}/${langList[language]}`}>
                <span className="nav__link">{language}</span>
              </a>
            </li>
            //   <button
            //     type="button"
            //     href="#"
            //     role="menuitem"
            //     className="nav__link"
            //     onClick={evt => {
            //       this.handleClickLanguage(evt, language, region);
            //     }}
            //   >
            //     {language}
            //   </button>
          ))}
        </ul>
      </div>
    );
  }
}

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
