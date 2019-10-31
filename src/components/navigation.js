import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import NavigationDropdown from './navigationDropdown';
import NavigationLink from './navigationLink';
import checkKeyPress from '../utils/checkKeyPress';
import { LANGUAGE_SLUGS, REGION_SLUGS } from '../constants';

const mobileLanguages = (activeLanguage, languages, label, region) => {
  const displayLanguages = [];
  languages.forEach(language => {
    if (language === activeLanguage) {
      displayLanguages.push(
        <div className="lang-item" key={language}>
          <span className="link-text active">{language}</span>
        </div>,
      );
    } else {
      displayLanguages.push(
        <div className="lang-item" key={language}>
          <Link to={`/${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}`}>
            <span className="link-text">{language}</span>
          </Link>
        </div>,
      );
    }
  });
  return (
    <>
      <div className="language-container">
        <span className="lang-title">{label}</span>
        <div className="languages">{displayLanguages}</div>
      </div>
    </>
  );
};

/* n.b. Parent <nav> element is in NavWrapper so we may use forwardRef in Header component. */
const Navigation = props => {
  const {
    activeLanguage,
    brandNavigation,
    handleCloseMenuClick,
    label,
    languages,
    location,
    navigation,
    region,
  } = props;
  /* using Hooks instead of component state */
  const [openSection, handleMenuItem] = useState('');
  const mobileBrandMenuOpen = brandNavigation.type === openSection;
  const sortedNavigationSections = [];
  navigation.sortOrder.forEach(elem => {
    sortedNavigationSections.push(
      navigation.navigationSections.filter(section => section.type === elem)[0],
    );
  });

  checkKeyPress('Escape', () => {
    handleMenuItem('');
  });

  /* Brand menu below is for mobile. Desktop brand menu is BrandSelector in Header */
  return (
    <>
      <div className="close-container">
        <IconContext.Provider value={{ className: 'close-icon' }}>
          <button type="button" className="close-menu" onClick={evt => handleCloseMenuClick(evt)}>
            <FaTimes aria-hidden />
            <span className="sr-only">Open menu</span>
          </button>
        </IconContext.Provider>
      </div>
      <div className="mobile-options">
        {languages.length > 1 &&
          mobileLanguages(activeLanguage, languages, label.header.LANGUAGES, region)}
        {brandNavigation.pages && brandNavigation.pages.length > 0 && (
          <NavigationDropdown
            activeLanguage={activeLanguage}
            handleMenuItem={type => handleMenuItem(type)}
            location={location}
            section={brandNavigation}
            isOpen={mobileBrandMenuOpen}
            label={label.common}
          />
        )}
      </div>
      <div className="sections">
        {sortedNavigationSections.length > 0 &&
          sortedNavigationSections.map(section => {
            const isOpen = section.type === openSection;
            if (section.isLandingPage) {
              return (
                <NavigationLink
                  activeLanguage={activeLanguage}
                  key={section.type}
                  location={location}
                  section={section}
                />
              );
            }
            return (
              <NavigationDropdown
                activeLanguage={activeLanguage}
                handleMenuItem={type => handleMenuItem(type)}
                key={section.type}
                location={location}
                section={section}
                isOpen={isOpen}
                label={label.common}
              />
            );
          })}
      </div>
    </>
  );
};

Navigation.defaultProps = {
  activeLanguage: '',
  brandNavigation: {},
  handleCloseMenuClick: () => {},
  label: {},
  languages: [],
  location: {},
  navigation: {},
  region: '',
};

Navigation.propTypes = {
  activeLanguage: PropTypes.string,
  brandNavigation: PropTypes.shape({
    pages: PropTypes.array,
    type: PropTypes.string,
  }),
  handleCloseMenuClick: PropTypes.func,
  label: PropTypes.shape({
    header: PropTypes.object,
    footer: PropTypes.object,
    common: PropTypes.object,
  }),
  languages: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  navigation: PropTypes.shape({
    navigationSections: PropTypes.array,
    sortOrder: PropTypes.array,
  }),
  region: PropTypes.string,
};

export default Navigation;
