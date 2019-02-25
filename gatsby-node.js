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
          headerFooters(where: { region: NORTH_AMERICA }) {
            companyAddress(locale: EN)
            companyEmail
            companyPhone
            footerLinks(locale: EN)
            formattedTagline(locale: EN)
            language
            navigation(locale: EN)
            simpleTagline(locale: EN)
            socialMedia(locale: EN)
          }
          labels(where: { region: NORTH_AMERICA }) {
            common(locale: EN)
            header(locale: EN)
            footer(locale: EN)
          }
          navigationNA: navigations(where: { availableIn: NORTH_AMERICA }) {
            availableIn
            navigationSections {
              title
              pages {
                slug(locale: EN)
                pageType
                article {
                  title(locale: EN)
                }
                product {
                  title(locale: EN)
                }
                landing {
                  title(locale: EN)
                  landingSections {
                    title(locale: EN)
                    pages {
                      slug(locale: EN)
                      pageType
                      product {
                        title(locale: EN)
                        subtitle(locale: EN)
                        tileImage {
                          url
                        }
                      }
                    }
                  }
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
      const data = {
        headerFooters: result.data.cms.headerFooters,
        labels: result.data.cms.labels,
      };
      /* Create landing pages from site navigation structure for North America */
      result.data.cms.navigationNA.forEach(({ availableIn, navigationSections }) => {
        for (let i = 0; i < navigationSections.length; i += 1) {
          const { pages } = navigationSections[i];
          for (let j = 0; j < pages.length; j += 1) {
            const { slug, pageType, article, industry, landing, promo, service } = pages[j];
            const pagePath = `${allRegions[availableIn]}/en/${slug}`;
            switch (pageType) {
              case allPageTypes.PRODUCT:
                break;
              case allPageTypes.LANDING:
                createPage({
                  path: pagePath,
                  component: path.resolve(`./src/templates/landing-template.js`),
                  context: {
                    data,
                    page: slug,
                    title: landing.title,
                    landingSections: landing.landingSections,
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
        const component = path.resolve(`./src/templates/product-template.js`);
        /* English */
        for (let i = 0; i < productsEN.length; i += 1) {
          const { page, category, title, specifications, summary, features } = productsEN[i];
          createPage({
            path: `${allRegions[availableIn]}/en/${page.slug}`,
            component,
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
        /* Spanish */
        for (let i = 0; i < productsES.length; i += 1) {
          const { page, category, title, specifications, summary, features } = productsES[i];
          createPage({
            path: `${allRegions[availableIn]}/es/${page.slug}`,
            component,
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
