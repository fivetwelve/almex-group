import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaBars } from 'react-icons/fa';
import BrandSelector from './brandSelector';
import LanguageSelector from './languageSelector';
import Navigation from './navigation';
import NavWrapper from './navWrapper';
import { createLink } from '../utils/functions';
import '../styles/header.scss';
import '../styles/headerOptions.scss';
import hLogo from '../../static/img/logo-almex-hori.svg';
import vLogo from '../../static/img/logo-almex-vert.svg';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.myRef = {};
    // const { headerFooter } = this.props;
    // const nav = headerFooter.navigation;
    // for (let i = 0; i < nav.length; i += 1) {
    //   const navType = nav[i].TYPE;
    //   this.myRef[navType] = React.createRef();
    // }
    this.navWrapperRef = React.createRef();
  }

  componentDidUpdate() {
    // console.log(this.myRef);
  }

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
      headerFooter,
      label,
      location,
      navigation,
      region,
    } = this.props;

    return (
      <div className="header">
        <div className="contents">
          <Link to={createLink(location, '')}>
            <span className="logo">
              <img src={vLogo} width="50" alt="Almex Group" className="vertical" />
              <img src={hLogo} width="225" alt="Almex Group" className="horizontal" />
            </span>
          </Link>
          <div className="options-container">
            <div className="options">
              {/* <div className="search">
                <input placeholder="e.g. rubber tank lining, etc..." />
                {
                  // {label.header.SEARCH}
                }
                <IconContext.Provider value={{ className: 'search-icon' }}>
                  {
                    // <button type="button" className="mobile-menu">
                  }
                  <FaSearch aria-hidden />
                  {
                    // </button>
                  }
                </IconContext.Provider>
              </div> */}
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
              {/* <div className="login">{label.header.LOGIN}</div> */}
            </div>
            <div className="tagline-container">
              <span className="tagline">{headerFooter.simpleTagline}</span>
            </div>
          </div>
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
        </div>
        <NavWrapper ref={this.navWrapperRef}>
          <Navigation
            activeLanguage={activeLanguage}
            brandNavigation={brandNavigation}
            handleCloseMenuClick={this.handleMobileMenuClick}
            label={label}
            languages={headerFooter.language}
            location={location}
            navigation={navigation}
            region={region}
          />
        </NavWrapper>
      </div>
    );
  }
}

Header.defaultProps = {
  activeLanguage: '',
  brandNavigation: {},
  headerFooter: {},
  label: {},
  location: {},
  navigation: {},
  region: '',
  showMobileBG: () => {},
};

Header.propTypes = {
  activeLanguage: PropTypes.string,
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
  navigation: PropTypes.shape({
    navigationSections: PropTypes.array,
  }),
  region: PropTypes.string,
  showMobileBG: PropTypes.func,
};

export const commonFragment = graphql`
  fragment CommonQuery on GraphCMS {
    brandNavigation(where: { availableIn: $region }) {
      pages {
        landing: landingSource {
          brand
          title(locale: $locale)
        }
        services: servicesSource {
          brand
          title(locale: $locale)
        }
        pageType
        slug(locale: $locale)
      }
      title(locale: $locale)
      type
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
    navigation(where: { availableIn: $region }) {
      navigationSections {
        pages {
          id
          pageType
          slug: slug(locale: $locale)
          about: aboutSource {
            title(locale: $locale)
          }
          article: articleSource {
            title(locale: $locale)
          }
          careers: careersSource {
            title(locale: $locale)
          }
          contact: contactSource {
            title(locale: $locale)
          }
          events: eventsSource {
            title(locale: $locale)
          }
          history: historySource {
            title(locale: $locale)
          }
          industry: industrySource {
            title(locale: $locale)
          }
          landing: landingSource {
            brand
            title(locale: $locale)
          }
          news: newsSource {
            title(locale: $locale)
          }
          product: productSource {
            title(locale: $locale)
          }
          promo: promoSource {
            title(locale: $locale)
          }
          services: servicesSource {
            brand
            title(locale: $locale)
          }
          usedEquipment: usedEquipmentSource {
            title(locale: $locale)
          }
        }
        title(locale: $locale)
        type
      }
    }
  }
`;

export default Header;
