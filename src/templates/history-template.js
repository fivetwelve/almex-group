import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import '../styles/history.scss';
import TimelineManager from '../components/timelineManager';

const allowHTML = { html: true };

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
      childrenClass="history"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
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
                <Markdown source={description} options={allowHTML} />
              </div>
            </div>
          </div>
          <TimelineManager events={events} label={label} />
          <div className="other-content">...</div>
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

HistoryTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

HistoryTemplate.propTypes = {
  data: PropTypes.shape({
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
      aboutLabel: label(where: { availableIn: $region }) {
        about(locale: $locale)
      }
      page(where: { id: $id }) {
        history: historySource {
          bannerImage {
            handle
            width
            height
          }
          title(locale: $locale)
          description(locale: $locale)
          events: historicalEvents {
            almexEvent
            sortDate
            displayDate(locale: $locale)
            eventTitle: title(locale: $locale)
            description(locale: $locale)
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
