import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';

const allowHTML = { html: true };

const AboutPage = ({ data }) => (
  <Layout activeSection="ABOUT">
    <Markdown source={data.cms.articles[0].body[0]} options={allowHTML} />
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
      articles(where: { articleType: About }) {
        articleType
        title(locale: ES)
        body(locale: ES)
      }
    }
  }
`;
