import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import Layout from '../components/layout';
import LandingTile from '../components/landingTile';
import { allPageTypes } from '../constants';
import '../styles/landing.scss';

// const allowHTML = { html: true };

const LandingTemplate = ({ data, pageContext }) => {
  // const { activeLanguage, siteData, region, title } = pageContext;
  const { locale, siteData, region, title } = pageContext;
  const {
    cms: {
      headerFooters,
      labels,
      page: {
        landing: { landingSections },
      },
    },
  } = data;
  // const label = siteData.labels[0];
  let sectionIdx = 0;

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
            // labels: label,
            ...page.landing,
          };
          break;
        case allPageTypes.PRODUCT:
          tileData = {
            slug: page.slug,
            // labels: label,
            ...page.product,
          };
          break;
        default:
          break;
      }
      const landingTile = (
        <LandingTile data={tileData} key={`tile-${tileIdx}`} location={location} />
      );
      tileArray.push(landingTile);
    });
    return tileArray;
  };

  return (
    <Layout
      activeLanguage={locale}
      activeSection=""
      childrenClass="landing"
      region={region}
      title=""
      data={siteData}
      headerFooters={headerFooters}
      labels={labels}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="landing">
              <h2 className="landing-title">{title}</h2>
              {landingSections.length > 0 &&
                landingSections.map(landingSection => {
                  const { pages } = landingSection;
                  const sectionTitle = landingSection.title || null;
                  sectionIdx += 1;
                  return (
                    <div className="landing-section" key={`landing-section-${sectionIdx}`}>
                      {sectionTitle && (
                        <div className="title-container">
                          <div className="section-title">{sectionTitle}</div>
                        </div>
                      )}
                      <div className="tile-container">
                        {pages.length > 0 && renderTiles(pages, location)}
                      </div>
                    </div>
                  );
                })}
            </div>
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
    siteData: PropTypes.object,
    title: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonData
      page(where: { id: $id }) {
        landing {
          landingSections {
            title(locale: $locale)
            pages {
              slug(locale: $locale)
              pageType
              product {
                title(locale: $locale)
                subtitle(locale: $locale)
                tileImage {
                  url
                }
              }
              landing {
                title(locale: $locale)
                subtitle(locale: $locale)
                tileImage {
                  url
                }
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
