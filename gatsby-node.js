// const log = require('loglevel');
const path = require('path');
const { allPageTypes, allRegions } = require('./src/constants.js');

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
          productListNA: productLists(where: { availableIn: NORTH_AMERICA }) {
            availableIn
            productsEN: products(where: { status: PUBLISHED }) {
              page {
                id
                slug(locale: EN)
              }
              # features(locale: EN)
              # specs(locale: EN)
              # summary(locale: EN)
              # title(locale: EN)
            }
            productsES: products(where: { status: PUBLISHED }) {
              page {
                id
                slug(locale: ES)
              }
              # features(locale: ES)
              # specs(locale: ES)
              # summary(locale: ES)
              # title(locale: ES)
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      const data = {
        headerFooters: result.data.cms.headerFooters,
        labels: result.data.cms.labels,
        navigations: result.data.cms.navigations,
      };
      /* Create landing pages from site navigation structure for North America */
      result.data.cms.navigations.forEach(({ availableIn, navigationSections }) => {
        for (let i = 0; i < navigationSections.length; i += 1) {
          const { pages } = navigationSections[i];
          for (let j = 0; j < pages.length; j += 1) {
            const {
              id,
              pageType,
              slugEN,
              slugES,
              article,
              industry,
              // landing,
              promo,
              service,
            } = pages[j];
            const pagePathEN = `${allRegions[availableIn]}/en/${slugEN}`;
            const pagePathES = `${allRegions[availableIn]}/es/${slugES}`;
            switch (pageType) {
              case allPageTypes.PRODUCT:
                break;
              case allPageTypes.LANDING:
                createPage({
                  path: pagePathEN,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    // activeLanguage: 'EN',
                    id,
                    locale: 'EN',
                    siteData: data,
                    // page: slugEN,
                    region: 'NORTH_AMERICA',
                    // title: landing.titleEN,
                    // landingSections: landing.landingSectionsEN,
                  },
                });
                createPage({
                  path: pagePathES,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    // activeLanguage: 'ES',
                    id,
                    locale: 'ES',
                    siteData: data,
                    // page: slugES,
                    region: 'NORTH_AMERICA',
                    // title: landing.titleES,
                    // landingSections: landing.landingSectionsES,
                  },
                });
                break;
              // TODO change to appropriate templates for the pageTypes below:
              case allPageTypes.ARTICLE:
                createPage({
                  path: pagePathEN,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'EN',
                    locale: 'EN',
                    siteData: data,
                    page: slugEN,
                    region: 'NORTH_AMERICA',
                    title: article.titleEN,
                  },
                });
                createPage({
                  path: pagePathES,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'ES',
                    siteData: data,
                    page: slugES,
                    region: 'NORTH_AMERICA',
                    title: article.titleES,
                  },
                });
                break;
              case allPageTypes.INDUSTRY:
                createPage({
                  path: pagePathEN,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'EN',
                    locale: 'EN',
                    siteData: data,
                    page: slugEN,
                    region: 'NORTH_AMERICA',
                    title: industry.titleEN,
                  },
                });
                createPage({
                  path: pagePathES,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'ES',
                    siteData: data,
                    page: slugES,
                    region: 'NORTH_AMERICA',
                    title: industry.titleES,
                  },
                });
                break;
              case allPageTypes.PROMO:
                createPage({
                  path: pagePathEN,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'EN',
                    locale: 'EN',
                    siteData: data,
                    page: slugEN,
                    region: 'NORTH_AMERICA',
                    title: promo.titleEN,
                  },
                });
                createPage({
                  path: pagePathES,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'ES',
                    siteData: data,
                    page: slugES,
                    region: 'NORTH_AMERICA',
                    title: promo.titleES,
                  },
                });
                break;
              case allPageTypes.SERVICE:
                createPage({
                  path: pagePathEN,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'EN',
                    locale: 'EN',
                    siteData: data,
                    page: slugEN,
                    region: 'NORTH_AMERICA',
                    title: service.titleEN,
                  },
                });
                createPage({
                  path: pagePathES,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    activeLanguage: 'ES',
                    siteData: data,
                    page: slugES,
                    region: 'NORTH_AMERICA',
                    title: service.titleES,
                  },
                });
                break;
              default:
                break;
            }
          }
        }
      });
      /* Create product pages from productsList for North America. */
      result.data.cms.productListNA.forEach(({ availableIn, productsEN, productsES }) => {
        const component = path.resolve(`./src/templates/product-template.js`);
        /* English */
        for (let i = 0; i < productsEN.length; i += 1) {
          // const { page, category, title, specs, summary, features } = productsEN[i];
          const { page } = productsEN[i];
          createPage({
            path: `${allRegions[availableIn]}/en/${page.slug}`,
            component,
            context: {
              id: page.id,
              locale: 'EN',
              siteData: data,
              region: 'NORTH_AMERICA',
              test: 'TEST',
            },
          });
        }
        /* Spanish */
        for (let i = 0; i < productsES.length; i += 1) {
          // const { page, category, title, specs, summary, features } = productsES[i];
          const { page } = productsES[i];
          createPage({
            path: `${allRegions[availableIn]}/es/${page.slug}`,
            component,
            context: {
              id: page.id,
              locale: 'ES',
              siteData: data,
              region: 'NORTH_AMERICA',
            },
          });
        }
      });
      resolve();
    });
  });
};
