require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Almex Group`,
    description: `Conveyor Belt Vulcanizers | Vulcanizing Equipment | Almex`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-graphql`,
      options: {
        url: process.env.CMS_ENDPOINT,
        headers: {
          Authorization: `Bearer ${process.env.CMS_TOKEN}`,
        },
        query: `{
          products {
            pageSlug
            category
            title
            specifications
            summary
            features
          }
          articles {
            pageSlug
            category
            title
            body
          }
        }`,
        typeName: `GraphCMS`,
        fieldName: `cms`,
      },
    },
  ],
};
