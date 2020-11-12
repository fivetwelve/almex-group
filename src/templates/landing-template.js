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
  if (!data.cms.page.landing) {
    throw Error(
      `Check the connection to landingSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
    );
  }
  const { languages, locale, region } = pageContext;
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

  const renderTiles = (pages, location) => {
    const tileArray = [];
    pages.forEach(page => {
      /* Use page titles by default. This allows some flexibility if there needs to be a shorter title than what is stored in source. */
      const pageTitle = page.title;
      // const pageAvailableIn = page.availableIn;
      // const pageRegion = page.region;
      const tileData = {
        slug: page.slug,
        tile: page.tile,
        title: pageTitle,
      };
      // console.log('avail:', pageAvailableIn);
      // console.log('region:', region);
      const landingTile = (
        <LandingTile data={tileData} key={makeid()} location={location} themeColour={themeColour} />
      );
      tileArray.push(landingTile);
    });

    return tileArray;
  };

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="landing-page"
      headerFooter={headerFooter}
      label={label}
      languages={languages}
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
                          link: props => renderLink(props, location),
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
                          link: props => renderLink(props, location),
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
                          link: props => renderLink(props, location),
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
                if (pages.length > 0) {
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
                }
                return null;
              })}
            {singlePages.length > 0 && (
              <div className="tile-container">{renderTiles(singlePages, location)}</div>
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
    id: PropTypes.string,
    languages: PropTypes.array,
    locale: PropTypes.string,
    locales: PropTypes.array,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
    $region: GraphCMS_Region
    $availableIn: [GraphCMS_Region!]
  ) {
    cms {
      ...CommonQuery
      page(locales: $locales, where: { id: $id }) {
        landing: landingSource {
          bannerImage {
            handle
            width
            height
          }
          brand
          description
          theme
          landingType
          landingSections {
            title
            pages(
              where: {
                availableIn_contains_some: $availableIn
                OR: [{ archived: false }, { archived: null }]
              }
            ) {
              landingSource {
                title
              }
              productSource {
                title
              }
              servicesSource {
                title
              }
              pageType
              slug
              tile {
                url
              }
              title
            }
          }
          singlePages: pages(
            # locales: $locales
            where: {
              availableIn_contains_some: $availableIn
              OR: [{ archived: false }, { archived: null }]
            }
          ) {
            availableIn
            id
            landingSource {
              title
            }
            productSource {
              title
            }
            servicesSource {
              title
            }
            pageType
            slug
            tile {
              url
            }
            title
          }
          title
        }
      }
    }
  }
`;

export default LandingTemplate;
