import { shape, string } from 'prop-types';

const articleType = shape({
  cms: shape({
    articles: shape({
      title: string.isRequired,
      pageSlug: string.isRequired,
      body: string.isRequired,
    }),
  }),
});

const productType = shape({
  cms: shape({
    products: shape({
      title: string.isRequired,
      category: string.isRequired,
      id: string.isRequired,
      specifications: string.isRequired,
      summary: string.isRequired,
      pageslug: string.isRequired,
    }),
  }),
});

export { articleType, productType };
