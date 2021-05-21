const path = require('path');
const { PAGE_TYPES, LANGUAGE_SLUGS, REGION_SLUGS } = require('./src/constants');

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
              pageType
              availableIn
              localizations(includeCurrent: true) {
                locale
                slug
                title
              }
              contentSource {
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
          pageType
          productSource {
            id
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

  const [globalData, pageData] = [await globalQuery, await pageQuery];
  const { brandNavigations, headerFooters, labels, navigations } = globalData.data.cms;
  const { pages, siteRegions } = pageData.data.cms;
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
            let brand;
            let sourceType;
            if (page.contentSource) {
              brand = page.contentSource.brand;
              sourceType = page.contentSource.sourceType;
            }
            return {
              brand,
              slug: l10n[0].slug,
              sourceType: sourceType.includes('GraphC2MS_') ? sourceType.substring(9) : sourceType,
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
        .map(locLabels => locLabels.localizations.filter(l10n => l10n.locale === language));

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
            sourceId: page.contentSource.sourceId,
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
        label: removeKey('locale', label[0][0]),
        headerFooter: removeKey('locale', headerFooter[0][0]),
        brandNavigation: brandNav[0],
        navigation: {
          navigationSections,
        },
      });
    });
  });

  siteRegions.forEach(({ region, languages }) => {
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
    /* Pages with PUBLISHED status in CMS */
    pages.forEach(page => {
      const { id, availableIn, pageType, localizations } = page;
      /* ensure Page is available for this region */
      if (availableIn.includes(region)) {
        languages.forEach(language => {
          const localeData = allRegionData.filter(
            data => data.region === region && data.language === language,
          )[0];

          localizations.forEach(localization => {
            const { locale } = localization;
            const locales = locale === 'EN' ? [locale] : [locale, 'EN'];
            if (locale === language) {
              const pagePath =
                pageType !== PAGE_TYPES.HOMEPAGE
                  ? `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}/${localization.slug}`
                  : `${REGION_SLUGS[region]}/${LANGUAGE_SLUGS[language]}`;

              switch (pageType) {
                // case PAGE_TYPES.ABOUT:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/about-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.CAREERS:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/careers-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.CONTACT:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/contact-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.EVENTS:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/events-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.HISTORY:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/history-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                case PAGE_TYPES.HOMEPAGE:
                  createPage({
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
                // case PAGE_TYPES.INSTITUTE:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/institute-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.LANDING:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/landing-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //       availableIn: region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.NEWS:
                //   /* also used by Safety Alerts & Certifications */
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/news-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.PRODUCT:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/product-template.js`),
                //     context: {
                //       contentId: productSource.id,
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //       availableIn: region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.PROMO:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/promo-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.RESOURCES:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/resources-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.SERVICES:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/services-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.SIMPLE:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/simple-content-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                // case PAGE_TYPES.USED:
                //   createPage({
                //     path: pagePath,
                //     component: path.resolve(`./src/templates/used-equipment-template.js`),
                //     context: {
                //       id,
                //       languages,
                //       locale,
                //       locales,
                //       region,
                //     },
                //   });
                //   break;
                default:
                  break;
              }
            }
          });
        });
      }
    });
  });

  if (globalData.errors) {
    throw globalData.errors;
  }
  if (pageData.errors) {
    throw pageData.errors;
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
    });
  }
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
  });
};
