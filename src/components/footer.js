import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
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
// import headerFooterQuery from '../utils/queries';
import { createLink } from '../utils/functions';
import { allBrands, allPageTypes } from '../constants';
import '../styles/footer.scss';

const Footer = ({ brandNavigation, headerFooter, label, location }) => {
  const { companyAddress, companyEmail, companyPhone, footerLinks, socialMedia } = headerFooter;
  const { footer } = label;
  const brands = brandNavigation.pages;
  // console.log(brandNavigation.pages[0]);

  return (
    <>
      <div className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="top-left">
              <div className="address">
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
              </div>
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
                let productBrand = '';
                const brandType =
                  brand.pageType === allPageTypes.LANDING ? brand.landing : brand.services;
                switch (brandType.brand) {
                  case allBrands.ALMEX_IN_A_BOX:
                    productBrand = 'almex-box';
                    break;
                  case allBrands.BAT:
                    productBrand = 'bat';
                    break;
                  case allBrands.EMSYS:
                    productBrand = 'emsys';
                    break;
                  case allBrands.FUSION:
                    productBrand = 'fusion';
                    break;
                  case allBrands.VOTECH:
                    productBrand = 'votech';
                    break;
                  case allBrands.ALMEX_INSTITUTE:
                    productBrand = 'institute';
                    break;
                  case allBrands.GLOBAL_SERVICES:
                    productBrand = 'knight';
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
  headerFooter: {},
  label: {},
  location: {},
};

Footer.propTypes = {
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
    footer: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default Footer;
