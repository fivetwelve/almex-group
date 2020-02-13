import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import LandingTile from '../components/landingTile';
import { LANDING_TYPES, THEMES } from '../constants';
import '../styles/landing.scss';
import ProductBrand from '../components/productBrand';
import { makeid, renderLink } from '../utils/functions';

const LandingTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        landing: {
          bannerImage,
          brand,
          description,
          landingType,
          landingSections,
          singlePages,
          sorting,
          theme,
          title,
        },
      },
    },
  } = data;
  let themeColour = '';
  let sectionIdx = 0;

  switch (theme) {
    case THEMES.HEAVYWEIGHT: {
      break;
    }
    case THEMES.LIGHTWEIGHT: {
      themeColour = 'teal';
      break;
    }
    case THEMES.INDUSTRIAL: {
      break;
    }
    case THEMES.FUSION_COLD: {
      break;
    }
    case THEMES.FUSION_HOT: {
      themeColour = 'orange';
      break;
    }
    case THEMES.FUSION_SPICY: {
      themeColour = 'red';
      break;
    }
    default: {
      break;
    }
  }

  const renderTiles = (pages, location, sort = true) => {
    const tileArray = [];
    // let tileIdx = 0;
    pages.forEach(page => {
      // let tileData = {};
      // Use landingSource or productSource titles by default. All other cases, use title provided in Page entry.
      const pageTitle =
        // (page.landingSource && page.landingSource.title) ||
        // (page.productSource && page.productSource.title) ||
        // (page.servicesSource && page.servicesSource.title) ||
        page.title;
      const tileData = {
        slug: page.slug,
        tile: page.tile,
        title: pageTitle,
      };
      // tileIdx += 1;
      // switch (page.pageType) {
      //   case PAGE_TYPES.LANDING:
      //     tileData = {
      //       slug: page.slug,
      //       tile: page.tile,
      //       title: page.title
      //       ...page.landing,
      //     };
      //     break;
      //   case PAGE_TYPES.PRODUCT:
      //     tileData = {
      //       slug: page.slug,
      //       tile: page.tile,
      //       ...page.product,
      //     };
      //     break;
      //   default:
      //     break;
      // }
      const landingTile = (
        <LandingTile
          data={tileData}
          // key={`tile-${tileIdx}`}
          key={makeid()}
          location={location}
          themeColour={themeColour}
        />
      );
      tileArray.push(landingTile);
    });

    if (sort) {
      tileArray.sort((a, b) => {
        // TODO: need to ensure activeLanguage param is valid value for localeCompare
        const titleA = (a.props.data.title && a.props.data.title.toLowerCase()) || '';
        const titleB = (b.props.data.title && b.props.data.title.toLowerCase()) || '';
        // -1 sort string ascending
        //  1 sort string descending;
        //  0 no sorting
        return titleA.localeCompare(titleB, locale);
      });
    }
    return tileArray;
  };

  landingSections.sort((a, b) => {
    // TODO: need to ensure activeLanguage param is valid value for localeCompare
    const titleA = (a.title && a.title.toLowerCase()) || '';
    const titleB = (b.title && b.title.toLowerCase()) || '';
    // -1 sort string ascending
    //  1 sort string descending;
    //  0 no sorting
    return titleA.localeCompare(titleB, locale);
  });

  const sortedSinglePages = [];
  if (singlePages && sorting) {
    sorting.forEach(elem => {
      const foundPage = singlePages.filter(page => page.id === elem.id)[0];
      /* conditional needed in case landingSource's sort field does not match up with children; 
         prevents an undefined from being inserted into array */
      if (foundPage) {
        sortedSinglePages.push(foundPage);
      }
    });
  }

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="landing-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            {(!landingType || landingType === LANDING_TYPES.PRODUCT) && (
              <>
                {bannerImage && (
                  <div className={`banner-wrapper ${themeColour}`}>
                    <div className={`banner-image ${themeColour}`}>
                      <GraphImg image={bannerImage} maxWidth={1280} />
                    </div>
                  </div>
                )}
                <div className="default-container">
                  {brand && <ProductBrand brand={brand} />}
                  <h2 className="landing-title">{title}</h2>
                  {description && (
                    <div className="description">
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props),
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {landingType === LANDING_TYPES.BRAND && (
              <>
                {bannerImage && (
                  <div className={`banner-wrapper ${themeColour}`}>
                    <div className={`banner-image ${themeColour}`}>
                      <GraphImg image={bannerImage} maxWidth={1280} />
                    </div>
                  </div>
                )}
                <div className="brand-container">
                  {brand && (
                    <>
                      <ProductBrand brand={brand} />
                      <h2 className="title">{title}</h2>
                    </>
                  )}
                  {description && (
                    <div className="description">
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props),
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            {landingType === LANDING_TYPES.INDUSTRY && (
              <>
                <div className="industry-container">
                  <div className={`banner-wrapper ${themeColour}`}>
                    <div className={`banner-image ${themeColour}`}>
                      <GraphImg image={bannerImage} maxWidth={1280} />
                    </div>
                  </div>
                  <h2 className="title">{title}</h2>
                  {description && (
                    <div className="description">
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props),
                        }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            {landingSections.length > 0 &&
              landingSections.map(landingSection => {
                const { pages } = landingSection;
                const sectionTitle = landingSection.title || null;
                sectionIdx += 1;
                return (
                  <div className="landing-section" key={`landing-section-${sectionIdx}`}>
                    {sectionTitle && (
                      <div className={`title-container ${themeColour}`}>
                        <div className="section-title">{sectionTitle}</div>
                      </div>
                    )}
                    <div className="tile-container">
                      {pages.length > 0 && renderTiles(pages, location)}
                    </div>
                  </div>
                );
              })}
            {sortedSinglePages.length > 0 && (
              <div className="tile-container">
                {sortedSinglePages.length > 0 && renderTiles(sortedSinglePages, location, false)}
              </div>
            )}
            {sortedSinglePages.length === 0 && (
              <div className="tile-container">
                {singlePages.length > 0 && renderTiles(singlePages, location)}
              </div>
            )}
          </>
        )}
      </Location>
    </Layout>
  );
};

LandingTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

LandingTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      page(where: { id: $id }) {
        landing: landingSource {
          bannerImage {
            handle
            width
            height
          }
          brand
          description(locale: $locale)
          theme
          landingType
          landingSections {
            title(locale: $locale)
            pages(where: { status: PUBLISHED }) {
              landingSource {
                title(locale: $locale)
              }
              productSource {
                title(locale: $locale)
              }
              servicesSource {
                title(locale: $locale)
              }
              pageType
              slug(locale: $locale)
              tile {
                url
              }
              title(locale: $locale)
            }
          }
          singlePages: pages(where: { status: PUBLISHED }) {
            id
            landingSource {
              title(locale: $locale)
            }
            productSource {
              title(locale: $locale)
            }
            servicesSource {
              title(locale: $locale)
            }
            pageType
            slug(locale: $locale)
            tile {
              url
            }
            title(locale: $locale)
          }
          sorting(locale: $locale)
          title(locale: $locale)
        }
      }
    }
  }
`;

export default LandingTemplate;
