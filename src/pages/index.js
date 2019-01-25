import React from 'react';
import Layout from '../components/layout';

const HomePage = () => (
  <Layout
    activeLanguage="EN"
    activeSection=""
    childrenClass="corporate-page"
    region="NORTH_AMERICA"
    title=""
  >
    <h1>Homepage</h1>
  </Layout>
);

HomePage.defaultProps = {
  // data: {},
};

HomePage.propTypes = {
  // data: articleType,
};

export default HomePage;
