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
          # can get rid of navigations once we generate pages from a master list
          activePagesLists {
            availableIn
            supportedLocales
            pages {
              id
              pageType
              slugEN: slug(locale: EN)
              slugES: slug(locale: ES)
              # article {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # industry {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # landing {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # product {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # promo {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # service {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
              # usedEquipment {
              #   titleEN: title(locale: EN)
              #   titleES: title(locale: ES)
              # }
            }
          }
          navigations(where: { availableIn: NORTH_AMERICA }) {
            availableIn
            navigationSections {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
              type
              pages {
                id
                pageType
                slugEN: slug(locale: EN)
                slugES: slug(locale: ES)
                article {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                industry {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                landing {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                product {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                promo {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                service {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
              }
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
            const pagePath = `${allRegionSlugs[availableIn]}/${allLanguageSlugs[locale]}/${
              page[`slug${locale}`]
            }`;
            switch (pageType) {
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
              case allPageTypes.LANDING:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    // activeLanguage: 'EN',
                    id,
                    locale,
                    siteData: data,
                    // page: slugEN,
                    region: availableIn,
                    // title: landing[`title${locale}`],
                    // landingSections: landing.landingSectionsEN,
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
