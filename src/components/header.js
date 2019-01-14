import React from 'react';
import PropType from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import '../styles/header.scss';
import logo from '../../static/logo-almex-vert.svg';

const Header = ({ activeSection }) => (
  <StaticQuery
    query={graphql`
      query {
        cms {
          labels {
            header
          }
        }
      }
    `}
    render={({ cms: { labels } }) => {
      const label = labels[0];
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
            <div className="navigation">
              <div className="search-login">
                <div className="search">
                  {label.header.SEARCH}
                  <IconContext.Provider value={{ className: 'search-icon' }}>
                    {/* <button type="button" className="mobile-menu"> */}
                    <FaSearch aria-hidden />
                    {/* </button> */}
                  </IconContext.Provider>
                </div>
                <div className="language">EN</div>
                <div className="login">{label.header.LOGIN}</div>
              </div>
              <nav>
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
              </nav>
            </div>
          </div>
        </div>
      );
    }}
  />
);

Header.defaultProps = {
  activeSection: {},
};

Header.propTypes = {
  activeSection: PropType.string,
};

export default Header;
