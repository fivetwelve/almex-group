/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Markdown from 'react-remarkable';
import Carousel from 'nuka-carousel';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HomePageTile from '../components/homepageTile';
// import Dump from '../utils/dump';
import '../styles/homepage.scss';

const HomepageTemplate = ({
  data: {
    cms: { headerFooters, homepages, labels },
  },
  location,
}) => {
  let slideNum = 0;
  let tileNum = 0;
  const headerFooter = headerFooters[0];
  const homepage = homepages[0];
  const label = labels[0];
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
  const slideArray = [];
  const options = {
    autoGenerateStyleTag: false,
    enableKeyboardControls: true,
    frameOverflow: 'hidden',
    framePadding: '0px 0px 42% 0px',
    heightMode: 'first',
    initialSlideHeight: 536,
    wrapAround: true,
  };

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
              <Link to={location.pathname + slides[i].page.slug}>
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
                <Markdown source={slides[i].slideText} options={{ html: true }} />
              </Link>
            </div>
          </div>
        </React.Fragment>
      );
    }
    slideArray.push(element);
  }

  return (
    <div className="homepage">
      <Carousel
        className="carousel"
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
        {slideArray}
      </Carousel>
      <div className="tagline-anchor">
        <div className="tagline-container">
          <div className="tagline">
            <Markdown source={headerFooter.formattedTagline} options={{ html: true }} />
          </div>
        </div>
      </div>
      <div className="tile-container">
        {homepage.homepageTiles.length > 0 &&
          homepage.homepageTiles.map(tile => {
            tileNum += 1;
            return <HomePageTile data={tile} labels={label} key={`tile-${tileNum}`} />;
          })}
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
              <Markdown source={homepage.homepageEventTiles[0].title} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown
                source={homepage.homepageEventTiles[0].description}
                options={{ html: true }}
              />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
            <div className="event-overlay-blue" />
          </div>
        </div>
        <div className="event2">
          <div className="content-container">
            <div className="event-background" style={eventStyle2} />
            <div className="event-overlay-gold" />
            <div className="title">
              <Markdown source={homepage.homepageEventTiles[1].title} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown
                source={homepage.homepageEventTiles[1].description}
                options={{ html: true }}
              />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
        <div className="event3" style={eventStyle3}>
          <div className="content-container">
            <div className="event-overlay-blue" />
            <div className="title">
              <Markdown source={homepage.homepageEventTiles[2].title} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown
                source={homepage.homepageEventTiles[2].description}
                options={{ html: true }}
              />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

HomepageTemplate.defaultProps = {
  data: {},
  location: {},
};

HomepageTemplate.propTypes = {
  data: PropTypes.shape({
    tagLine: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default HomepageTemplate;