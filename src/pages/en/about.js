import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import { articleType } from '../../types';

const AboutPage = ({ data }) => (
  <div>
    <Markdown source={data.cms.articles[0].body} />
  </div>
);

AboutPage.defaultProps = {
  data: {},
};

AboutPage.propTypes = {
  data: articleType,
};

export default AboutPage;

export const query = graphql`
  query AboutPageQuery {
    cms {
      articles(where: { category: About }) {
        category
        title
        body
      }
    }
  }
`;
