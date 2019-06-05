import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
// import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import RegionLookup from '../components/regionLookup';
import ContactMap from '../components/contactMap';
import { allBrands } from '../constants';
import { createLink } from '../utils/functions';

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
              <div className="almex-locations">
                <a href="#offices">
                  <span className="more">{aboutLabel.about.ALMEX_LOCATIONS}</span>
                  <span className="more-arrow">&nbsp;&raquo;</span>
                </a>
              </div>
              <ContactMap label={aboutLabel} locale={locale} offices={offices} />
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
            countries(locale: $locale)
            countryCode
            description(locale: $locale)
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
