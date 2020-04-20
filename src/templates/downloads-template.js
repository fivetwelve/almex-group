import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import 'moment/locale/es';
import Layout from '../components/layout';
import { renderLink } from '../utils/functions';
import { DOWNLOAD_TYPES } from '../constants';
import '../styles/downloads.scss';

const DownloadsTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        downloads: { bannerImage, description, files, downloadsType, title },
      },
    },
  } = data;

  let themeColour = 'blue';

  switch (downloadsType) {
    case DOWNLOAD_TYPES.DATA_SHEETS: {
      themeColour = 'orange';
      break;
    }
    case DOWNLOAD_TYPES.MANUALS: {
      themeColour = 'blue';
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="downloads-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="downloads-container">
              {bannerImage && (
                <div className={`banner-wrapper ${themeColour}`}>
                  <div className={`banner-image ${themeColour}`}>
                    <GraphImg image={bannerImage} maxWidth={1280} />
                  </div>
                </div>
              )}
              <div className="intro-container">
                <div className="intro-content">
                  <h1 className="title">{title}</h1>
                  {description && (
                    <div className="description">
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props, location),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {files && (
                <div className={`downloads ${themeColour}`}>
                  <ReactMarkdown
                    source={files}
                    escapeHtml={false}
                    renderers={{
                      link: props => renderLink(props, location),
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

DownloadsTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

DownloadsTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
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
      page(where: { id: $id }) {
        downloads: downloadsSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          downloadsType
          title(locale: $locale)
          files: downloads(locale: $locale)
        }
      }
    }
  }
`;

export default DownloadsTemplate;
