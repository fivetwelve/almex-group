import React from 'react';
import { graphql } from 'gatsby';
import { articleType } from '../../types';

export const query = graphql`
  query AboutPageQuery {
    cms {
      articles {
        title
        body
      }
    }
  }
`;

const AboutPage = ({ data }) => (
  <div>
    <h2>{data.cms.articles[0].title}</h2>
    <div>{data.cms.articles[0].body}</div>
  </div>
);

AboutPage.defaultProps = {
  data: {},
};

AboutPage.propTypes = {
  data: articleType,
};

export default AboutPage;
