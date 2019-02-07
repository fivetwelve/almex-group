// const log = require('loglevel');
const path = require('path');
const { regionList } = require('./src/constants.js');

exports.createPages = ({ graphql, actions }) => {
  /*
     1. Get all productLists by region. Each region will map to a path.
     2. Under each region, populate related products in the region's
        supported languages; each language will have its own path followed
        by the product pageSlug.
  */
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        cms {
          productLists {
            region
            productsEN: products(locale: EN) {
              pageSlug
              category
              title
              specifications
              summary
              features
            }
            productsES: products(locale: ES) {
              pageSlug
              category
              title(locale: ES)
              specifications(locale: ES)
              summary(locale: ES)
              features(locale: ES)
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      result.data.cms.productLists.forEach(({ region, productsEN, productsES }) => {
        for (let i = 0; i < productsEN.length; i += 1) {
          const { pageSlug, category, title, specifications, summary, features } = productsEN[i];
          createPage({
            path: `${regionList[region]}/en/products/${pageSlug}`,
            component: path.resolve(`./src/templates/product-template.js`),
            context: {
              pageSlug,
              category,
              title,
              specifications,
              summary,
              features,
            },
          });
        }
        for (let i = 0; i < productsES.length; i += 1) {
          const { pageSlug, category, title, specifications, summary, features } = productsES[i];
          createPage({
            path: `${regionList[region]}/es/products/${pageSlug}`,
            component: path.resolve(`./src/templates/product-template.js`),
            context: {
              pageSlug,
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
