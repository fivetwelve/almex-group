const path = require('path');
const { LANGUAGE_SLUGS, REGION_SLUGS, SOURCE_TYPE_NAMES } = require('./src/constants');

/* Switch off type inference for SitePage.context
   https://www.gatsbyjs.com/docs/scaling-issues/ */
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SitePage implements Node @dontInfer {
      path: String!
    }
  `);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  /* generic function to remove prop from object */
  const removeKey = (key, { [key]: _, ...rest }) => rest;

  const globalQuery = await graphql(`
    {
      cms {
        brandNavigations {
          availableIn
          type
          localizations(includeCurrent: true) {
            locale
            title
          }
          pages {
            contentSource {
              sourceType: __typename
              ... on GraphCMS_LandingSource {
                brand
              }
              ... on GraphCMS_InstituteSource {
                brand
              }
              ... on GraphCMS_ServicesSource {
                brand
              }
            }
            localizations(includeCurrent: true) {
              locale
              title
              slug
            }
          }
        }
        headerFooters {
          availableIn
          localizations(includeCurrent: true) {
            locale
            companyAddress
            companyEmail
            companyPhone
            footerLinks
            formattedTagline
            fusionClub
            navigation
            simpleTagline
            socialMedia
          }
          privacyPage {
            localizations(includeCurrent: true) {
              locale
              slug
            }
          }
        }
        labels {
          availableIn
          resourcesLink {
            localizations(includeCurrent: true) {
              locale
              slug
            }
          }
          localizations(includeCurrent: true) {
            locale
            header
            footer
            common
            about
            products
            resources
            search
            services
            sparesRepairs
          }
        }
        navigations {
          availableIn
          navigationSections {
            localizations(includeCurrent: true) {
              locale
              title
            }
            pages {
              id
              availableIn
              localizations(includeCurrent: true) {
                locale
                slug
                title
              }
              contentSource {
                sourceType: __typename
                ... on GraphCMS_AboutSource {
                  sourceId: id
                }
                ... on GraphCMS_CareersSource {
                  sourceId: id
                }
                ... on GraphCMS_ContactSource {
                  sourceId: id
                }
                ... on GraphCMS_EventsSource {
                  sourceId: id
                }
                ... on GraphCMS_HistorySource {
                  sourceId: id
                }
                ... on GraphCMS_HomepageSource {
                  sourceId: id
                }
                ... on GraphCMS_InstituteSource {
                  sourceId: id
                }
                ... on GraphCMS_LandingSource {
                  sourceId: id
                }
                ... on GraphCMS_NewsSource {
                  sourceId: id
                }
                ... on GraphCMS_ProductSource {
                  sourceId: id
                }
                ... on GraphCMS_PromoSource {
                  sourceId: id
                }
                ... on GraphCMS_ResourcesSource {
                  sourceId: id
                }
                ... on GraphCMS_ServicesSource {
                  sourceId: id
                }
                ... on GraphCMS_SimpleContentSource {
                  sourceId: id
                }
                ... on GraphCMS_UsedEquipmentSource {
                  sourceId: id
                }
              }
            }
            isLandingPage
            type
          }
        }
      }
    }
  `);

  const pageQuery = await graphql(`
    {
      cms {
        pages(first: 1000) {
          id
          availableIn
          contentSource {
            sourceType: __typename
          }

          localizations(includeCurrent: true) {
            locale
            slug
          }
        }
        siteRegions {
          region
          languages
        }
      }
    }
  `);

  const queryData = [await globalQuery, await pageQuery];
  const queryGlobalData = queryData.filter(res => res.data.cms.pages === undefined);
  const queryPageData = queryData.filter(res => res.data.cms.pages !== undefined);
  const { brandNavigations, headerFooters, labels, navigations } = queryGlobalData[0].data.cms;
  const { pages, siteRegions } = queryPageData[0].data.cms;
  const allRegionData = [];

  siteRegions.forEach(thisRegion => {
    thisRegion.languages.forEach(language => {
      const brandNav = brandNavigations
        .filter(eachBrandNav => eachBrandNav.availableIn === thisRegion.region)
        .map(thisBrandNav => {
          const l10nTitles = thisBrandNav.localizations.filter(l10n => l10n.locale === language);
          const { title } = removeKey('locale', l10nTitles[0]);
          const brandPages = thisBrandNav.pages.map(page => {
            const l10n = page.localizations.filter(thisL10n => thisL10n.locale === language);
            let brand = '';
            let sourceType = '';
            if (page.contentSource) {
              brand = page.contentSource.brand;
              sourceType = page.contentSource.sourceType;
            }
            return {
              brand,
              slug: l10n[0].slug,
              sourceType: sourceType.includes('GraphCMS_') ? sourceType.substring(9) : sourceType,
              title: l10n[0].title,
            };
          });
          return {
            language,
            pages: brandPages,
            region: thisRegion.region,
            title,
            type: thisBrandNav.type,
          };
        });

      const headerFooter = headerFooters
        .filter(regionHeadersFooters => regionHeadersFooters.availableIn === thisRegion.region)
        .map(locHeaderFooters => {
          const privacyPage = locHeaderFooters.privacyPage.localizations.filter(
            l10n => l10n.locale === language,
          );
          const localization = locHeaderFooters.localizations.filter(
            l10n => l10n.locale === language,
          );
          localization[0].privacyPage = { slug: privacyPage[0].slug };
          return localization;
        });

      const label = labels
        .filter(locLabels => locLabels.availableIn === thisRegion.region)
        .map(locLabels => {
          const resourcesLink = locLabels.resourcesLink.localizations.filter(
            l10n => l10n.locale === language,
          );
          let locLabel = locLabels.localizations.filter(l10n => l10n.locale === language);
          locLabel = removeKey('locale', locLabel[0]);
          locLabel.resourcesLink = { slug: resourcesLink[0].slug };
          return {
            ...locLabel,
          };
        });

      const thisNav = navigations.filter(
        navigation => navigation.availableIn === thisRegion.region,
      );
      const navigationSections = thisNav[0].navigationSections.map(navSection => {
        const l10nTitles = navSection.localizations.filter(l10n => l10n.locale === language);
        const title = l10nTitles[0] && removeKey('locale', l10nTitles[0]).title;
        const navPages = navSection.pages.map(page => {
          /* if this page is not available for the region that we're parsing ignore it */
          if (!page.availableIn.includes(thisRegion.region)) {
            return false;
          }
          const l10n = page.localizations.filter(thisL10n => thisL10n.locale === language);

          return {
            id: page.id,
            sourceId: page.contentSource && page.contentSource.sourceId,
            slug: l10n[0].slug,
            title: l10n[0].title,
          };
        });
        return {
          title,
          pages: navPages,
          isLandingPage: navSection.isLandingPage,
          type: navSection.type,
        };
      });

      /* return localization */
      allRegionData.push({
        region: thisRegion.region,
        language,
        label: label[0],
        headerFooter: removeKey('locale', headerFooter[0][0]),
        brandNavigation: brandNav[0],
        navigation: {
          navigationSections,
        },
      });
    });
  });

  siteRegions.map(async ({ region, languages }) => {
    /* comment-in if-statement below to test the NA dataset
       and remember to adjust the closing bracket accordingly */
    // if (region === 'NORTH_AMERICA') {
    /* Search page */
    languages.forEach(language => {
      const localeData = allRegionData.filter(
        data => data.region === region && data.language === language,
      )[0];
      createPage({
        path: `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}/search`,
        component: path.resolve(`./src/templates/search-template.js`),
        context: {
          locale: language,
          localeData,
          // locales: language === 'EN' ? [language] : [language, 'EN'],
          region,
        },
      });
    });
    pages.map(async page => {
      const { id, availableIn, contentSource, localizations } = page;
      const { sourceType } = contentSource;
      /* ensure Page is available for this region */
      if (availableIn.includes(region)) {
        languages.forEach(language => {
          const localeData = allRegionData.filter(
            data => data.region === region && data.language === language,
          )[0];

          localizations.map(async localization => {
            const { locale } = localization;
            const locales = locale === 'EN' ? [locale] : [locale, 'EN'];
            if (locale === language) {
              const pagePath =
                sourceType !== SOURCE_TYPE_NAMES.HOMEPAGE
                  ? `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}/${localization.slug}`
                  : `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}`;

              switch (sourceType) {
                case SOURCE_TYPE_NAMES.ABOUT:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/about-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.CAREERS:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/careers-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.CONTACT:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/contact-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.EVENTS:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/events-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.HISTORY:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/history-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.HOMEPAGE:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/homepage-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      page: 'index',
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.INSTITUTE:
                  /* also used by training pages */
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/institute-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.LANDING:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/landing-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                      availableIn: region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.NEWS:
                  /* also used by Safety Alerts & Certifications */
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/news-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.PRODUCT:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/product-template.js`),
                    context: {
                      // contentId: contentSource.sourceId,
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                      availableIn: region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.PROMO:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/promo-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.RESOURCES:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/resources-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.SERVICES:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/services-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.SIMPLE:
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/simple-content-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                case SOURCE_TYPE_NAMES.USED:
                  /* pass `locale` to be used with moment function */
                  await createPage({
                    path: pagePath,
                    component: path.resolve(`./src/templates/used-equipment-template.js`),
                    context: {
                      id,
                      languages,
                      locale,
                      localeData,
                      locales,
                      region,
                    },
                  });
                  break;
                default:
                  break;
              }
            }
          });
        });
      }
    });
    /* comment-in the closing bracket on next line to test the NA dataset */
    // }
  });

  if (queryData[0].errors) {
    throw queryData[0].errors;
  }
  if (queryData[1].errors) {
    throw queryData[1].errors;
  }
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
      node: {
        fs: 'empty',
      },
      resolve: {
        fallback: {
          fs: false,
        },
      },
    });
  }
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
      },
    },
  });
};
