import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import BrandSelector from './brandSelector';
import LanguageSelector from './languageSelector';
import Navigation from './navigation';
import NavWrapper from './navWrapper';
import { createLink } from '../utils/functions';
import '../styles/header.scss';
import '../styles/headerOptions.scss';
import hLogo from '../../static/img/logo-almex-hori.svg';
import vLogo from '../../static/img/logo-almex-vert.svg';
// import Dump from '../utils/dump';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myRef = {};
    const { headerFooter } = this.props;
    const nav = headerFooter.navigation;
    for (let i = 0; i < nav.length; i += 1) {
      const navType = nav[i].TYPE;
      this.myRef[navType] = React.createRef();
    }
    this.navWrapperRef = React.createRef();
  }

  componentDidUpdate() {
    // console.log(this.myRef);
  }

  // closeOtherMenus = type => {
  // console.log(`type: ${type}`);
  // const { headerFooter } = this.props;
  // const nav = headerFooter[0].navigation;
  // console.log('myref:', this.myRef['PRODUCTS']);
  // for (let i = 0; i < nav.length; i += 1) {
  //   const navType = nav[i].TYPE;
  //   console.log('nav:', this.myRef[navType]);
  //   // console.log(`navType: ${navType}`);
  //   // console.log(this.PRODUCTS.current);
  //   if (type !== navType) {
  //     this.myRef[navType].current.toggleMenu();
  //   }
  // }
  // };

  handleMobileMenuClick = evt => {
    evt.preventDefault();
    const { showMobileBG } = this.props;
    showMobileBG();
    this.navWrapperRef.current.classList.toggle('is-open');
  };

  render() {
    const {
      activeLanguage,
      brandNavigation,
      activeSection,
      headerFooter,
      label,
      location,
      region,
    } = this.props;

    return (
      <div className="header">
        <div className="contents">
          <Link to={createLink(location, '')}>
            <span className="logo">
              <img src={vLogo} width="50px" alt="Almex Group" className="vertical" />
              <img src={hLogo} width="225px" alt="Almex Group" className="horizontal" />
            </span>
          </Link>
          {activeSection !== '' && (
            <div className="active-section-mobile">{label.header[activeSection]}</div>
          )}
          <IconContext.Provider value={{ className: 'menu-icon' }}>
            <button
              type="button"
              className="mobile-menu"
              onClick={evt => this.handleMobileMenuClick(evt)}
            >
              <FaBars aria-hidden />
              <span className="sr-only">Open menu</span>
            </button>
          </IconContext.Provider>

          <div className="options-container">
            <div className="options">
              <div className="search">
                <input placeholder="e.g. rubber tank lining, etc..." />
                {/* {label.header.SEARCH} */}
                <IconContext.Provider value={{ className: 'search-icon' }}>
                  {/* <button type="button" className="mobile-menu"> */}
                  <FaSearch aria-hidden />
                  {/* </button> */}
                </IconContext.Provider>
              </div>
              <BrandSelector
                brandNavigation={brandNavigation}
                label={label.header.BRANDS}
                location={location}
              />
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
        <NavWrapper ref={this.navWrapperRef}>
          <Navigation
            activeLanguage={activeLanguage}
            label={label}
            location={location}
            region={region}
          />
        </NavWrapper>
      </div>
    );
  }
}

Header.defaultProps = {
  activeLanguage: '',
  activeSection: '',
  brandNavigation: {},
  headerFooter: {},
  label: {},
  location: {},
  region: '',
  showMobileBG: () => {},
};

Header.propTypes = {
  activeLanguage: PropTypes.string,
  activeSection: PropTypes.string,
  brandNavigation: PropTypes.shape({
    pages: PropTypes.array,
  }),
  headerFooter: PropTypes.shape({
    language: PropTypes.array,
    navigation: PropTypes.array,
    simpleTagline: PropTypes.string,
  }),
  label: PropTypes.shape({
    header: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  region: PropTypes.string,
  showMobileBG: PropTypes.func,
};

export const commonFragment = graphql`
  fragment CommonQuery on GraphCMS {
    brandNavigation(where: { availableIn: $region }) {
      pages {
        slug(locale: $locale)
        landing: landingSource {
          brand
          title(locale: $locale)
        }
      }
    }
    label(where: { availableIn: $region }) {
      header(locale: $locale)
      footer(locale: $locale)
      common(locale: $locale)
    }
    headerFooter(where: { availableIn: $region }) {
      companyAddress(locale: $locale)
      companyEmail
      companyPhone
      footerLinks(locale: $locale)
      formattedTagline(locale: $locale)
      language
      navigation(locale: $locale)
      simpleTagline(locale: $locale)
      socialMedia(locale: $locale)
    }
  }
`;

export default Header;
