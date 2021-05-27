import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import { renderLink } from '../utils/functions';
import '../styles/simpleContent.scss';

const SimpleContentTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.simpleContent) {
  //   throw Error(
  //     `Check the connection to simpleContentSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  // const { brandNavigation, headerFooter, navigation } = localeData;
  const {
    cms: {
      // label,
      page: {
        simpleContent: { bannerImage, content, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="simple-content-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
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
                    <ReactMarkdown
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {content}
                    </ReactMarkdown>
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

SimpleContentTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

SimpleContentTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.instanceOf(Object),
    // id: PropTypes.string,
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
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        simpleContent: contentSource {
          ... on simpleContentSource {
            bannerImage {
              handle
              width
              height
            }
            content
            title
          }
        }
      }
    }
  }
`;

export default SimpleContentTemplate;
