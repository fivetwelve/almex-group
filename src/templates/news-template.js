import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
// import GraphImg from 'graphcms-image';
// import Markdown from 'react-remarkable';
import BrandBanner from '../components/brandBanner';
import Layout from '../components/layout';
import '../styles/about.scss';

// const allowHTML = { html: true };

const NewsTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      aboutLabel,
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        news: { title },
      },
    },
  } = data;

  const brands = brandNavigation.pages;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="news"
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
              {/* <div className="banner-image">
                <GraphImg image={bannerImage} maxWidth={1280} />
              </div> */}
              <BrandBanner brands={brands} location={location} />
              <div className="intro-container">
                <div className="intro-content">
                  <h1 className="title">{title}</h1>
                  {/* <div className="description">
                    <Markdown source={description} options={allowHTML} />
                  </div> */}
                </div>
                <div className="links">
                  <div className="resources">
                    <div className="label">{aboutLabel.about.RESOURCES}</div>
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
        news: newsSource {
          # bannerImage {
          #   handle
          #   width
          #   height
          # }
          title(locale: $locale)
          # description(locale: $locale)
        }
      }
    }
  }
`;

export default NewsTemplate;
