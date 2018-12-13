import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import { articleType } from '../types';

const NotFoundPage = ({ data }) => (
  <div>
    <h2>{data.cms.articles[0].title}</h2>
    <Markdown source={data.cms.articles[0].body} />
  </div>
);

NotFoundPage.defaultProps = {
  data: {},
};

NotFoundPage.propTypes = {
  data: articleType,
};

export default NotFoundPage;

export const query = graphql`
  query NotFoundPageQuery {
    cms {
      articles(where: { category: NotFound }) {
        category
        title
        body
      }
    }
  }
`;
