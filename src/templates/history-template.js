import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import TimelineManager from '../components/timelineManager';
import { renderLink } from '../utils/functions';
import '../styles/history.scss';

const HistoryTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.history) {
  //   throw Error(
  //     `Check the connection to historySource; missing localization or incorrect or publish status may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const { label } = localeData;
  const {
    cms: {
      page: {
        history: { bannerImage, title, description, events },
      },
    },
  } = data;

  events.sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="history-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="history-container">
              {bannerImage && (
                <div className="banner-wrapper">
                  <div className="banner-image">
                    <GraphImg image={bannerImage} maxWidth={1280} />
                  </div>
                </div>
              )}
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
              </div>
              <TimelineManager events={events} label={label} />
              <div className="other-content">...</div>
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

HistoryTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

HistoryTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
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
  query($id: ID!, $locales: [GraphCMS_Locale!]!) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        history: contentSource {
          sourceType: __typename
          ... on GraphCMS_HistorySource {
            bannerImage {
              handle
              width
              height
            }
            title
            description
            events: historicalEvents {
              almexEvent
              captions
              sortDate
              displayDate
              eventTitle: title
              description
              images {
                handle
                height
                width
                url
              }
            }
          }
        }
      }
    }
  }
`;

export default HistoryTemplate;
