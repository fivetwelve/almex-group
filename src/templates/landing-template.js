import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import LandingTile from '../components/landingTile';
import AlternativeBanner from '../components/alternativeBanner';
import { LANDING_TYPES, THEMES } from '../constants';
import '../styles/landing.scss';
import ProductBrand from '../components/productBrand';
import { makeid, renderLink } from '../utils/functions';

const LandingTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.landing) {
  //   console.log('data.cms', data.cms);
  //   throw Error(
  //     `Check the connection to landing source; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const {
    cms: {
      page: {
        contentSource: {
          bannerImage,
          alternativeBanners,
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
  /* availableIn_contains_some filter taken out of query so filtering here instead to improve with build time */
  const regionalAlternativeBanners = alternativeBanners.filter(banner =>
    banner.availableIn.includes(region),
  );
  const regionalLandingSections = landingSections.map(landingSection => {
    const regionalPages = landingSection.pages.filter(page => page.availableIn.includes(region));
    return {
      title: landingSection.title,
      pages: regionalPages,
    };
  });
  const regionalSinglePages = singlePages.filter(singlePage =>
    singlePage.availableIn.includes(region),
  );
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
      const tileData = {
        slug: page.slug,
        tile: page.tile,
        title: pageTitle,
      };
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
      childrenClass="landing-page"
      languages={languages}
      localeData={localeData}
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
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
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
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
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
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </>
            )}
            {regionalLandingSections.length > 0 &&
              regionalLandingSections.map(landingSection => {
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
            {regionalSinglePages.length > 0 && (
              <div className="tile-container">{renderTiles(regionalSinglePages, location)}</div>
            )}
            {regionalAlternativeBanners.length > 0 &&
              regionalAlternativeBanners.map(banner => {
                return (
                  <AlternativeBanner
                    location={location}
                    alternativeBanner={banner}
                    key={makeid()}
                  />
                );
              })}
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
      page: PropTypes.instanceOf(Object),
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locales: [GraphCMS_Locale!]!) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        contentSource {
          sourceType: __typename
          ... on GraphCMS_LandingSource {
            bannerImage {
              handle
              width
              height
            }
            # alternativeBanners(where: { availableIn_contains_some: $availableIn }) {
            alternativeBanners {
              title
              externalLink
              page {
                slug
              }
              image {
                handle
                width
                height
              }
              availableIn
            }
            brand
            description
            theme
            landingType
            landingSections {
              title
              pages {
                availableIn
                # contentSource {
                #   ... on GraphCMS_LandingSource {
                #     title
                #   }
                #   ... on GraphCMS_ProductSource {
                #     title
                #   }
                #   ... on GraphCMS_ServicesSource {
                #     title
                #   }
                # }
                # landingSource {
                #   title
                # }
                # productSource {
                #   title
                # }
                # servicesSource {
                #   title
                # }
                contentSource {
                  sourceType: __typename
                }
                slug
                tile {
                  url
                }
                title
              }
            }
            singlePages: pages {
              # where: { availableIn_contains_some: $availableIn } # locales: $locales
              availableIn
              id
              # contentSource {
              #   ... on GraphCMS_LandingSource {
              #     title
              #   }
              #   ... on GraphCMS_ProductSource {
              #     title
              #   }
              #   ... on GraphCMS_ServicesSource {
              #     title
              #   }
              # }
              # landingSource {
              #   title
              # }
              # productSource {
              #   title
              # }
              # servicesSource {
              #   title
              # }
              contentSource {
                sourceType: __typename
              }
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
  }
`;

export default LandingTemplate;
