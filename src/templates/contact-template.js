import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
// import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
// import GraphImg from 'graphcms-image';
// import { fromJS } from 'immutable';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import RegionLookup from '../components/regionLookup';
import ContactMap from '../components/contactMap';
import { allBrands } from '../constants';
import { createLink } from '../utils/functions';

import '../styles/contact.scss';
// import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
// import '../styles/mapbox-gl.css';

const allowHTML = { html: true };

const ContactTemplate = ({ data, pageContext }) => {
  const { locale, siteData, region } = pageContext;
  const {
    cms: {
      aboutLabel,
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        contact: { title, description, offices },
      },
    },
  } = data;
  // const { viewport } = this.state;

  const brands = brandNavigation.pages;

  // const mapStyle = fromJS({
  //   version: 8,
  //   sprite: 'mapbox://sprites/mapbox/streets-v8',
  //   glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  //   sources: {
  //     'mapbox-streets': {
  //       type: 'vector',
  //       url: 'mapbox://mapbox.mapbox-streets-v6',
  //     },
  //     points: {
  //       type: 'geojson',
  //       data: {
  //         type: 'FeatureCollection',
  //         features: [
  //           { type: 'Feature', geometry: { type: 'Point', coordinates: [-122.45, 37.78] } },
  //         ],
  //       },
  //     },
  //   },
  //   layers: [
  //     {
  //       id: 'my-layer',
  //       type: 'circle',
  //       source: 'points',
  //       paint: {
  //         'circle-color': '#f00',
  //         'circle-radius': 4,
  //       },
  //     },
  //   ],
  // });

  // console.log(offices);
  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="contact"
      data={siteData}
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
            <div className="contact-container">
              {/* <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div> */}
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
                  </div>
                </div>
              </div>
              <RegionLookup />
              <ContactMap offices={offices} />
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

ContactTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ContactTemplate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
    siteData: PropTypes.object,
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
        contact: contactSource {
          title(locale: $locale)
          description(locale: $locale)
          offices {
            address
            belongsTo
            contactPerson
            fax
            latitude
            longitude
            name
            telephone
            tollFree
          }
        }
      }
    }
  }
`;

export default ContactTemplate;
