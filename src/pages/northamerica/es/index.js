import React from 'react';
// import netlifyIdentity from 'netlify-identity-widget';
import Layout from '../../../components/layout';

class HomePage extends React.Component {
  componentDidMount() {
    // netlifyIdentity.open();
  }

  render() {
    return (
      <Layout
        activeLanguage="EN"
        activeSection=""
        childrenClass="corporate-page"
        region="NORTH_AMERICA"
        title=""
      >
        <h1>Homepage</h1>
        {/* <div data-netlify-identity-menu /> */}
      </Layout>
    );
  }
}

HomePage.defaultProps = {
  // data: {},
};

HomePage.propTypes = {
  // data: articleType,
};

export default HomePage;
