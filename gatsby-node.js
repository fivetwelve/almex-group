const path = require('path');
const { PAGE_TYPES, LANGUAGE_SLUGS, REGION_SLUGS } = require('./src/constants.js');

exports.createPages = ({ graphql, actions }) => {
  /*
     1. Get all pages with PUBLISHED status. Get list of regions.
     2. For each region, check if a page is available for it and publish it
        against each of the region's supported languages.
  */
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        cms {
          pages(where: { status: PUBLISHED }) {
            id
            availableIn
            pageType
            slugEN: slug(locale: EN)
            slugES: slug(locale: ES)
          }
          siteRegions {
            region
            languages
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }

      const {
        data: {
          cms: { pages, siteRegions },
        },
      } = result;

      siteRegions.forEach(({ region, languages }) => {
        languages.forEach(language => {
          createPage({
            path: `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}/search`,
            component: path.resolve(`./src/templates/search-template.js`),
            context: {
              locale: language,
              region,
            },
          });
        });
        pages.forEach(page => {
          const { id, availableIn, pageType } = page;
          if (availableIn.includes(region)) {
            languages.forEach(language => {
              const pagePath =
                pageType !== PAGE_TYPES.HOMEPAGE
                  ? `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}/${page[`slug${language}`]}`
                  : `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}`;
              switch (pageType) {
                case PAGE_TYPES.ABOUT:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/about-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.CAREERS:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/careers-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.CONTACT:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/contact-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.DOWNLOADS:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/downloads-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.EVENTS:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/events-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.HISTORY:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/history-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.HOMEPAGE:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/homepage-template.js`),
                    context: {
                      id,
                      locale: language,
                      page: 'index',
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.INSTITUTE:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/institute-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.LANDING:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/landing-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.NEWS:
                  /* also used by Safety Alerts & Certifications */
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/news-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.PRODUCT:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/product-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.PROMO:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/landing-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.RESOURCES:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/resources-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.SERVICES:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/services-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.SIMPLE:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/simple-content-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                case PAGE_TYPES.USED:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/used-equipment-template.js`),
                    context: {
                      id,
                      locale: language,
                      region,
                    },
                  });
                  break;
                default:
                  break;
              }
            });
          }
        });
      });
      resolve();
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /DrawSVGPlugin/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};
