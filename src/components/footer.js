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
import '../styles/footer.scss';

const Footer = ({ headerFooters, labels }) => {
  const { companyAddress, companyEmail, companyPhone, footerLinks, socialMedia } = headerFooters[0];
  const { footer } = labels[0];
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
                {companyPhone}
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
          <div className="footer-bottom">
            <div className="bottom-left">{footer.COPYRIGHT}</div>
            <div className="bottom-center">
              <Link to="northamerica/en/heavyweight" className="footer-link">
                {footerLinks.ABOUT.LABEL}
              </Link>
              <Link to="northamerica/en/heavyweight" className="footer-link">
                {footerLinks.CONTACT.LABEL}
              </Link>
              <Link to="northamerica/en/heavyweight" className="footer-link">
                {footerLinks.PRIVACY.LABEL}
              </Link>
              <Link to="northamerica/en/heavyweight" className="footer-link">
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
  headerFooters: [],
  labels: [],
};

Footer.propTypes = {
  headerFooters: PropTypes.instanceOf(Array),
  labels: PropTypes.instanceOf(Array),
};

export default Footer;
