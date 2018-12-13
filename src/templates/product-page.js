import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import { productType } from '../types';
import Dump from '../utils/dump';

const ProductPage = ({ data }) => (
  <div>
    <h2>{data.cms.products[0].title}</h2>
    <Markdown source={data.cms.products[0].summary} />
    <Dump data={data} />
  </div>
);

ProductPage.defaultProps = {
  data: {},
};

ProductPage.propTypes = {
  data: productType,
};

export default ProductPage;

export const query = graphql`
  query($slug: String) {
    cms {
      products(where: { pageSlug: $slug }) {
        pageSlug
        category
        title
        specifications
        summary
        features
      }
    }
  }
`;
