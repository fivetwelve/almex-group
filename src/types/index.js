import { shape, string } from 'prop-types';

export const articleType = shape({
  cms: shape({
    articles: shape({
      title: string.isRequired,
      pageSlug: string.isRequired,
      body: string.isRequired,
    }),
  }),
});

export default articleType;
