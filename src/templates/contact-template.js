import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
// import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
// import ErrorBoundary from '../components/errorBoundary';
import RegionLookup from '../components/regionLookup';
import ContactMap from '../components/contactMap';
import { allBrands } from '../constants';
import { createLink, makeid } from '../utils/functions';

import '../styles/contact.scss';

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

  const brands = brandNavigation.pages;

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
      {/* <ContactMap /> */}
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
              <a href="#offices">Almex locations around the globe</a>
              <ContactMap offices={offices} locale={locale} />
              {/* <ContactMap /> */}
              {/* <ErrorBoundary> */}
              {/* </ErrorBoundary> */}
              {/* <div className="map" id="map-container">
              </div> */}
              <table className="table-data">
                <tbody>
                  {offices.map(office => {
                    const { belongsTo, address, countries, name } = office;
                    return (
                      <tr key={makeid()}>
                        <td className="table-region">{belongsTo}</td>
                        <td className="table-office">
                          {name}
                          <br />
                          <Markdown source={address} />
                        </td>
                        <td className="table-desc">{office.description}</td>
                        <td className="table-countries">{countries}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            countries
            description
            fax
            latitude
            longitude
            mobile
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
