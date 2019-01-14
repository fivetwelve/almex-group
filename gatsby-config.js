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
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        // trackingId: "UA-XXXXXXXXX-X",
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
    },
    {
      resolve: `gatsby-source-graphql`,
      options: {
        url: process.env.CMS_ENDPOINT,
        headers: {
          Authorization: `Bearer ${process.env.CMS_TOKEN}`,
        },
        query: `{
          labels {
            header
          }
          productLists {
            region
            products {
              pageSlug
              category
              title
              specifications
              summary
              features
            }
          }
          articles {
            pageSlug
            articleType
            navSection
            title
            body
            labels
            images {
              url
            }
            imageLabels
            youTubeId
          }
        }`,
        typeName: `GraphCMS`,
        fieldName: `cms`,
      },
    },
  ],
};
