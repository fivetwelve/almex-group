import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import '../styles/simpleContent.scss';

const SimpleContentTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        simpleContent: { bannerImage, content, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="simple-content-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title={title}
    >
      {/* <Location>
        {({ location }) => ( */}
      <>
        <div className="simple-content-container">
          {bannerImage && (
            <div className="banner-wrapper">
              <div className="banner-image">
                <GraphImg image={bannerImage} maxWidth={1280} />
              </div>
            </div>
          )}
          <div className="main-container">
            <div className="main-content">
              <h1 className="title">{title}</h1>
              <div className="content">
                <ReactMarkdown source={content} escapeHtml={false} />
              </div>
            </div>
          </div>
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

SimpleContentTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

SimpleContentTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.object,
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
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
        simpleContent: simpleContentSource {
          bannerImage {
            handle
            width
            height
          }
          content(locale: $locale)
          title(locale: $locale)
        }
      }
    }
  }
`;

export default SimpleContentTemplate;
