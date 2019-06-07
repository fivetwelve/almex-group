const path = require('path');
const { allPageTypes, allLanguageSlugs, allRegionSlugs } = require('./src/constants.js');

exports.createPages = ({ graphql, actions }) => {
  /*
     1. Get all productLists by region. Each region will map to a path.
     2. Under each region, populate related products in the region's
        supported languages; each language will have its own path followed
        by the product's slug.
  */
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        cms {
          activePagesLists {
            availableIn
            supportedLocales
            pages {
              id
              pageType
              slugEN: slug(locale: EN)
              slugES: slug(locale: ES)
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      const data = {
        headerFooter: result.data.cms.headerFooter,
        label: result.data.cms.label,
        navigations: result.data.cms.navigations,
      };
      /*
        Create landing pages from activePagesList for North America.
        Loops through country, its language(s), then its assigned pages.
      */
      result.data.cms.activePagesLists.forEach(({ availableIn, supportedLocales, pages }) => {
        supportedLocales.forEach(locale => {
          pages.forEach(page => {
            const { id, pageType } = page;
            const pagePath =
              pageType !== allPageTypes.HOMEPAGE
                ? `${allRegionSlugs[availableIn]}/${allLanguageSlugs[locale]}/${
                    page[`slug${locale}`]
                  }`
                : `${allRegionSlugs[availableIn]}/${allLanguageSlugs[locale]}`;
            switch (pageType) {
              case allPageTypes.HOMEPAGE:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/homepage-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    page: 'index',
                    region: availableIn,
                    // title: homepage[`title${locale}`],
                  },
                });
                break;
              case allPageTypes.INDUSTRY:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    page: page.slug[locale],
                    region: availableIn,
                    // title: industry[`title${locale}`],
                  },
                });
                break;
              case allPageTypes.PRODUCT:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/product-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.PROMO:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    page: page.slug[locale],
                    region: availableIn,
                    // title: promo[`title${locale}`],
                  },
                });
                break;
              case allPageTypes.LANDING:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
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
                    locale,
                    siteData: data,
                    page: page.slug[locale],
                    region: availableIn,
                    // title: article[`title${locale}`],
                  },
                });
                break;

              case allPageTypes.SERVICE:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    page: page.slug[locale],
                    region: availableIn,
                    // title: service[`title${locale}`],
                  },
                });
                break;
              case allPageTypes.ABOUT:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/about-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.CAREERS:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/careers-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.CONTACT:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/contact-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.EVENTS:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/events-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.HISTORY:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/history-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.NEWS:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/news-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              case allPageTypes.USED:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/usedEquipment-template.js`),
                  context: {
                    id,
                    locale,
                    siteData: data,
                    region: availableIn,
                  },
                });
                break;
              default:
                break;
            }
          });
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
