import React from 'react';
// import { graphql } from 'gatsby';
// import ReactMarkdown from 'react-markdown/with-html';
// import { articleType } from '../types';

//
// const NotFoundPage = ({ data }) => (
const NotFoundPage = () => (
  <div>
    <h2>Sorry, that page could not be found!</h2>
    {/* <h2>{data.cms.articles[0].title}</h2>
    <ReactMarkdown source={data.cms.articles[0].body[0]} escapeHtml={false} /> */}
  </div>
);

NotFoundPage.defaultProps = {
  // data: {},
};

NotFoundPage.propTypes = {
  // data: articleType,
};

export default NotFoundPage;

// export const query = graphql`
//   query NotFoundPageQuery {
//     cms {
//       # articles(where: { articleType: NotFound }) {
//       #   title
//       #   body
//       # }
//     }
//   }
// `;
