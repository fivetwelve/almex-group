import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
// import LandingTile from '../components/landingTile';
import { allBrands } from '../constants';
import '../styles/about.scss';
// import ProductBrand from '../components/productBrand';
import { createLink, getTitle, makeid } from '../utils/functions';

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
        about: {
          bannerImage,
          // brand,
          // brandDescription,
          // brandTitle,
          // theme,
          // landingSections,
          title,
          description,
          helpfulResources,
        },
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
  //       case allPageTypes.LANDING:
  //         tileData = {
  //           slug: page.slug,
  //           ...page.landing,
  //         };
  //         break;
  //       case allPageTypes.PRODUCT:
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
              <div className="banner-image">
                <GraphImg image={bannerImage} maxWidth={1280} />
              </div>
              <div className="brands">
                {brands.map(brand => {
                  let productBrand = '';
                  switch (brand.landing.brand) {
                    case allBrands.ALMEX_IN_A_BOX:
                      productBrand = 'almex-box';
                      break;
                    case allBrands.BAT:
                      productBrand = 'bat';
                      break;
                    case allBrands.EMSYS:
                      productBrand = 'emsys';
                      break;
                    case allBrands.FUSION:
                      productBrand = 'fusion';
                      break;
                    case allBrands.VOTECH:
                      productBrand = 'votech';
                      break;
                    case allBrands.ALMEX_INSTITUTE:
                      productBrand = 'institute';
                      break;
                    case allBrands.GLOBAL_SERVICES:
                      productBrand = 'knight';
                      break;
                    default:
                      break;
                  }
                  return (
                    <div className={`brand ${productBrand}`} key={brand.slug}>
                      <Link to={createLink(location, brand.slug)}>
                        <span className="sr-only">{brand.landing.title}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
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
                          <Link to={createLink(location, resource.slug)}>
                            {getTitle(resource)} lorem
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="about-links">
                    <div className="label">{label.header.ABOUT}</div>
                    <ul>
                      <li>
                        <a href="http://almex.com">Some link here</a>
                      </li>
                      <li>
                        <a href="http://almex.com">Some link here lorem ipsum</a>
                      </li>
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
          # theme
          # landingSections {
          #   title(locale: $locale)
          #   pages {
          #     slug(locale: $locale)
          #     pageType
          #     product: productSource {
          #       title(locale: $locale)
          #       subtitle(locale: $locale)
          #       tileImage {
          #         url
          #       }
          #     }
          #     landing: landingSource {
          #       title(locale: $locale)
          #       subtitle(locale: $locale)
          #       tileImage {
          #         url
          #       }
          #     }
          #   }
          # }
          title(locale: $locale)
          description(locale: $locale)
          helpfulResources {
            id
            slug
            pageType
            landing: landingSource {
              title(locale: $locale)
            }
            product: productSource {
              title(locale: $locale)
            }
          }
        }
      }
    }
  }
`;

export default AboutTemplate;
