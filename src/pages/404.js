import React from 'react';
// import { graphql } from 'gatsby';
// import Markdown from 'react-remarkable';
// import { articleType } from '../types';

// const allowHTML = { html: true };

// const NotFoundPage = ({ data }) => (
const NotFoundPage = () => (
  <div>
    <h2>Sorry, that page could not be found!</h2>
    {/* <h2>{data.cms.articles[0].title}</h2>
    <Markdown source={data.cms.articles[0].body[0]} options={allowHTML} /> */}
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
