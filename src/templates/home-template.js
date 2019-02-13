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
import '../styles/home.scss';

const HomeTemplate = ({
  data: {
    cms: { homepages, labels },
  },
}) => {
  let slideNum = 0;
  let tileNum = 0;
  // const headerFooter = headerFooters[0];
  const homepage = homepages[0];
  const label = labels[0];
  const eventStyle1 = {
    backgroundImage: `url(${homepage.eventImage[0].url})`,
  };
  const eventStyle2 = {
    backgroundImage: `url(${homepage.eventImage[1].url})`,
  };
  const eventStyle3 = {
    backgroundImage: `url(${homepage.eventImage[2].url})`,
  };
  const slides = homepage.homepageCarouselSlides;
  const slideArray = [];
  const options = {
    autoGenerateStyleTag: false,
    enableKeyboardControls: true,
    frameOverflow: 'hidden',
    framePadding: '0px 0px 42% 0px',
    heightMode: 'first',
    initialSlideHeight: 1,
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
        <div className="slide-image" style={slideStyle} key={slideNum}>
          <div className="heading-container">
            <div className="heading">
              <Link to="northamerica/en/heavyweight">
                <Markdown source={slides[i].slideText} options={{ html: true }} />
              </Link>
            </div>
          </div>
        </div>
      );
    }
    if (slides[i].slideType === 'VIDEO') {
      const slideStyle = {
        // height: '100%',
        // width: '100%',
      };
      element = (
        <div className="slide-video" style={slideStyle} key={slideNum}>
          <div className="video-container">
            {/* TODO set this back to autoPlay */}
            <video width="100%" height="auto" autoPlay loop muted>
              <source src={slides[0].asset.url} type="video/mp4" />
            </video>
          </div>
          <div className="heading-container">
            <div className="heading">
              <Link to="northamerica/en/heavyweight">
                <Markdown source={slides[i].slideText} options={{ html: true }} />
              </Link>
            </div>
          </div>
        </div>
      );
    }
    slideArray.push(element);
  }

  return (
    <>
      {/* <div className="carousel-container"> */}
      <Carousel
        className="carousel"
        autoGenerateStyleTag={options.autoGenerateStyleTag}
        enableKeyboardControls={options.enableKeyboardControls}
        // frameOverflow={options.frameOverflow}
        // framePadding={options.framePadding}
        // heightMode={options.heightMode}
        renderCenterLeftControls={({ previousSlide }) => (
          <button onClick={previousSlide} type="button" className="left-controls">
            {/* <IconContext.Provider value={{ className: 'left' }}>
                  {(clicked && <FaChevronUp aria-hidden />) || <FaChevronDown aria-hidden />}
                </IconContext.Provider> */}
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
      {/* <div className="tagline-anchor">
          <div className="tagline-container">
            <div className="tagline">
              <Markdown source={headerFooter.formattedTagline} options={{ html: true }} />
            </div>
          </div>
        </div> */}
      {/* </div> */}
      {/* <Dump src={homepage} /> */}
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
            <div className="event-background" style={eventStyle2} />
            <div className="title">
              <Markdown source={homepage.eventTitle[0]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[0]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
            <div className="event-overlay-blue" />
          </div>
        </div>
        <div className="event2">
          <div className="content-container">
            <div className="event-background" style={eventStyle3} />
            <div className="event-overlay-gold" />
            <div className="title">
              <Markdown source={homepage.eventTitle[1]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[1]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
        <div className="event3" style={eventStyle1}>
          <div className="content-container">
            <div className="event-overlay-blue" />
            <div className="title">
              <Markdown source={homepage.eventTitle[2]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[2]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

HomeTemplate.defaultProps = {
  data: {},
};

HomeTemplate.propTypes = {
  data: PropTypes.shape({
    tagLine: PropTypes.string,
  }),
};

export default HomeTemplate;
