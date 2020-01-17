import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link, navigate } from 'gatsby';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import BrandSelector from './brandSelector';
// import LanguageSelector from './languageSelector';
import Navigation from './navigation';
import NavWrapper from './navWrapper';
import { createLink } from '../utils/functions';
import '../styles/header.scss';
import '../styles/headerOptions.scss';
import hLogo from '../../static/img/logo-almex-hori.svg';
import vLogo from '../../static/img/logo-almex-vert.svg';
import plane from '../../static/img/airliner.svg';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    this.navWrapperRef = React.createRef();
  }

  handleMobileMenuClick = evt => {
    evt.preventDefault();
    const { showMobileBG } = this.props;
    showMobileBG();
    this.navWrapperRef.current.classList.toggle('is-open');
  };

  handleInput = evt => {
    const { target } = evt;
    this.setState({
      [target.name]: target.value,
    });
  };

  handleKeyPress = evt => {
    const { location } = this.props;
    const { search } = this.state;
    const charCode = typeof evt.which === 'number' ? evt.which : evt.keyCode;
    if (charCode === 13 && search.trim() !== '') {
      navigate(
        `${createLink(location, 'search')}?query=${encodeURIComponent(search.trim())}&page=1`,
      );
    }
  };

  handleSearchClick = evt => {
    evt.preventDefault();
    const { location } = this.props;
    const { search } = this.state;
    if (search.trim() !== '') {
      navigate(
        `${createLink(location, 'search')}?query=${encodeURIComponent(search.trim())}&page=1`,
      );
    }
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
    const { search } = this.state;

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
              <div className="search">
                <input
                  type="text"
                  name="search"
                  onChange={evt => this.handleInput(evt)}
                  onKeyPress={evt => this.handleKeyPress(evt)}
                  value={search}
                  placeholder="e.g. rubber tank lining, etc..."
                />
                {/* {label.header.SEARCH} */}
                {/* <button type="button" className="mobile-menu"></button> */}
                <button
                  type="button"
                  className="button"
                  onClick={evt => this.handleSearchClick(evt)}
                >
                  <IconContext.Provider value={{ className: 'search-icon' }}>
                    <FaSearch aria-hidden />
                  </IconContext.Provider>
                </button>
              </div>
              <div className="fusion-club">
                <a href="https://fusionclubpoints.com">
                  <img src={plane} width="30" alt="Visit Fusion Club" />
                </a>
              </div>
              <BrandSelector brandNavigation={brandNavigation} label={label} location={location} />
              {/* TODO Re-activate when Spanish becomes available */}
              {/* <LanguageSelector
                activeLanguage={activeLanguage}
                languages={headerFooter.language}
                region={region}
              /> */}
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
      pages(where: { status: PUBLISHED }) {
        landing: landingSource {
          brand
          title(locale: $locale)
        }
        institute: instituteSource {
          brand
          title(locale: $locale)
        }
        services: servicesSource {
          brand
          title(locale: $locale)
        }
        pageType
        slug(locale: $locale)
        title(locale: $locale)
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
        pages(where: { status: PUBLISHED }) {
          id
          pageType
          slug: slug(locale: $locale)
          about: aboutSource {
            title(locale: $locale)
          }
          careers: careersSource {
            title(locale: $locale)
          }
          contact: contactSource {
            title(locale: $locale)
          }
          downloads: downloadsSource {
            title(locale: $locale)
          }
          events: eventsSource {
            title(locale: $locale)
          }
          history: historySource {
            title(locale: $locale)
          }
          institute: instituteSource {
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
          resources: resourcesSource {
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
        isLandingPage
        sortOrder(locale: $locale)
        title(locale: $locale)
        type
      }
      sortOrder
    }
  }
`;

export default Header;
