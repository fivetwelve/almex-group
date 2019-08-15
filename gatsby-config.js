require('dotenv').config();

const proxy = require('http-proxy-middleware');

module.exports = {
  siteMetadata: {
    title: `Almex Group`,
    description: `Conveyor Belt Vulcanizers | Vulcanizing Equipment | Almex`,
  },
  developMiddleware: app => {
    /*
      proxying function to avoid CORS issues for localhost testing
      of lambda functions
    */
    app.use(
      '/.netlify/functions/',
      proxy({
        target: 'http://localhost:9000',
        pathRewrite: {
          '/.netlify/functions/': '',
        },
      }),
    );
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    // {
    //   resolve: `gatsby-plugin-polyfill-io`,
    //   options: {
    //     features: [`Array.prototype.map`, `fetch`],
    //   },
    // },
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Nunito Sans`,
            variants: [`400`, `400i`, `700`, `700i`],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-136510250-1',
      },
    },
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
          headerFooters {
            navigation
            language
          }
          labels {
            region
            header
            footer
            common
          }
        }`,
        typeName: `GraphCMS`,
        fieldName: `cms`,
      },
    },
    {
      resolve: `gatsby-plugin-netlify`, // Always last in the plugins array
      options: {
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: false, // boolean to turn off the default gatsby js headers (disabled by default, until gzip is fixed for server push)
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
      },
    },
  ],
};
