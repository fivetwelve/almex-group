import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Location } from '@reach/router';
// import * as log from 'loglevel';
import Header from './header';
import Footer from './footer';
import { LocationProvider } from '../utils/locationContext';
import '../styles/layout.scss';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.bodyElement = React.createRef();
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
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  handleKeyUp = () => {
    // evt.preventDefault();
    /* check for Tab */
    // log.info(`target: ${evt.which}`);
    // log.info('clicked!');
    // if (evt.which === 9) {
    //   this.bodyElement.current.classList.remove('no-focus-outline');
    // }
    // console.log(`target: ${evt.target}`);
  };

  render() {
    const {
      activeLanguage,
      activeSection,
      brandNavigation,
      children,
      childrenClass,
      headerFooter,
      label,
      region,
      title,
    } = this.props;
    const lang = activeLanguage.toLowerCase();
    return (
      <>
        <Helmet defaultTitle={title} titleTemplate={`Almex Group | ${title}`}>
          <html lang={lang} />
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
            ref={this.bodyElement}
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
          <div className="pageContainer">
            <Location>
              {({ location }) => (
                <>
                  <Header
                    activeSection={activeSection}
                    activeLanguage={activeLanguage}
                    brandNavigation={brandNavigation}
                    headerFooter={headerFooter}
                    label={label}
                    region={region}
                    location={location}
                  />
                  <div className="bodyClass">
                    <LocationProvider value={location}>
                      <div className={childrenClass}>{children}</div>
                    </LocationProvider>
                  </div>
                  <Footer
                    // activeLanguage={activeLanguage}
                    locale={activeLanguage}
                    headerFooter={headerFooter}
                    label={label}
                    lang={lang}
                    // location={location}
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
  activeSection: '',
  children: {},
  childrenClass: '',
  brandNavigation: {},
  headerFooter: {},
  label: {},
  region: '',
  title: '',
};

Layout.propTypes = {
  activeLanguage: PropTypes.string,
  activeSection: PropTypes.string,
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
  region: PropTypes.string,
  title: PropTypes.string,
};

export default Layout;
