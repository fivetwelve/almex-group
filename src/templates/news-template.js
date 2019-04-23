import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import { allBrands } from '../constants';
import '../styles/about.scss';
import { createLink, getTitle, makeid } from '../utils/functions';

const allowHTML = { html: true };

const NewsTemplate = ({ data, pageContext }) => {
  const { locale, siteData, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      aboutLabel,
      page: {
        about: { bannerImage, title, description, helpfulResources },
      },
    },
  } = data;

  const brands = brandNavigation.pages;

  return (
    <Layout
      activeLanguage={locale}
      activeSection=""
      brandNavigation={brandNavigation}
      childrenClass="about"
      region={region}
      title=""
      data={siteData}
      headerFooter={headerFooter}
      label={label}
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
                        <a href="http://alme.com">Some link here</a>
                      </li>
                      <li>
                        <a href="http://alme.com">Some link here lorem ipsum</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

NewsTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

NewsTemplate.propTypes = {
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
        about: aboutSource {
          bannerImage {
            handle
            width
            height
          }
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

export default NewsTemplate;
