const log = require('loglevel');
const path = require('path');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        cms {
          products {
            pageslug
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        reject(result.errors);
      }
      result.data.cms.products.forEach(({ pageslug }) => {
        // console.log(`product: ${product}`);
        log.trace('>>>> result:', pageslug);
        // const path = pageslug;
        const locale = 'en';
        createPage({
          path: `${locale}/${pageslug}`,
          component: path.resolve(`./src/templates/product-page.js`),
          context: {
            slug: pageslug,
          },
        });
      });
      resolve();
    });
  });
};
