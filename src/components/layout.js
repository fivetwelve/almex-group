import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Waypoint } from 'react-waypoint';
import { Location } from '@reach/router';
import { IconContext } from 'react-icons';
import { FaAngleUp } from 'react-icons/fa';
import { window } from 'browser-monads';
import Header from './header';
import Footer from './footer';
import { LocationProvider } from '../utils/locationContext';
import { scrollTo } from '../utils/functions';
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

  // componentDidMount() {
  //   document.body.addEventListener('keyup', function(e) {
  //     if (e.which === 9) /* tab */ {
  //       document.documentElement.classList.remove('no-focus-outline');
  //     }
  //   });
  // }

  componentDidMount() {
    // document.body.classList.add('no-focus-outline');
    // root.addEventListener('click', this.handleKeyUp);
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

  handleKeyUp = () => {
    // evt.preventDefault();
    /* check for Tab */
    // log.info(`target: ${evt.which}`);
    // log.info('clicked!');
    // if (evt.which === 9) {
    //   this.bodyRef.current.classList.remove('no-focus-outline');
    // }
    // console.log(`target: ${evt.target}`);
  };

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
      brandNavigation,
      children,
      childrenClass,
      headerFooter,
      label,
      navigation,
      region,
      title,
    } = this.props;
    const { scrollToTopEnabled } = this.state;
    const lang = activeLanguage.toLowerCase();

    return (
      <>
        <Helmet defaultTitle={title} titleTemplate={`Almex Group | ${title}`}>
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
          <meta property="og:url" content="http://almex.com" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content={activeLanguage} />
          <meta
            property="og:title"
            content="Conveyor Belt Vulcanizers | Vulcanizing Equipment | Almex"
          />
          <meta
            property="og:description"
            content="Almex provides conveyer belt vulcanizer products, tools and services required to maintain peak levels of operating efficiency. Learn about the global leader."
          />
          {/* <meta property="og:image" content={`${siteUrl}${gatsbyIcon}`} />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" /> */}
          {/* <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content={twitter} /> */}
          {/* <script
            type="text/javascript"
            src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          /> */}
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js" />
          <body
            className="no-focus-outline"
            ref={this.bodyRef}
            // onKeyUp={evt => {
            //   this.checkForTabbing(evt);
            // }}
            role="presentation"
          />
        </Helmet>
        <div
          className="siteContainer"
          ref={this.siteContainer}
          // onKeyUp={evt => log.info(evt.target)}
          role="presentation"
        >
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
              {/* <a href="http://google.com"> */}
              {/* <span aria-hidden="true"> */}
              <IconContext.Provider value={{ className: 'icon' }}>
                <FaAngleUp aria-hidden />
              </IconContext.Provider>
              {/* </span> */}
              {/* </a> */}
            </div>
            <Location>
              {({ location }) => (
                <>
                  <div className="mobile-menu-bg" ref={this.mobileMenuBg} />
                  <div className="mobile-shroud" ref={this.mobileShroud} />
                  <Header
                    activeLanguage={activeLanguage}
                    brandNavigation={brandNavigation}
                    headerFooter={headerFooter}
                    label={label}
                    navigation={navigation}
                    region={region}
                    location={location}
                    showMobileBG={this.showMobileBG}
                  />
                  <div className="bodyClass">
                    <LocationProvider value={location}>
                      <div className={childrenClass}>{children}</div>
                    </LocationProvider>
                  </div>
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
              )}
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
  brandNavigation: {},
  headerFooter: {},
  label: {},
  navigation: {},
  region: '',
  title: '',
};

Layout.propTypes = {
  activeLanguage: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  childrenClass: PropTypes.string,
  brandNavigation: PropTypes.shape({
    pages: PropTypes.array,
  }),
  headerFooter: PropTypes.shape({
    companyAddress: PropTypes.string,
    companyEmail: PropTypes.string,
    companyPhone: PropTypes.string,
    footerLinks: PropTypes.object,
    socialMedia: PropTypes.object,
  }),
  label: PropTypes.shape({
    header: PropTypes.object,
    footer: PropTypes.object,
  }),
  navigation: PropTypes.shape({
    navigationSections: PropTypes.array,
  }),
  region: PropTypes.string,
  title: PropTypes.string,
};

export default Layout;
