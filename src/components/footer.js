import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link, StaticQuery } from 'gatsby';
import { IconContext } from 'react-icons';
import CookieConsent from 'react-cookie-consent';
import {
  FaPhone,
  FaEnvelope,
  FaLinkedinIn,
  // FaInstagram,
  FaYoutube,
  FaTwitter,
  FaFacebookF,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown/with-html';
import { createLink, fetch, hoursPassed, makeid } from '../utils/functions';
import { BRANDS, PAGE_TYPES } from '../constants';
import '../styles/footer.scss';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regionOffices: [],
    };
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const thisRegion = localStorage.getItem('almexVisitorRegion');
      if (!thisRegion) {
        this.getRegion();
      } else {
        const lastVisit =
          (localStorage.getItem('almexLastVisit') &&
            new Date(localStorage.getItem('almexLastVisit'))) ||
          null;
        const now = new Date();
        if (!lastVisit || (lastVisit && hoursPassed(lastVisit, now, 36))) {
          // either not set or 36 hours have passed, do another geolookup
          this.getRegion();
        } else {
          // less than 36 hours, refresh date and use region from localStorage
          localStorage.setItem('almexLastVisit', now.toString());
          this.getOffices(thisRegion);
        }
      }
    }
  }

  getOffices = region => {
    const regionOffices = [];
    const {
      data: { cms },
    } = this.props;
    cms.offices.forEach(office => {
      const theseCountries = office.countryCodes.countries;
      if (theseCountries.includes(region)) {
        regionOffices.push(office);
      }
      if (regionOffices.length > 1) {
        regionOffices.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    });
    this.setState({ regionOffices });
  };

  getRegion = () => {
    const nowString = new Date().toString();
    fetch('https://ipapi.co/json/', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(result => result.json())
      .then(json => {
        localStorage.setItem('almexVisitorRegion', json.country);
        localStorage.setItem('almexLastVisit', nowString);
        this.getOffices(json.country);
      })
      .catch(() => {
        localStorage.setItem('almexVisitorRegion', 'ALL');
        localStorage.setItem('almexLastVisit', nowString);
        this.getOffices('ALL');
      });
  };

  renderOffice = office => (
    <div className="office" key={makeid()}>
      <div className="name">
        <ReactMarkdown source={office.name} escapeHtml={false} />
      </div>
      <div className="address">
        <ReactMarkdown source={office.address} escapeHtml={false} />
      </div>
      <div className="phone">
        <IconContext.Provider value={{ className: 'contact-icon' }}>
          <FaPhone
            aria-hidden
            style={{ transform: 'scaleX(-1)', position: 'relative', top: '2px' }}
          />
        </IconContext.Provider>
        <a href={`tel:${office.telephone[0]}`} className="phone-link">
          {office.telephone[0]}
        </a>
      </div>
      <div className="email">
        <IconContext.Provider value={{ className: 'contact-icon' }}>
          <FaEnvelope aria-hidden style={{ position: 'relative', top: '2px' }} />
        </IconContext.Provider>
        <a href={`mailto:${office.email[0]}`} className="email-link">
          {/* {office.email[0]} */}
          {office.contactPerson}
        </a>
      </div>
    </div>
  );

  renderTollFree = office => {
    if (office.tollFree.length > 0) {
      return (
        <div className="support" key={makeid()}>
          <IconContext.Provider value={{ className: 'contact-icon' }}>
            <FaPhone
              aria-hidden
              style={{ transform: 'scaleX(-1)', position: 'relative', top: '2px' }}
            />
          </IconContext.Provider>
          {office.tollFree}
          <br />
        </div>
      );
    }
    return null;
  };

  renderBrands = (brand, location) => {
    let brandType = '';
    let productBrand = '';
    switch (brand.pageType) {
      case PAGE_TYPES.INSTITUTE:
        brandType = brand.institute;
        break;
      case PAGE_TYPES.LANDING:
        brandType = brand.landing;
        break;
      case PAGE_TYPES.SERVICES:
        brandType = brand.services;
        break;
      default:
        break;
    }
    switch (brandType.brand) {
      case BRANDS.ALMEX_IN_A_BOX:
        productBrand = 'almex-box';
        break;
      case BRANDS.BAT:
        productBrand = 'bat';
        break;
      case BRANDS.LIGHTWEIGHT:
        productBrand = 'lightweight';
        break;
      case BRANDS.CMI:
        productBrand = 'cmi';
        break;
      case BRANDS.EMSYS:
        productBrand = 'emsys';
        break;
      case BRANDS.FUSION:
        productBrand = 'fusion';
        break;
      case BRANDS.ALMEX_INSTITUTE:
        productBrand = 'institute';
        break;
      case BRANDS.GLOBAL_SERVICES:
        productBrand = 'knight';
        break;
      case BRANDS.VOTECH:
        productBrand = 'votech';
        break;
      default:
        break;
    }
    return (
      <div className={`brand ${productBrand}`} key={brand.slug}>
        <Link to={createLink(location, brand.slug)}>
          <span className="sr-only">{brandType.title}</span>
        </Link>
      </div>
    );
  };

  render() {
    const { brandNavigation, headerFooter, label, location } = this.props;
    /* static companyAddress, etc. will be used later once all regional sites have rolled out */
    // const { companyAddress, companyEmail, companyPhone, footerLinks, socialMedia } = headerFooter;
    const { regionOffices } = this.state;
    const { footerLinks, socialMedia } = headerFooter;
    const { footer } = label;
    const brands = brandNavigation.pages;
    brands.sort((a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1));
    return (
      <>
        <CookieConsent
          enableDeclineButton
          onDecline={() => {
            window.gaOptout();
          }}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          buttonText={label.footer.CONSENT_ACCEPT}
          declineButtonText={label.footer.CONSENT_DECLINE}
        >
          {`${label.footer.CONSENT_TEXT} `}
          <Link to={createLink(location, headerFooter.privacyPage.slug)}>
            {label.footer.CONSENT_LINK_TEXT}
          </Link>
        </CookieConsent>
        <div className="footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="top-left">
                {/* <div className="address">
                  <ReactMarkdown source={companyAddress} escapeHtml={false} />
                </div>
                <div className="phone">
                  <IconContext.Provider value={{ className: 'contact-icon' }}>
                    <FaPhone
                      aria-hidden
                      style={{ transform: 'scaleX(-1)', position: 'relative', top: '2px' }}
                    />
                  </IconContext.Provider>
                  <a href={`tel:${companyPhone}`} className="phone-link">
                    {companyPhone}
                  </a>
                </div>
                <div className="email">
                  <IconContext.Provider value={{ className: 'contact-icon' }}>
                    <FaEnvelope aria-hidden style={{ position: 'relative', top: '2px' }} />
                  </IconContext.Provider>
                  <a href="mailto:info@almex.com" className="email-link">
                    {companyEmail}
                  </a>
                </div> */}
                {regionOffices.map(office => this.renderOffice(office))}
              </div>
              <div className="top-center" />
              <div className="top-right">
                <div className="social">
                  <a href={socialMedia.LINKEDIN} className="social-media-link">
                    <IconContext.Provider value={{ className: 'social-media-icon' }}>
                      <FaLinkedinIn aria-hidden />
                    </IconContext.Provider>
                  </a>
                  {/* <a href={socialMedia.INSTAGRAM} className="social-media-link">
                    <IconContext.Provider value={{ className: 'social-media-icon' }}>
                      <FaInstagram aria-hidden />
                    </IconContext.Provider>
                  </a> */}
                  <a href={socialMedia.YOUTUBE} className="social-media-link">
                    <IconContext.Provider value={{ className: 'social-media-icon' }}>
                      <FaYoutube aria-hidden />
                    </IconContext.Provider>
                  </a>
                  <a href={socialMedia.TWITTER} className="social-media-link">
                    <IconContext.Provider value={{ className: 'social-media-icon' }}>
                      <FaTwitter aria-hidden />
                    </IconContext.Provider>
                  </a>
                  <a href={socialMedia.FACEBOOK} className="social-media-link">
                    <IconContext.Provider value={{ className: '' }}>
                      <FaFacebookF aria-hidden />
                    </IconContext.Provider>
                  </a>
                </div>
                {regionOffices.map(office => this.renderTollFree(office))}
              </div>
            </div>
            <div className="footer-middle">
              <div className="brands">
                {brands.map(brand => this.renderBrands(brand, location))}
              </div>
            </div>
            <div className="footer-bottom">
              <div className="bottom-left">{footer.COPYRIGHT}</div>
              <div className="bottom-center">
                <Link to={createLink(location, footerLinks.ABOUT.PATH)} className="footer-link">
                  {footerLinks.ABOUT.LABEL}
                </Link>
                <Link to={createLink(location, footerLinks.CONTACT.PATH)} className="footer-link">
                  {footerLinks.CONTACT.LABEL}
                </Link>
                <Link to={createLink(location, footerLinks.PRIVACY.PATH)} className="footer-link">
                  {footerLinks.PRIVACY.LABEL}
                </Link>
                <Link to={createLink(location, footerLinks.CAREERS.PATH)} className="footer-link">
                  {footerLinks.CAREERS.LABEL}
                </Link>
              </div>
              <div className="bottom-right">{footer.RIGHTS}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Footer.defaultProps = {
  brandNavigation: {},
  data: {},
  headerFooter: {},
  label: {},
  location: {},
};

Footer.propTypes = {
  brandNavigation: PropTypes.shape({
    pages: PropTypes.array,
  }),
  data: PropTypes.shape({
    cms: PropTypes.shape({
      offices: PropTypes.array,
    }),
  }),
  headerFooter: PropTypes.shape({
    companyAddress: PropTypes.string,
    companyEmail: PropTypes.string,
    companyPhone: PropTypes.string,
    footerLinks: PropTypes.object,
    privacyPage: PropTypes.object,
    socialMedia: PropTypes.object,
  }),
  label: PropTypes.shape({
    footer: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
        cms {
          offices {
            name
            address
            telephone
            tollFree
            email
            contactPerson
            countryCodes
          }
        }
      }
    `}
    render={data => <Footer {...props} data={data} />}
  />
);
