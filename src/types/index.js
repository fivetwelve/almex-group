import PropTypes from 'prop-types';

const articleType = PropTypes.shape({
  cms: PropTypes.shape({
    articles: PropTypes.arrayOf({
      title: PropTypes.string,
      pageSlug: PropTypes.string,
      body: PropTypes.string,
      videoId: PropTypes.array,
    }),
  }),
});

const productType = PropTypes.shape({
  cms: PropTypes.shape({
    products: PropTypes.shape({
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      specifications: PropTypes.string.isRequired,
      summary: PropTypes.string.isRequired,
      pageslug: PropTypes.string.isRequired,
    }),
  }),
});

export { articleType, productType };
