import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';
import '../styles/index.scss';

class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { activeTab, children, childrenClass } = this.props;

    return (
      <div className="siteContainer">
        <div className="pageContainer">
          <Header activeTab={activeTab} />
          <div className={childrenClass}>{children}</div>
          <Footer />
        </div>
      </div>
    );
  }
}

Layout.defaultProps = {
  activeTab: '',
  childrenClass: '',
};

Layout.propTypes = {
  // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  activeTab: PropTypes.string,
  children: PropTypes.node.isRequired,
  childrenClass: PropTypes.string,
};

export default Layout;
