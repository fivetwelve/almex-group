import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import 'moment/locale/es';
import Layout from '../components/layout';
import { DOWNLOAD_TYPES } from '../constants';
import '../styles/downloads.scss';

const allowHTML = { html: true };

const DownloadsTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      // aboutLabel,
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
      childrenClass="downloads"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
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
                  <Markdown source={description} options={allowHTML} />
                </div>
              )}
            </div>
          </div>
          {files && (
            <div className={`downloads ${themeColour}`}>
              {/* {files.map(downloadGroup => ( */}
              {/* <div key={makeid()} className={`category ${themeColour}`}> */}
              <Markdown source={files} options={allowHTML} />
              {/* </div> */}
              {/* ))} */}
            </div>
          )}
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

DownloadsTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

DownloadsTemplate.propTypes = {
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
