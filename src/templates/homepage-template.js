/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import ReactMarkdown from 'react-markdown';
import HomepageCarousel from '../components/homepageCarousel';
import HomePageTile from '../components/homepageTile';
import Layout from '../components/layout';
import '../styles/homepage.scss';
import { createLink, makeid, renderLink } from '../utils/functions';

const HomepageTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.contentSource) {
  //   throw Error(
  //     `Check the connection to homepageSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, region, localeData } = pageContext;
  const { label } = localeData;
  const { contentSource } = data.cms.page;

  const eventStyle1 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[0].image.url})`,
  };
  const eventStyle2 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[1].image.url})`,
  };
  const eventStyle3 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[2].image.url})`,
  };

  const eventLink = (eventTile, location) => {
    if (eventTile.page && eventTile.page.slug) {
      return (
        <Link to={createLink(location, eventTile.page.slug)} className="event-more">
          {label.common.MORE}
        </Link>
      );
    }
    if (eventTile.externalLink) {
      return (
        <a
          href={eventTile.externalLink}
          className="event-more"
          target="_blank"
          rel="noopener noreferrer nofollow noindex"
        >
          {label.common.MORE}
        </a>
      );
    }
    return null;
  };

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="homepage"
      languages={languages}
      localeData={localeData}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
            <div className="carousel-container">
              <HomepageCarousel contentSource={contentSource} location={location} />
            </div>
            <div className="no-bleed-container">
              <div className="tile-container">
                {contentSource.homepageTiles.length > 0 &&
                  contentSource.homepageTiles.map(tile => (
                    <HomePageTile data={tile} label={label} location={location} key={makeid()} />
                  ))}
              </div>
              <div className="heading2-container">
                <div className="heading2">
                  <ReactMarkdown>{contentSource.heading[1]}</ReactMarkdown>
                </div>
              </div>
              <div className="event-container">
                <div className="event1">
                  <div className="content-container">
                    <div className="event-background" style={eventStyle1} />
                    <div className="title">
                      <ReactMarkdown>{contentSource.homepageEventTiles[0].title}</ReactMarkdown>
                    </div>
                    <div className="description">
                      <ReactMarkdown
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {contentSource.homepageEventTiles[0].description}
                      </ReactMarkdown>
                    </div>
                    {eventLink(contentSource.homepageEventTiles[0], location)}
                    <div className="event-overlay-blue" />
                  </div>
                </div>
                <div className="event2">
                  <div className="content-container">
                    <div className="event-background" style={eventStyle2} />
                    <div className="event-overlay-gold" />
                    <div className="title">
                      <ReactMarkdown>{contentSource.homepageEventTiles[1].title}</ReactMarkdown>
                    </div>
                    <div className="description">
                      <ReactMarkdown
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {contentSource.homepageEventTiles[1].description}
                      </ReactMarkdown>
                    </div>
                    {eventLink(contentSource.homepageEventTiles[1], location)}
                  </div>
                </div>
                <div className="event3" style={eventStyle3}>
                  <div className="content-container">
                    <div className="event-overlay-blue" />
                    <div className="title">
                      <ReactMarkdown>{contentSource.homepageEventTiles[2].title}</ReactMarkdown>
                    </div>
                    <div className="description">
                      <ReactMarkdown
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {contentSource.homepageEventTiles[2].description}
                      </ReactMarkdown>
                    </div>
                    {eventLink(contentSource.homepageEventTiles[2], location)}
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

HomepageTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

HomepageTemplate.propTypes = {
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
  query(
    $id: ID!
    # $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        contentSource: homepageSource {
          heading
          homepageCarouselSlides {
            geoRestrict
            asset {
              url
            }
            page {
              slug
            }
            slideHeading
            slideText
            slideType
            url
          }
          homepageEventTiles {
            title
            description
            image {
              url
            }
            page {
              slug
            }
            externalLink
          }
          homepageTiles {
            description
            image {
              url
            }
            title
            page {
              tile {
                url
              }
              slug
            }
          }
        }
      }
    }
  }
`;

export default HomepageTemplate;
