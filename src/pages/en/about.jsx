import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
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
