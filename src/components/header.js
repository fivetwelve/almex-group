import React from 'react';
import PropType from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import LanguageSelector from './languageSelector';
import '../styles/header.scss';
import logo from '../../static/logo-almex-vert.svg';

const Header = ({ data, activeLang, activeSection }) => {
  const label = data.cms.labels[0];
  const nav = data.cms.navigations[0];
  return (
    <div className="header">
      <div className="contents">
        <span>
          <img src={logo} width="50px" alt="Almex Group" />
        </span>
        <div className="active-section-mobile">{label.header[activeSection]}</div>
        <IconContext.Provider value={{ className: 'menu-icon' }}>
          <button type="button" className="mobile-menu">
            <FaBars aria-hidden />
            <span className="sr-only">Open menu</span>
          </button>
        </IconContext.Provider>
        <nav className="navigation" role="navigation">
          <div className="options">
            <div className="search">
              {label.header.SEARCH}
              <IconContext.Provider value={{ className: 'search-icon' }}>
                {/* <button type="button" className="mobile-menu"> */}
                <FaSearch aria-hidden />
                {/* </button> */}
              </IconContext.Provider>
            </div>
            <div className="brands">{label.header.BRANDS}</div>
            <div className="language">{activeLang}</div>
            <div className="login">{label.header.LOGIN}</div>
          </div>
          <div className="sections">
            <a href="../" className={activeSection === 'PRODUCTS' ? 'active' : ''}>
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
            </a>
          </div>
        </nav>
      </div>
      <LanguageSelector className="language" languages={nav.language} selectedLang={activeLang} />
    </div>
  );
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
        cms {
          navigations {
            language
          }
          labels {
            header
          }
        }
      }
    `}
    render={data => <Header data={data} {...props} />}
  />
);

Header.defaultProps = {
  activeLang: 'en',
  activeSection: '',
  data: {},
};

Header.propTypes = {
  activeLang: PropType.string,
  activeSection: PropType.string,
  data: PropType.shape({
    cms: PropType.shape({
      labels: PropType.array,
      navigations: PropType.array,
    }),
  }),
};
