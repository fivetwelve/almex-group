import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import TimelineManager from '../components/timelineManager';
import { renderLink } from '../utils/functions';
import '../styles/history.scss';

const HistoryTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        history: { bannerImage, title, description, events },
      },
    },
  } = data;

  events.sort((a, b) => new Date(a.sortDate) - new Date(b.sortDate));

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="history-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
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
                      source={description}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
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
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
    $region: GraphCMS_Region!
  ) {
    cms {
      ...CommonQuery
      aboutLabel: label(locales: $locale, where: { availableIn: $region }) {
        about
      }
      page(locales: $locales, where: { id: $id }) {
        history: historySource {
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
`;

export default HistoryTemplate;
