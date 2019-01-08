import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';

const AboutPage = ({ data }) => (
  <Layout activeTab="ABOUT">
    <Markdown source={data.cms.articles[0].body} />
    <p>
      Test Image:
      <img src={data.cms.articles[0].testImage.url} alt="thumbnail of press" />
    </p>
  </Layout>
);

AboutPage.defaultProps = {
  data: {},
};

AboutPage.propTypes = {
  data: articleType,
};

export default AboutPage;

export const query = graphql`
  query {
    cms {
      articles(where: { category: About }) {
        category
        title(locale: EN)
        body(locale: EN)
        testImage {
          url
        }
      }
    }
  }
`;
