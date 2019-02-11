import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import BrandSelector from './brandSelector';
import LanguageSelector from './languageSelector';
import '../styles/header.scss';
import '../styles/dropdowns.scss';
import hLogo from '../../static/logo-almex-hori.svg';
import vLogo from '../../static/logo-almex-vert.svg';
// import Dump from '../utils/dump';

const Header = ({ activeLanguage, activeSection, headerFooters, labels, region }) => {
  const label = labels[0];
  const headerFooter = headerFooters[0];

  return (
    <>
      <div className="header">
        <div className="contents">
          <span className="logo">
            <img src={vLogo} width="50px" alt="Almex Group" className="vertical" />
            <img src={hLogo} width="225px" alt="Almex Group" className="horizontal" />
          </span>
          <div className="active-section-mobile">{labels[0].header[activeSection]}</div>
          <IconContext.Provider value={{ className: 'menu-icon' }}>
            <button type="button" className="mobile-menu">
              <FaBars aria-hidden />
              <span className="sr-only">Open menu</span>
            </button>
          </IconContext.Provider>
          <div className="options-container">
            <div className="options">
              <div className="search">
                {label.header.SEARCH}
                <IconContext.Provider value={{ className: 'search-icon' }}>
                  {/* <button type="button" className="mobile-menu"> */}
                  <FaSearch aria-hidden />
                  {/* </button> */}
                </IconContext.Provider>
              </div>
              {/* <div className="brands">
              {label.header.BRANDS}
              <IconContext.Provider value={{ className: 'brands-icon' }}>
                <FaAngleDown aria-hidden />
              </IconContext.Provider>
            </div> */}
              <BrandSelector />
              <LanguageSelector
                activeLanguage={activeLanguage}
                languages={headerFooter.language}
                region={region}
              />
              <div className="login">{label.header.LOGIN}</div>
            </div>
            <div className="tagline-container">
              <span className="tagline">{headerFooter.simpleTagline}</span>
            </div>
          </div>
        </div>
        <nav className="navigation">
          <div className="sections">
            {headerFooter.navigation.length > 0 &&
              headerFooter.navigation.map(section => (
                <div className="section-container" key={section.TYPE}>
                  <div className="section">{label.header[section.TYPE]}</div>
                  <div className="indicator" />
                </div>
              ))}

            {/* <a href="../" className={activeSection === 'PRODUCTS' ? 'active' : ''}>
              {label.header.PRODUCTS}
            </a>
            <a href="../" className={activeSection === 'INDUSTRIES' ? 'active' : ''}>
              {label.header.INDUSTRIES}
            </a>
            <a href="../" className={activeSection === 'SERVICES' ? 'active' : ''}>
              {label.header.SERVICES}
            </a>
            <a href="../" className={activeSection === 'ABOUT' ? 'active' : ''}>
              {label.header.ABOUT}
            </a> */}
          </div>
        </nav>
      </div>
    </>
  );
};

Header.defaultProps = {
  activeLanguage: '',
  activeSection: '',
  headerFooters: [],
  labels: [],
  region: '',
};

Header.propTypes = {
  activeLanguage: PropTypes.string,
  activeSection: PropTypes.string,
  headerFooters: PropTypes.instanceOf(Array),
  labels: PropTypes.instanceOf(Array),
  region: PropTypes.string,
};

export default Header;
