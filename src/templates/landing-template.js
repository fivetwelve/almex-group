import React from 'react';
import PropTypes from 'prop-types';
import { Location } from '@reach/router';
import Layout from '../components/layout';
import LandingTile from '../components/landingTile';
import { allPageTypes } from '../constants';
import '../styles/landing.scss';

// const allowHTML = { html: true };

const LandingTemplate = ({ pageContext }) => {
  const { activeLanguage, landingSections, data, region, title } = pageContext;
  const label = data.labels[0];
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
            labels: label,
            ...page.landing,
          };
          break;
        case allPageTypes.PRODUCT:
          tileData = {
            slug: page.slug,
            labels: label,
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
      activeLanguage={activeLanguage}
      activeSection=""
      childrenClass="landing"
      region={region}
      title=""
      data={data}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="landing">
              <h2 className="landing-title">{title}</h2>
              {landingSections.length > 0 &&
                landingSections.map(landingSection => {
                  const { pages } = landingSection;
                  const sectionTitle = landingSection[`title${activeLanguage}`] || null;
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
  pageContext: {},
};

LandingTemplate.propTypes = {
  pageContext: PropTypes.shape({
    activeLanguage: PropTypes.string,
    data: PropTypes.object,
    landingSections: PropTypes.array,
    region: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default LandingTemplate;
