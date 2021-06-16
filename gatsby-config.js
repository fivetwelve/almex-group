require('dotenv').config();
const fetch = require('cross-fetch');
const { createHttpLink } = require('apollo-link-http');
const { RetryLink } = require('apollo-link-retry');
const { ApolloLink } = require('apollo-link');

const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://almex.com',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;
const proxy = require('http-proxy-middleware');

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    // eslint-disable-next-line no-unused-vars
    retryIf: (error, _operation) => Boolean(error) && ![503, 500, 400].includes(error.statusCode),
  },
});

module.exports = {
  siteMetadata: {
    title: `Almex Group`,
    description: `Conveyor Belt Vulcanizers | Vulcanizing Equipment | Almex`,
    siteUrl,
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
  flags: {
    /* DEV_SSR addresses https://stackoverflow.com/questions/66083723/prop-aria-current-did-not-match-server-null-client-page */
    DEV_SSR: false,
    FAST_DEV: true,
    PRESERVE_WEBPACK_CACHE: true,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*' }],
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    `gatsby-plugin-react-helmet-async`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`nunito sans:400,400i,700,700i`],
        display: 'swap',
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['UA-136510250-2', 'UA-2722190-2'],
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        pluginConfig: {
          head: true,
          respectDNT: false,
        },
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
        // url: process.env.GATSBY_CMS_ENDPOINT,
        // headers: {
        //   Authorization: `Bearer ${process.env.GATSBY_CMS_TOKEN}`,
        // },
        typeName: `GraphCMS`,
        fieldName: `cms`,
        batch: true,
        dataLoaderOptions: {
          maxBatchSize: 2,
        },
        // `pluginOptions`: all plugin options
        // (i.e. in this example object with keys `typeName`, `fieldName`, `url`, `createLink`)
        // eslint-disable-next-line no-unused-vars
        createLink: pluginOptions =>
          ApolloLink.from([
            retryLink,
            createHttpLink({
              // uri: pluginOptions.url,
              uri: process.env.GATSBY_CMS_ENDPOINT,
              headers: {
                Authorization: `Bearer ${process.env.GATSBY_CMS_TOKEN}`,
              },
              fetch,
            }),
          ]),
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
