import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import LandingTile from '../components/landingTile';
import { allPageTypes, allThemes } from '../constants';
import '../styles/landing.scss';
import ProductBrand from '../components/productBrand';

const allowHTML = { html: true };

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
          brandDescription,
          brandTitle,
          theme,
          landingSections,
          title,
        },
      },
    },
  } = data;
  let themeColour = '';
  let sectionIdx = 0;

  switch (theme) {
    case allThemes.HEAVYWEIGHT: {
      break;
    }
    case allThemes.LIGHTWEIGHT: {
      themeColour = 'teal';
      break;
    }
    case allThemes.INDUSTRIAL: {
      break;
    }
    case allThemes.FUSION_COLD: {
      break;
    }
    case allThemes.FUSION_HOT: {
      themeColour = 'orange';
      break;
    }
    default: {
      break;
    }
  }

  const renderTiles = (pages, location) => {
    const tileArray = [];
    let tileIdx = 0;
    pages.forEach(page => {
      let tileData = {};
      tileIdx += 1;
      switch (page.pageType) {
        case allPageTypes.LANDING:
          tileData = {
            slug: page.slug,
            tile: page.tile,
            ...page.landing,
          };
          break;
        case allPageTypes.PRODUCT:
          tileData = {
            slug: page.slug,
            tile: page.tile,
            ...page.product,
          };
          break;
        default:
          break;
      }
      const landingTile = (
        <LandingTile
          data={tileData}
          key={`tile-${tileIdx}`}
          location={location}
          themeColour={themeColour}
        />
      );
      tileArray.push(landingTile);
    });
    return tileArray;
  };
  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="landing"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
            {!brand && <h2 className="landing-title">{title}</h2>}
            {brand && bannerImage && (
              <div className="brand-container">
                <div className={`banner-image ${themeColour}`}>
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
                <ProductBrand brand={brand} />
                <h2 className="brand-title">{brandTitle}</h2>
                <div className="brand-description">
                  <Markdown source={brandDescription} options={allowHTML} />
                </div>
              </div>
            )}
            {brand && !bannerImage && (
              <div className="brand-container">
                <ProductBrand brand={brand} />
              </div>
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
    id: PropTypes.string,
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
          brandTitle(locale: $locale)
          brandDescription(locale: $locale)
          theme
          landingSections {
            title(locale: $locale)
            pages {
              pageType
              slug(locale: $locale)
              tile {
                url
              }
              product: productSource {
                title(locale: $locale)
                subtitle(locale: $locale)
                # tileImage {
                #   url
                # }
              }
              landing: landingSource {
                title(locale: $locale)
                subtitle(locale: $locale)
                # tileImage {
                #   url
                # }
              }
            }
          }
          title(locale: $locale)
        }
      }
    }
  }
`;

export default LandingTemplate;
