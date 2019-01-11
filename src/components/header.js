import React from 'react';
import PropType from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import '../styles/header.scss';
import logo from '../../static/logo-almex-vert.svg';

const Header = ({ activeSection }) => (
  <StaticQuery
    query={graphql`
      query {
        cms {
          navigations {
            labels
          }
        }
      }
    `}
    render={({ cms: { navigations } }) => {
      const nav = navigations[0];
      return (
        <div className="header">
          <span>
            <img src={logo} width="50px" alt="Almex Group" />
          </span>
          <div className="active-section-mobile">{nav.labels[activeSection]}</div>
          <span>
            <i className="fas fa-bars" />
          </span>
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
