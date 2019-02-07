import React from 'react';
import '../styles/footer.scss';

const Footer = () => (
  <div className="footer">
    <div className="footer-container">
      <div className="footer-top">
        <div className="top-left" />
        <div className="top-center" />
        <div className="top-right" />
      </div>
      <div className="footer-bottom">
        <div className="bottom-left" />
        <div className="bottom-center" />
        <div className="bottom-right" />
      </div>
    </div>
  </div>
);

Footer.defaultProps = {
  // data: {},
};

Footer.propTypes = {
  // data: articleType,
};

export default Footer;
