/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import ReactMarkdown from 'react-markdown';
import Carousel from 'nuka-carousel';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HomePageTile from '../components/homepageTile';
import Layout from '../components/layout';
import '../styles/homepage.scss';
import { createLink, makeid, renderLink, getIPapiJson } from '../utils/functions';

const HomepageTemplate = ({ data, pageContext }) => {
  /* Ad-hoc code for adding temporary geo-filtering on homagepage carousel */
  const [isLoading, setLoadingState] = useState(true);
  const [countryPermitted, setCountryPermission] = useState(false);
  const allowedCountries = ['CA', 'US'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry =
        (navigator.cookieEnabled && localStorage.getItem('almexVisitorRegion')) || null;
      if (!savedCountry) {
        getIPapiJson()
          .then(json => {
            setCountryPermission(allowedCountries.includes(json.message.country_code));
            setLoadingState(false);
          })
          // eslint-disable-next-line no-unused-vars
          .catch(err => {
            setCountryPermission(false);
            setLoadingState(false);
          });
      } else {
        setCountryPermission(allowedCountries.includes(savedCountry));
        setLoadingState(false);
      }
    }
  }, []);
  /* end ad-hoc code */

  // if (!data.cms.page.contentSource) {
  //   throw Error(
  //     `Check the connection to homepageSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, region, localeData } = pageContext;
  const { label } = localeData;
  const { contentSource } = data.cms.page;

  let slideNum = 0;
  const eventStyle1 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[0].image.url})`,
  };
  const eventStyle2 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[1].image.url})`,
  };
  const eventStyle3 = {
    backgroundImage: `url(${contentSource.homepageEventTiles[2].image.url})`,
  };
  const slides = contentSource.homepageCarouselSlides;
  const options = {
    autoplay: true,
    autoplayInterval: 20000,
    autoGenerateStyleTag: false,
    enableKeyboardControls: true,
    frameOverflow: 'hidden',
    framePadding: '0px 0px 42% 0px',
    heightMode: 'first',
    initialSlideHeight: 536,
    wrapAround: true,
  };

  const renderSlides = location => {
    const slideArray = [];
    for (let i = 0; i < slides.length; i += 1) {
      let element = null;
      slideNum += 1;
      if (!slides[i].geoRestrict || (slides[i].geoRestrict && countryPermitted)) {
        if (slides[i].slideType === 'IMAGE') {
          const slideStyle = {
            backgroundImage: `url(${slides[i].asset.url})`,
          };
          element = (
            <React.Fragment key={slideNum}>
              <div className="slide-image" style={slideStyle} />
              <div className="heading-container">
                <div className="heading">
                  <Link to={createLink(location, slides[i].page.slug)}>
                    <ReactMarkdown>{slides[i].slideHeading}</ReactMarkdown>
                  </Link>
                </div>
              </div>
              <div className="description-container">
                <div className="description">
                  <Link to={createLink(location, slides[i].page.slug)}>
                    <ReactMarkdown
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {slides[i].slideText}
                    </ReactMarkdown>
                  </Link>
                </div>
              </div>
            </React.Fragment>
          );
        }
        if (slides[i].slideType === 'VIDEO') {
          const slideStyle = {};
          element = (
            <React.Fragment key={slideNum}>
              <div className="slide-video" style={slideStyle}>
                <div className="video-container">
                  <video width="100%" height="auto" autoPlay loop muted>
                    <source src={slides[i].asset.url} type="video/mp4" />
                  </video>
                </div>
              </div>
              <div className="heading-container">
                <div className="heading">
                  <Link to={createLink(location, slides[i].page.slug)}>
                    <ReactMarkdown>{slides[i].slideHeading}</ReactMarkdown>
                  </Link>
                </div>
              </div>
              <div className="description-container">
                <div className="description">
                  <Link to={`${location.pathname}/${slides[i].page.slug}`}>
                    <ReactMarkdown
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {slides[i].slideText}
                    </ReactMarkdown>
                  </Link>
                </div>
              </div>
            </React.Fragment>
          );
        }
      }
      if (element) {
        slideArray.push(element);
      }
    }
    return slideArray;
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
              <Carousel
                className="carousel"
                autoplay={options.autoplay}
                autoplayInterval={options.autoplayInterval}
                autoGenerateStyleTag={options.autoGenerateStyleTag}
                enableKeyboardControls={options.enableKeyboardControls}
                renderCenterLeftControls={({ previousSlide }) => (
                  <button onClick={previousSlide} type="button" className="left-controls">
                    <span className="sr-only">Previous</span>
                    <span aria-hidden="true" className="left-controls-icon">
                      <IconContext.Provider value={{ className: 'left-controls-icon' }}>
                        <FaChevronLeft aria-hidden />
                      </IconContext.Provider>
                    </span>
                  </button>
                )}
                renderCenterRightControls={({ nextSlide }) => (
                  <button onClick={nextSlide} type="button" className="right-controls">
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true" className="right-controls-icon">
                      <IconContext.Provider value={{ className: 'right-controls-icon' }}>
                        <FaChevronRight aria-hidden />
                      </IconContext.Provider>
                    </span>
                  </button>
                )}
                wrapAround={options.wrapAround}
              >
                {!isLoading && renderSlides(location)}
              </Carousel>
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
        contentSource {
          sourceType: __typename
          ... on GraphCMS_HomepageSource {
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
  }
`;

export default HomepageTemplate;
