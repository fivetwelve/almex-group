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
          navigationNA: navigations(where: { availableIn: NORTH_AMERICA }) {
            availableIn
            navigationSections {
              title
              pages {
                slug
                pageType
                article {
                  title
                }
                product {
                  title
                }
                landing {
                  title
                }
              }
            }
          }
          productListNA: productLists(where: { availableIn: NORTH_AMERICA }) {
            availableIn
            productsEN: products(where: { status: PUBLISHED }) {
              page {
                slug(locale: EN)
              }
              features(locale: EN)
              specifications(locale: EN)
              summary(locale: EN)
              title(locale: EN)
            }
            productsES: products(where: { status: PUBLISHED }) {
              page {
                slug(locale: ES)
              }
              features(locale: ES)
              specifications(locale: ES)
              summary(locale: ES)
              title(locale: ES)
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      /* Create landing pages from site navigation structure for North America */
      result.data.cms.navigationNA.forEach(({ availableIn, navigationSections }) => {
        for (let i = 0; i < navigationSections.length; i += 1) {
          const { pages } = navigationSections[i];
          for (let j = 0; j < pages.length; j += 1) {
            const { slug, pageType, article, industry, landing, product, promo, service } = pages[
              j
            ];
            const pagePath = `${allRegions[availableIn]}/en/${slug}`;
            switch (pageType) {
              case allPageTypes.PRODUCT:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/product-template.js`),
                  context: {
                    page: slug,
                    category: product.category,
                    title: product.title,
                    specifications: product.specifications,
                    summary: product.summary,
                    features: product.features,
                  },
                });
                break;
              case allPageTypes.LANDING:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    page: slug,
                    title: landing.title,
                  },
                });
                break;
              // TODO change to appropriate templates for the pageTypes below:
              case allPageTypes.ARTICLE:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    page: slug,
                    title: article.title,
                  },
                });
                break;
              case allPageTypes.INDUSTRY:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    page: slug,
                    title: industry.title,
                  },
                });
                break;
              case allPageTypes.PROMO:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    page: slug,
                    title: promo.title,
                  },
                });
                break;
              case allPageTypes.SERVICE:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    page: slug,
                    title: service.title,
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
        for (let i = 0; i < productsEN.length; i += 1) {
          const { page, category, title, specifications, summary, features } = productsEN[i];
          createPage({
            path: `${allRegions[availableIn]}/en/${page.slug}`,
            component: path.resolve(`./src/templates/product-template.js`),
            context: {
              slug: page.slug,
              category,
              title,
              specifications,
              summary,
              features,
            },
          });
        }
        for (let i = 0; i < productsES.length; i += 1) {
          const { page, category, title, specifications, summary, features } = productsES[i];
          createPage({
            path: `${allRegions[availableIn]}/es/${page.slug}`,
            component: path.resolve(`./src/templates/product-template.js`),
            context: {
              slug: page.slug,
              category,
              title,
              specifications,
              summary,
              features,
            },
          });
        }
      });
      resolve();
    });
  });
};
