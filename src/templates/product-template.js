import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import { productType } from '../types';
import Dump from '../utils/dump';

const allowHTML = { html: true };

const ProductTemplate = ({ data, pageContext }) => (
  <div>
    <h2>{pageContext.title}</h2>
    {pageContext.summary && (
      <div className="product-summary">
        <Markdown source={pageContext.summary} options={allowHTML} />
      </div>
    )}
    {pageContext.features && (
      <div className="product-features">
        <Markdown source={pageContext.features} options={allowHTML} />
      </div>
    )}
    {pageContext.specifications && (
      <div className="product-specs">
        <Markdown source={pageContext.specifications} options={allowHTML} />
      </div>
    )}
    <Dump data={data} />
  </div>
);

ProductTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ProductTemplate.propTypes = {
  data: productType,
  pageContext: PropTypes.shape({
    pageSlug: PropTypes.string,
    category: PropTypes.array,
    title: PropTypes.string,
    specifications: PropTypes.string,
    summary: PropTypes.string,
    features: PropTypes.string,
  }),
};

export default ProductTemplate;

// export const query = graphql`
//   query($slug: String) {
//     cms {
//       products(where: { pageSlug: $slug }) {
//         pageSlug
//         category
//         title
//         specifications
//         summary
//         features
//       }
//     }
//   }
// `;