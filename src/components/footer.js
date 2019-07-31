import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { IconContext } from 'react-icons';
import {
  FaPhone,
  FaEnvelope,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaFacebookF,
} from 'react-icons/fa';
import Markdown from 'react-remarkable';
import { createLink, makeid } from '../utils/functions';
import { BRANDS, PAGE_TYPES } from '../constants';
import '../styles/footer.scss';

const Footer = ({ brandNavigation, headerFooter, label, location }) => {
  /* static companyAddress, etc. will be used later once all regional sites have rolled out */
  // const { companyAddress, companyEmail, companyPhone, footerLinks, socialMedia } = headerFooter;
  const { footerLinks, socialMedia } = headerFooter;
  const { footer } = label;
  const brands = brandNavigation.pages;
  const regionOffices = [];
  let visitorRegion = null;
  const { cms } = useStaticQuery(
    graphql`
      query SiteMetaData {
        cms {
          offices {
            name
            address
            telephone
            email
            countryCodes
          }
        }
      }
    `,
  );

  const getOffices = () => {
    cms.offices.forEach(office => {
      const theseCountries = office.countryCodes.countries;
      if (theseCountries.includes(visitorRegion)) {
        regionOffices.push(office);
      }
      if (regionOffices.length > 1) {
        regionOffices.sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    });
  };

  const getRegion = async () => {
    fetch('https://ipapi.co/json/', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(result => result.json())
      .then(json => {
        localStorage.setItem('almexVisitorRegion', json.country);
        visitorRegion = json.country;
        getOffices();
      })
      .catch(() => {
        localStorage.setItem('almexVisitorRegion', 'ALL');
        visitorRegion = 'ALL';
        getOffices();
      });
  };

  const renderOffice = office => (
    <div className="office" key={makeid()}>
      <div className="name">
        <Markdown source={office.name} options={{ html: true }} />
      </div>
      <div className="address">
        <Markdown source={office.address} options={{ html: true }} />
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
          {office.email[0]}
        </a>
      </div>
    </div>
  );

  if (typeof window !== 'undefined') {
    visitorRegion = localStorage.getItem('almexVisitorRegion');
    if (!visitorRegion) {
      getRegion();
    } else {
      getOffices();
    }
  }

  return (
    <>
      <div className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="top-left">
              {/* <div className="address">
                <Markdown source={companyAddress} options={{ html: true }} />
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
              {regionOffices.map(office => renderOffice(office))}
            </div>
            <div className="top-center" />
            <div className="top-right">
              <div className="social">
                <a href={socialMedia.LINKEDIN} className="social-media-link">
                  <IconContext.Provider value={{ className: 'social-media-icon' }}>
                    <FaLinkedinIn aria-hidden />
                  </IconContext.Provider>
                </a>
                <a href={socialMedia.INSTAGRAM} className="social-media-link">
                  <IconContext.Provider value={{ className: 'social-media-icon' }}>
                    <FaInstagram aria-hidden />
                  </IconContext.Provider>
                </a>
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
              <div className="support">
                <IconContext.Provider value={{ className: 'contact-icon' }}>
                  <FaPhone
                    aria-hidden
                    style={{ transform: 'scaleX(-1)', position: 'relative', top: '2px' }}
                  />
                </IconContext.Provider>
                1.800.xxx.xxx
                <br />
              </div>
              <div className="chat">
                Or <a href="/northamerica/en">Chat Now</a>
              </div>
            </div>
          </div>
          <div className="footer-middle">
            <div className="brands">
              {brands.map(brand => {
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
                  case BRANDS.RAMPART:
                    productBrand = 'rampart';
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
              })}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="bottom-left">{footer.COPYRIGHT}</div>
            <div className="bottom-center">
              <Link to="/northamerica/en/about" className="footer-link">
                {footerLinks.ABOUT.LABEL}
              </Link>
              <Link to="/northamerica/en/about" className="footer-link">
                {footerLinks.CONTACT.LABEL}
              </Link>
              <Link to="/northamerica/en/about" className="footer-link">
                {footerLinks.PRIVACY.LABEL}
              </Link>
              <Link to="/northamerica/en/about" className="footer-link">
                {footerLinks.CAREERS.LABEL}
              </Link>
            </div>
            <div className="bottom-right">{footer.RIGHTS}</div>
          </div>
        </div>
      </div>
    </>
  );
};

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
      offices: PropTypes.object,
    }),
  }),
  headerFooter: PropTypes.shape({
    companyAddress: PropTypes.string,
    companyEmail: PropTypes.string,
    companyPhone: PropTypes.string,
    footerLinks: PropTypes.object,
    socialMedia: PropTypes.object,
  }),
  label: PropTypes.shape({
    footer: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default Footer;
