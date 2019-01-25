import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from './header';
import Footer from './footer';
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

  // componentDidMount() {
  //   document.body.classList.add('no-focus-outline');
  // }

  shouldComponentUpdate() {
    return false;
  }

  checkForTabbing = evt => {
    // evt.preventDefault();
    /* tab */
    if (evt.which === 9) {
      this.bodyElement.current.classList.remove('no-focus-outline');
    }
  };

  render() {
    const { activeLanguage, activeSection, children, childrenClass, region, title } = this.props;
    const lang = activeLanguage.toLowerCase();
    return (
      <React.Fragment>
        <Helmet defaultTitle={title} titleTemplate={`Almex Group | ${title}`}>
          <html lang={lang} className="no-focus-outline" />
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
          {/* <meta property="og:url" content={siteUrl} />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en" />
          <meta property="og:site_name" content={title} />
          <meta property="og:image" content={`${siteUrl}${gatsbyIcon}`} />
          <meta property="og:image:width" content="512" />
          <meta property="og:image:height" content="512" /> */}
          {/* <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content={twitter} /> */}
          <script
            type="text/javascript"
            src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          />
          <body
            className="no-focus-outline"
            ref={this.bodyElement}
            onKeyUp={evt => {
              this.checkForTabbing(evt);
            }}
            role="presentation"
          />
        </Helmet>
        <div className="siteContainer" ref={this.siteContainer}>
          <div className="pageContainer">
            <Header activeSection={activeSection} activeLanguage={activeLanguage} region={region} />
            <div className="bodyClass">
              <div className={childrenClass}>{children}</div>
            </div>
            <Footer />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Layout.defaultProps = {
  activeLanguage: '',
  activeSection: '',
  children: {},
  childrenClass: '',
  region: '',
  title: '',
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  activeLanguage: PropTypes.string,
  activeSection: PropTypes.string,
  childrenClass: PropTypes.string,
  region: PropTypes.string,
  title: PropTypes.string,
};

export default Layout;
