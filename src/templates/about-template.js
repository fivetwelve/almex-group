import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import BrandBanner from '../components/brandBanner';
import Layout from '../components/layout';
// import LandingTile from '../components/landingTile';
import '../styles/about.scss';
// import ProductBrand from '../components/productBrand';
import { createLink, makeid } from '../utils/functions';

const allowHTML = { html: true };

const AboutTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      label,
      aboutLabel,
      brandNavigation,
      headerFooter,
      navigation,
      page: {
        about: { aboutUsLinks, bannerImage, title, description, helpfulResources },
      },
    },
  } = data;

  const brands = brandNavigation.pages;
  // let sectionIdx = 0;

  // const renderTiles = (pages, location) => {
  //   const tileArray = [];
  //   let tileIdx = 0;
  //   pages.forEach(page => {
  //     let tileData = {};
  //     tileIdx += 1;
  //     switch (page.pageType) {
  //       case PAGE_TYPES.LANDING:
  //         tileData = {
  //           slug: page.slug,
  //           ...page.landing,
  //         };
  //         break;
  //       case PAGE_TYPES.PRODUCT:
  //         tileData = {
  //           slug: page.slug,
  //           ...page.product,
  //         };
  //         break;
  //       default:
  //         break;
  //     }
  //     const landingTile = (
  //       <LandingTile
  //         data={tileData}
  //         key={`tile-${tileIdx}`}
  //         location={location}
  //         themeColour={themeColour}
  //       />
  //     );
  //     tileArray.push(landingTile);
  //   });
  //   return tileArray;
  // };
  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="about"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
            <div className="about-container">
              {bannerImage && (
                <div className="banner-wrapper">
                  <div className="banner-image">
                    <GraphImg image={bannerImage} maxWidth={1280} />
                  </div>
                </div>
              )}
              <BrandBanner brands={brands} location={location} />
              <div className="intro-container">
                <div className="intro-content">
                  <h1 className="title">{title}</h1>
                  <div className="description">
                    <Markdown source={description} options={allowHTML} />
                  </div>
                </div>
                <div className="links">
                  <div className="resources">
                    <div className="label">{aboutLabel.about.RESOURCES}</div>
                    <ul>
                      {helpfulResources.map(resource => (
                        <li key={makeid()}>
                          <Link to={createLink(location, resource.slug)}>{resource.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="about-links">
                    <div className="label">{label.header.ABOUT}</div>
                    <ul>
                      {/* <li>
                        <a href="http://almex.com">Some link here</a>
                      </li>
                      <li>
                        <a href="http://almex.com">Some link here lorem ipsum</a>
                      </li> */}
                      {aboutUsLinks.map(aboutUsLink => (
                        <li key={makeid()}>
                          <Link to={createLink(location, aboutUsLink.slug)}>
                            {aboutUsLink.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* {brand && !bannerImage && (
                <div className="brand-container">
                  <ProductBrand brand={brand} />
                </div>
              )} */}
              {/* {landingSections.length > 0 &&
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
                })} */}
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

AboutTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

AboutTemplate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
    // title: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      aboutLabel: label(where: { availableIn: $region }) {
        about(locale: $locale)
      }
      page(where: { id: $id }) {
        about: aboutSource {
          bannerImage {
            handle
            width
            height
          }
          title(locale: $locale)
          description(locale: $locale)
          helpfulResources {
            slug(locale: $locale)
            pageType
            title
          }
          aboutUsLinks {
            slug(locale: $locale)
            pageType
            title
          }
        }
      }
    }
  }
`;

export default AboutTemplate;
