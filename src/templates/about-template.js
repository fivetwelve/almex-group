import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import BrandBanner from '../components/brandBanner';
import Layout from '../components/layout';
import '../styles/about.scss';
import { createLink, makeid, renderLink } from '../utils/functions';

const AboutTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.about) {
    throw Error(
      `Check the connection to aboutSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
    );
  }
  const { languages, locale, localeData, region } = pageContext;
  const { brandNavigation, label } = localeData;
  const {
    cms: {
      // label,
      // label,
      page: {
        about: { aboutUsLinks, bannerImage, title, description, helpfulResources },
      },
    },
  } = data;

  const brands = brandNavigation.pages;

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="about-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
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
                    <ReactMarkdown
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="links">
                  <div className="resources">
                    <div className="label">{label.about.RESOURCES}</div>
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
    cms: PropTypes.shape({
      // label: PropTypes.instanceOf(Object),
      // label: PropTypes.instanceOf(Object),
      page: PropTypes.instanceOf(Object),
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};
export const query = graphql`
  query(
    $id: ID!
    # $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]! # $region: GraphCMS_Region!
  ) {
    cms {
      # label: label(locales: $locale, where: { availableIn: $region }) {
      #   about
      # }
      page(locales: $locales, where: { id: $id }) {
        about: contentSource {
          ... on GraphCMS_AboutSource {
            bannerImage {
              handle
              width
              height
            }
            title
            description
            helpfulResources {
              slug
              pageType
              title
            }
            aboutUsLinks {
              slug
              pageType
              title
            }
          }
        }
      }
    }
  }
`;

export default AboutTemplate;
