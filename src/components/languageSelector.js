import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import constants from '../constants';
/* n.b. Shared CSS is imported in Header from dropdowns.scss */

class LanguageSelector extends Component {
  constructor(props) {
    super(props);
    this.myDropDown = React.createRef();
    this.state = {
      clicked: false,
    };
  }

  // handleKeyDown = evt => {
  //   let dropdownSibling = document.activeElement.nextElementSibling;
  //   if (evt.keyCode == 38) {
  //     if (dropdownSibling) {
  //       dropdownSibling.childNodes[0].previousElementSibling.firstElementChild.focus();
  //     } else {
  //       dropdownSibling = document.activeElement.parentElement.previousElementSibling.firstElementChild;
  //       dropdownSibling.focus();
  //     }
  //   }
  //   if (evt.keyCode == 40) {
  //     if (dropdownSibling) {
  //       dropdownSibling.childNodes[0].nextElementSibling.firstElementChild.focus();
  //     } else {
  //       dropdownSibling = document.activeElement.parentElement.nextElementSibling.firstElementChild;
  //       dropdownSibling.focus();
  //     }
  //   }
  //   if (evt.keyCode == 27) {
  //     evt.preventDefault();
  //     document.activeElement.parentElement.parentElement.classList.remove('nav__dropdown--visible');
  //     document.activeElement.parentElement.parentElement.previousElementSibling.setAttribute(
  //       'aria-expanded',
  //       'false'
  //     );
  //     // Bring focus back to top level parent
  //     document.activeElement.parentElement.parentElement.previousElementSibling.focus();
  //   }
  // }

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.classList.toggle('clicked');
    evt.target.nextElementSibling.classList.toggle('lang-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  render() {
    const { activeLanguage, languages, region } = this.props;
    const { clicked } = this.state;
    const { allLanguageSlugs, allRegionSlugs } = constants;

    return (
      <div className="language lang-selector" ref={this.myDropDown}>
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className="nav__trigger"
          onClick={evt => {
            this.handleClickDropDown(evt);
          }}
          // onKeyDown={evt => {
          //   this.handleKeyDown(evt);
          // }}
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
            <li className="nav__list" key={language}>
              <a href={`/${allRegionSlugs[region]}/${allLanguageSlugs[language]}`}>
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
