const log = require('loglevel');
const path = require('path');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        cms {
          products {
            pageSlug
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      result.data.cms.products.forEach(({ pageSlug }) => {
        log.trace('>>>> result:', pageSlug);
        // TODO: locale needs to be dynamic, possible from the CMS.
        const locale = 'en';
        createPage({
          path: `${locale}/products/${pageSlug}`,
          component: path.resolve(`./src/templates/product-page.js`),
          context: {
            slug: pageSlug,
          },
        });
      });
      resolve();
    });
  });
};
