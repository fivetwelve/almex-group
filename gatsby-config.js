require('dotenv').config();

const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://almex.com',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;
const proxy = require('http-proxy-middleware');

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
    FAST_DEV: true,
    // DEV_SSR: false,
    // PRESERVE_WEBPACK_CACHE: true,
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
        url: process.env.GATSBY_CMS_ENDPOINT,
        headers: {
          Authorization: `Bearer ${process.env.GATSBY_CMS_TOKEN}`,
        },
        typeName: `GraphCMS`,
        fieldName: `cms`,
        batch: true,
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
