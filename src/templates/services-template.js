import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
// import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import { allBrands, allPageTypes } from '../constants';
import '../styles/about.scss';
import { createLink, makeid } from '../utils/functions';

const allowHTML = { html: true };

const ServicesTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      // aboutLabel,
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        services: { title, description, sideContent },
      },
    },
  } = data;

  const brands = brandNavigation.pages;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="services"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
            <div className="services-container">
              {/* <div className="banner-image">
                <GraphImg image={bannerImage} maxWidth={1280} />
              </div> */}
              <div className="brands">
                {brands.map(brand => {
                  let productBrand = '';
                  const brandType =
                    brand.pageType === allPageTypes.LANDING ? brand.landing : brand.services;
                  switch (brandType.brand) {
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
                        <span className="sr-only">{brandType.title}</span>
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
                {/* <div className="links">
                  <div className="resources">
                    <div className="label">{aboutLabel.about.RESOURCES}</div>
                  </div>
                </div> */}
              </div>
            </div>
            <div className="side-content-container">
              {sideContent.map(content => (
                <Markdown key={makeid()} source={content} options={allowHTML} />
              ))}
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

ServicesTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ServicesTemplate.propTypes = {
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
      # aboutLabel: label(where: { availableIn: $region }) {
      #   about(locale: $locale)
      # }
      page(where: { id: $id }) {
        services: servicesSource {
          description(locale: $locale)
          sideContent(locale: $locale)
          title(locale: $locale)
        }
      }
    }
  }
`;

export default ServicesTemplate;
