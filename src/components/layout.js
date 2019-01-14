import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import '../styles/layout.scss';

class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { activeSection, children, childrenClass } = this.props;

    return (
      <div className="siteContainer">
        <div className="pageContainer">
          <Header activeSection={activeSection} />
          <div className="bodyClass">
            <div className={childrenClass}>{children}</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

Layout.defaultProps = {
  activeSection: '',
  children: {},
  childrenClass: '',
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  activeSection: PropTypes.string,
  childrenClass: PropTypes.string,
};

export default Layout;
