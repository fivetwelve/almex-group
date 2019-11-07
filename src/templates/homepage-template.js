/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
import { Location } from '@reach/router';
import Markdown from 'react-remarkable';
import Carousel from 'nuka-carousel';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HomePageTile from '../components/homepageTile';
import Layout from '../components/layout';
import '../styles/homepage.scss';
import { createLink, makeid } from '../utils/functions';

const HomepageTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: { homepage },
    },
  } = data;

  let slideNum = 0;
  const eventStyle1 = {
    backgroundImage: `url(${homepage.homepageEventTiles[0].image.url})`,
  };
  const eventStyle2 = {
    backgroundImage: `url(${homepage.homepageEventTiles[1].image.url})`,
  };
  const eventStyle3 = {
    backgroundImage: `url(${homepage.homepageEventTiles[2].image.url})`,
  };
  const slides = homepage.homepageCarouselSlides;
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
                  <Markdown source={slides[i].slideHeading} options={{ html: true }} />
                </Link>
              </div>
            </div>
            <div className="description-container">
              <div className="description">
                <Link to={createLink(location, slides[i].page.slug)}>
                  <Markdown source={slides[i].slideText} options={{ html: true }} />
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
                  <source src={slides[0].asset.url} type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="heading-container">
              <div className="heading">
                <Link to={location.pathname + slides[i].page.slug}>
                  <Markdown source={slides[i].slideHeading} options={{ html: true }} />
                </Link>
              </div>
            </div>
            <div className="description-container">
              <div className="description">
                <Link to={`${location.pathname}/${slides[i].page.slug}`}>
                  <Markdown source={slides[i].slideText} options={{ html: true }} />
                </Link>
              </div>
            </div>
          </React.Fragment>
        );
      }
      slideArray.push(element);
    }
    return slideArray;
  };

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="homepage"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <Location>
        {({ location }) => (
          <>
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
              // renderBottomCenterControls={() => null}
              wrapAround={options.wrapAround}
            >
              {/* {slideArray} */}
              {renderSlides(location)}
            </Carousel>
            {/* <div className="tagline-anchor">
              <div className="tagline-container">
                <div className="tagline">
                  <Markdown source={headerFooter.formattedTagline} options={{ html: true }} />
                </div>
              </div>
            </div> */}
            <div className="no-bleed-container">
              <div className="tile-container">
                {homepage.homepageTiles.length > 0 &&
                  homepage.homepageTiles.map(tile => (
                    <HomePageTile data={tile} labels={label} location={location} key={makeid()} />
                  ))}
              </div>
              <div className="heading2-container">
                <div className="heading2">
                  <Markdown source={homepage.heading[1]} options={{ html: true }} />
                </div>
              </div>
              <div className="event-container">
                <div className="event1">
                  <div className="content-container">
                    <div className="event-background" style={eventStyle1} />
                    <div className="title">
                      <Markdown
                        source={homepage.homepageEventTiles[0].title}
                        options={{ html: true }}
                      />
                    </div>
                    <div className="description">
                      <Markdown
                        source={homepage.homepageEventTiles[0].description}
                        options={{ html: true }}
                      />
                    </div>
                    {homepage.homepageEventTiles[0].page && (
                      <Link to={createLink(location, homepage.homepageEventTiles[0].page.slug)}>
                        {label.common.MORE}
                      </Link>
                    )}
                    <div className="event-overlay-blue" />
                  </div>
                </div>
                <div className="event2">
                  <div className="content-container">
                    <div className="event-background" style={eventStyle2} />
                    <div className="event-overlay-gold" />
                    <div className="title">
                      <Markdown
                        source={homepage.homepageEventTiles[1].title}
                        options={{ html: true }}
                      />
                    </div>
                    <div className="description">
                      <Markdown
                        source={homepage.homepageEventTiles[1].description}
                        options={{ html: true }}
                      />
                    </div>
                    {homepage.homepageEventTiles[1].page && (
                      <Link to={createLink(location, homepage.homepageEventTiles[1].page.slug)}>
                        {label.common.MORE}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="event3" style={eventStyle3}>
                  <div className="content-container">
                    <div className="event-overlay-blue" />
                    <div className="title">
                      <Markdown
                        source={homepage.homepageEventTiles[2].title}
                        options={{ html: true }}
                      />
                    </div>
                    <div className="description">
                      <Markdown
                        source={homepage.homepageEventTiles[2].description}
                        options={{ html: true }}
                      />
                    </div>
                    {homepage.homepageEventTiles[2].page && (
                      <Link to={createLink(location, homepage.homepageEventTiles[2].page.slug)}>
                        {label.common.MORE}
                      </Link>
                    )}
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
        homepage: homepageSource {
          heading(locale: $locale)
          homepageCarouselSlides(orderBy: sort_ASC) {
            sort
            asset {
              url
            }
            page {
              slug(locale: $locale)
            }
            slideHeading(locale: $locale)
            slideText(locale: $locale)
            slideType
          }
          homepageEventTiles(orderBy: sort_ASC) {
            sort
            title
            description(locale: $locale)
            image {
              url
            }
            page {
              slug(locale: $locale)
            }
          }
          homepageTiles(orderBy: sort_ASC) {
            sort
            description(locale: $locale)
            image {
              url
            }
            title(locale: $locale)
            page {
              tile {
                url
              }
              slug(locale: $locale)
            }
          }
        }
      }
    }
  }
`;

export default HomepageTemplate;
