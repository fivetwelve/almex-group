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
          # activePagesLists {
          #   availableIn
          #   supportedLocales
          #   pages {
          #     id
          #     pageType
          #     slugEN: slug(locale: EN)
          #     slugES: slug(locale: ES)
          #   }
          # }
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
      // const data = {
      //   headerFooter: result.data.cms.headerFooter,
      //   label: result.data.cms.label,
      //   navigations: result.data.cms.navigations,
      // };
      // const { data } = result;
      /*
        Create landing pages from activePagesList for North America.
        Loops through country, its language(s), then its assigned pages.
      */

      /*
        Loop through all regions. For each region, loop through published pages and
        check if each one is available for that region. If so, cycle through each of
        the region's supported languages and call createPage for it.
      */

      const {
        data: {
          cms: { pages, siteRegions },
        },
      } = result;
      // result.data.cms.activePagesLists.forEach(({ availableIn, supportedLocales, pages }) => {
      //   supportedLocales.forEach(locale => {
      //     pages.forEach(page => {
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
                case allPageTypes.SERVICE:
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

// exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins }) => {
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
