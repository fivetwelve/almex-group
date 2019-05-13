import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import '../styles/history.scss';
// import { createLink, getTitle, makeid } from '../utils/functions';
import Timeline from '../components/timeline';

const allowHTML = { html: true };

const HistoryTemplate = ({ data, pageContext }) => {
  const { locale, siteData, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        history: { title, description, events },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="history"
      data={siteData}
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
          <div className="intro-container">
            <div className="intro-content">
              <h1 className="title">{title}</h1>
              <div className="description">
                <Markdown source={description} options={allowHTML} />
              </div>
            </div>
            {/* <div className="timeline">{console.log(events)}</div> */}
          </div>
          {/* <div className="timeline">
            <ul> */}
          {/* <Scrollspy onEnter={handleWaypointEnter}>
                {events.map((event, idx) => (
                  <li key={makeid()} id=""><a href="#event">{event.eventTitle}</a></li>
                  // <BlockWithRef key={makeid()} title={event.eventTitle} />
                ))}
              </Scrollspy> */}
          {/* {events.map((event, idx) => (
                <Waypoint
                  debug={true}
                  scrollableAncestor={window}
                  onEnter={props => handleWaypointEnter(props, idx)}
                  key={makeid()}
                > */}
          {/* <li key={makeid()} id=""><a href="#event">{event.eventTitle}</a></li> */}
          {/* <BlockWithRef title={event.eventTitle} ref={`block${idx}`} />
                </Waypoint>
              ))}
            </ul>
          </div> */}
          <Timeline events={events} />
          <div className="other-content">BLAH BLAH BLAH</div>
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
    siteData: PropTypes.object,
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
          # theme
          # landingSections {
          #   title(locale: $locale)
          #   pages {
          #     slug(locale: $locale)
          #     pageType
          #     product: productSource {
          #       title(locale: $locale)
          #       subtitle(locale: $locale)
          #       tileImage {
          #         url
          #       }
          #     }
          #     landing: landingSource {
          #       title(locale: $locale)
          #       subtitle(locale: $locale)
          #       tileImage {
          #         url
          #       }
          #     }
          #   }
          # }
          title(locale: $locale)
          description(locale: $locale)
          events: historicalEvents {
            date
            year
            eventTitle: title(locale: $locale)
          }
        }
      }
    }
  }
`;

export default HistoryTemplate;
