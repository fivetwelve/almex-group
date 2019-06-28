const path = require('path');
const { allPageTypes, allLanguageSlugs, allRegionSlugs } = require('./src/constants.js');

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
        pages.forEach(page => {
          const { id, availableIn, pageType } = page;
          if (availableIn.includes(region)) {
            languages.forEach(language => {
              const pagePath =
                pageType !== allPageTypes.HOMEPAGE
                  ? `${allRegionSlugs[region]}/${allLanguageSlugs[language]}/${
                      page[`slug${language}`]
                    }`
                  : `${allRegionSlugs[region]}/${allLanguageSlugs[language]}`;
              switch (pageType) {
                case allPageTypes.HOMEPAGE:
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
                case allPageTypes.INDUSTRY:
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
                case allPageTypes.INSTITUTE:
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
                case allPageTypes.PRODUCT:
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
                case allPageTypes.PROMO:
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
                case allPageTypes.LANDING:
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
                // TODO change to appropriate templates for the pageTypes below:
                case allPageTypes.ARTICLE:
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
                case allPageTypes.ABOUT:
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
                case allPageTypes.CAREERS:
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
                case allPageTypes.CONTACT:
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
                case allPageTypes.EVENTS:
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
                case allPageTypes.HISTORY:
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
                case allPageTypes.NEWS:
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
                case allPageTypes.SERVICES:
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
                case allPageTypes.USED:
                  createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/usedEquipment-template.js`),
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
