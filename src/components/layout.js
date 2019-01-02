import React from 'react';
import PropTypes from 'prop-types';
import Header from './header';
import Footer from './footer';

class Layout extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { children, activeTab } = this.props;

    return (
      <div>
        <Header activeTab={activeTab} />
        <div>{children}</div>
        <Footer />
      </div>
    );
  }
}

Layout.defaultProps = {
  activeTab: '',
};

Layout.propTypes = {
  // children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  activeTab: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Layout;
