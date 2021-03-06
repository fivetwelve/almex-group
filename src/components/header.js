import React from 'react';
import PropTypes from 'prop-types';
import { Link, navigate } from 'gatsby';
import { navigate as reload } from '@reach/router';
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
      reload(`${createLink(location, 'search')}?query=${encodeURIComponent(search.trim())}&page=1`);
    }
  };

  handleSearchClick = evt => {
    evt.preventDefault();
    const { location } = this.props;
    const { search } = this.state;
    if (search.trim() !== '') {
      navigate(
        `${createLink(location, 'search')}?query=${encodeURIComponent(search.trim())}&page=1`,
        { replace: true },
      );
    }
  };

  render() {
    const {
      activeLanguage,
      brandNavigation,
      headerFooter,
      label,
      languages,
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
                {/* {label.header.SEARCH}
                <button type="button" className="mobile-menu"></button> */}
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
              {headerFooter.fusionClub && (
                <div className="fusion-club">
                  <a href="https://fusionclubpoints.com">
                    <div className="text-top">FUSION</div>
                    <img
                      src={plane}
                      width="30"
                      alt="Fusion Club"
                      className="logo"
                      aria-hidden="true"
                    />
                    <div className="text-bottom">CLUB</div>
                  </a>
                </div>
              )}
              <BrandSelector brandNavigation={brandNavigation} label={label} location={location} />
              {languages.length > 1 && (
                <LanguageSelector
                  activeLanguage={activeLanguage}
                  languages={languages}
                  region={region}
                />
              )}
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
        <div className="mobile-search-container">
          <div className="mobile-search">
            <input
              type="text"
              name="search"
              onChange={evt => this.handleInput(evt)}
              onKeyPress={evt => this.handleKeyPress(evt)}
              value={search}
              placeholder="e.g. rubber tank lining, etc..."
            />
            <button type="button" className="button" onClick={evt => this.handleSearchClick(evt)}>
              <IconContext.Provider value={{ className: 'search-icon' }}>
                <FaSearch aria-hidden />
              </IconContext.Provider>
            </button>
          </div>
        </div>
        <NavWrapper ref={this.navWrapperRef}>
          <Navigation
            activeLanguage={activeLanguage}
            brandNavigation={brandNavigation}
            handleCloseMenuClick={this.handleMobileMenuClick}
            label={label}
            languages={languages}
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
  // data: {},
  headerFooter: {},
  label: {},
  languages: [],
  location: {},
  navigation: {},
  region: '',
  showMobileBG: () => {},
};

Header.propTypes = {
  activeLanguage: PropTypes.string,
  brandNavigation: PropTypes.shape({
    pages: PropTypes.instanceOf(Array),
  }),
  // data: PropTypes.shape({
  //   cms: PropTypes.instanceOf(Object),
  // }),
  headerFooter: PropTypes.shape({
    fusionClub: PropTypes.bool,
    // language: PropTypes.instanceOf(Array),
    navigation: PropTypes.instanceOf(Array),
    simpleTagline: PropTypes.string,
  }),
  label: PropTypes.shape({
    header: PropTypes.instanceOf(Object),
  }),
  languages: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  navigation: PropTypes.shape({
    navigationSections: PropTypes.instanceOf(Array),
  }),
  region: PropTypes.string,
  showMobileBG: PropTypes.func,
};

// export const commonFragment = graphql`
//   fragment CommonQuery on GraphCMS {
//     siteRegions {
//       region
//       languages
//     }
//   }
// `;

export default Header;
