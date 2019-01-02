import PropTypes from 'prop-types';

const articleType = PropTypes.shape({
  cms: PropTypes.shape({
    articles: PropTypes.shape({
      title: PropTypes.string.isRequired,
      pageSlug: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }),
  }),
});

const productType = PropTypes.shape({
  cms: PropTypes.shape({
    products: PropTypes.shape({
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      specifications: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      pageslug: PropTypes.string.isRequired,
    }),
  }),
});

export { articleType, productType };
