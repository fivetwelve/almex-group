import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Waypoint } from 'react-waypoint';
import { Location } from '@reach/router';
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav';
import { IconContext } from 'react-icons';
import { FaAngleUp } from 'react-icons/fa';
import Header from './header';
import Footer from './footer';
// import { LocationProvider } from '../utils/locationContext';
import { scrollTo } from '../utils/functions';
import '@reach/skip-nav/styles.css';
import '../styles/layout.scss';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.htmlRef = React.createRef();
    this.bodyRef = React.createRef();
    this.pageRef = React.createRef();
    this.waypoint = React.createRef();
    this.scrollToTopButton = React.createRef();
    this.mobileMenuBg = React.createRef();
    this.mobileShroud = React.createRef();
    this.state = {
      scrollToTopEnabled: false,
    };
  }

  componentDidMount() {
    let posY = 0;
    if (window.innerHeight) {
      const windowHeight = window.innerHeight;
      const pageHeight = this.pageRef.current.getBoundingClientRect().height;
      /* Enable scroll to top only if page is at least twice the window height */
      if (pageHeight > 2 * windowHeight) {
        this.setState({
          scrollToTopEnabled: true,
        });
        /* set waypoint to be 20% away from bottom of 2nd page */
        posY = Math.round(windowHeight * 1.8);
      }
      this.waypoint.current.style.top = `${posY}px`;
    }
  }

  showMobileBG = () => {
    this.mobileMenuBg.current.classList.toggle('is-open');
    this.mobileShroud.current.classList.toggle('is-open');
  };

  toggleScrollToTop = props => {
    const { currentPosition, previousPosition } = props;
    if (currentPosition === 'inside' && previousPosition === 'below') {
      this.scrollToTopButton.current.classList.add('in-view');
    }
    if (currentPosition === 'below' && previousPosition === 'inside') {
      this.scrollToTopButton.current.classList.remove('in-view');
    }
    if (currentPosition === 'inside' && previousPosition === undefined) {
      this.scrollToTopButton.current.classList.add('in-view');
    }
  };

  scrollToTop = evt => {
    evt.preventDefault();
    scrollTo(0);
  };

  render() {
    const {
      activeLanguage,
      children,
      childrenClass,
      languages,
      localeData,
      region,
      title,
    } = this.props;
    const { brandNavigation, headerFooter, label, navigation } = localeData;
    const { scrollToTopEnabled } = this.state;
    const lang = activeLanguage.toLowerCase();
    return (
      <>
        <Helmet defaultTitle="Almex Group" titleTemplate="Almex Group | %s">
          <html lang={lang} ref={this.htmlRef} />
          {/* <link rel="canonical" href={`${siteUrl}${pathname}`} /> */}
          <meta name="docsearch:version" content="2.0" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,shrink-to-fit=no,viewport-fit=cover"
          />
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <title>{title}</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:url" content="https://www.almex.com" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content={activeLanguage} />
          <meta property="og:title" content={(label && label.common.META_TITLE) || ''} />
          <meta
            property="og:description"
            content={(label && label.common.META_DESCRIPTION) || ''}
          />
          {/* <meta property="og:image" content={`${siteUrl}${gatsbyIcon}`} />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" /> */}
          {/* <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content={twitter} /> */}
          <script src="https://cdn.polyfill.io/v3/polyfill.min.js?flags=gated" />
          <script src="https://www.youtube.com/iframe_api" />

          <body className="no-focus-outline" ref={this.bodyRef} role="presentation" />
        </Helmet>
        <div className="siteContainer" ref={this.siteContainer} role="presentation">
          <div className="pageContainer" ref={this.pageRef} id="top">
            <div className="waypoint-container" ref={this.waypoint}>
              {scrollToTopEnabled && (
                <Waypoint
                  // debug
                  scrollableAncestor={window}
                  onEnter={this.toggleScrollToTop}
                  onLeave={this.toggleScrollToTop}
                  topOffset="0px"
                />
              )}
            </div>
            <div
              aria-hidden="true"
              className="scroll-to-top"
              ref={this.scrollToTopButton}
              onClick={evt => this.scrollToTop(evt)}
            >
              <IconContext.Provider value={{ className: 'icon' }}>
                <FaAngleUp aria-hidden />
              </IconContext.Provider>
            </div>
            <Location>
              {props => {
                const { location } = props;
                return (
                  <>
                    <div className="mobile-menu-bg" ref={this.mobileMenuBg} />
                    <div className="mobile-shroud" ref={this.mobileShroud} />
                    <SkipNavLink>{label.common.SKIP_MAIN}</SkipNavLink>
                    <Header
                      activeLanguage={activeLanguage}
                      brandNavigation={brandNavigation}
                      headerFooter={headerFooter}
                      label={label}
                      languages={languages}
                      navigation={navigation}
                      region={region}
                      location={location}
                      showMobileBG={this.showMobileBG}
                    />
                    <SkipNavContent />
                    <main>
                      <div className="bodyClass">
                        {/* TODO address visitorRegion or remove if not needed */}
                        {/* <LocationProvider value={location} visitorRegion="test"> */}
                        <div className={childrenClass}>{children}</div>
                        {/* </LocationProvider> */}
                      </div>
                    </main>
                    <Footer
                      brandNavigation={brandNavigation}
                      headerFooter={headerFooter}
                      label={label}
                      lang={lang}
                      locale={activeLanguage}
                      location={location}
                      region={region}
                    />
                  </>
                );
              }}
            </Location>
          </div>
        </div>
      </>
    );
  }
}

Layout.defaultProps = {
  activeLanguage: '',
  children: {},
  childrenClass: '',
  languages: [],
  localeData: {
    label: {
      common: {
        META_DESCRIPTION: '',
        META_TITLE: '',
        SKIP_MAIN: '',
      },
    },
  },
  region: '',
  title: '',
};

Layout.propTypes = {
  activeLanguage: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  childrenClass: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  localeData: PropTypes.shape({
    brandNavigation: PropTypes.instanceOf(Object),
    headerFooter: PropTypes.instanceOf(Object),
    label: PropTypes.instanceOf(Object),
    language: PropTypes.string,
    navigation: PropTypes.instanceOf(Object),
    region: PropTypes.string,
  }),
  region: PropTypes.string,
  title: PropTypes.string,
};

export default Layout;
