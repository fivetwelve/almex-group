import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import BrandBanner from '../components/brandBanner';
import Layout from '../components/layout';
import '../styles/about.scss';
import { createLink, makeid, renderLink } from '../utils/functions';

const AboutTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.about) {
    throw Error('aboutSource is either not connected or not published');
  }
  const { languages, locale, region } = pageContext;
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

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="about-page"
      headerFooter={headerFooter}
      label={label}
      languages={languages}
      navigation={navigation}
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
                      source={description}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
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
      aboutLabel: PropTypes.object,
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  pageContext: PropTypes.shape({
    languages: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};
export const query = graphql`
  query($id: ID!, $locale: [GraphCMS_Locale!]!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      aboutLabel: label(locales: $locale, where: { availableIn: $region }) {
        about
      }
      page(locales: $locale, where: { id: $id }) {
        about: aboutSource {
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
`;

export default AboutTemplate;
