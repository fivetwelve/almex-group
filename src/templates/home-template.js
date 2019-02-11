/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import Carousel from 'nuka-carousel';
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
  const homepage = homepages[0];
  const label = labels[0];
  const eventStyle = {
    backgroundImage: `url(${homepage.eventImage.url})`,
  };
  const slides = homepage.homepageCarouselSlides;
  const slideArray = [];
  const options = {
    enableKeyboardControls: true,
    autoGenerateStyleTag: false,
  };

  for (let i = 0; i < slides.length; i += 1) {
    let element = null;
    slideNum += 1;
    if (slides[i].slideType === 'IMAGE') {
      const slideStyle = {
        backgroundImage: `url(${slides[i].asset.url})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '536px',
        width: '100%',
      };
      element = (
        <div className="slide" style={slideStyle} key={slideNum}>
          <div className="heading-container">
            <div className="heading">
              <Markdown source={slides[i].slideText} options={{ html: true }} />
            </div>
          </div>
        </div>
      );
    }
    if (slides[i].slideType === 'VIDEO') {
      const slideStyle = {
        height: '100%',
        width: '100%',
      };
      element = (
        <div className="slide" style={slideStyle} key={slideNum}>
          <div className="video-container">
            <video width="100%" height="auto" autoPlay loop muted>
              <source src={slides[0].asset.url} type="video/mp4" />
            </video>
            {/* <iframe
                className="embed-player slide-media"
                src="https://player.vimeo.com/video/217885864?api=1&byline=0&portrait=0&title=0&background=1&mute=1&loop=1&autoplay=0&id=217885864"
                width="980"
                height="520"
                frameBorder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowFullScreen
                title="almex-video"
              /> */}
          </div>
          <div className="heading-container">
            <div className="heading">
              <Markdown source={slides[i].slideText} options={{ html: true }} />
            </div>
          </div>
        </div>
      );
    }
    slideArray.push(element);
  }

  return (
    <>
      <Carousel
        className="carousel"
        autoGenerateStyleTag={options.autoGenerateStyleTag}
        enableKeyboardControls={options.enableKeyboardControls}
        renderCenterLeftControls={({ previousSlide }) => (
          <button onClick={previousSlide} type="button">
            {' '}
            &lt;{' '}
          </button>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <button onClick={nextSlide} type="button">
            {' '}
            &gt;{' '}
          </button>
        )}
      >
        {slideArray}
        {/* <div ref={this.carouselRef}>
            <video width="100%" height="auto" autoPlay loop muted>
              <source src={slides[0].asset.url} type="video/mp4" />
            </video>
          </div> */}
      </Carousel>
      {/* <div className="heading1-container">
          <div className="heading1">
            <Markdown source={homepage.heading[0]} options={{ html: true }} />
          </div>
        </div> */}
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
            <div className="title">
              <Markdown source={homepage.eventTitle[0]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[0]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
        <div className="event2">
          <div className="content-container">
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
        <div className="event3" style={eventStyle}>
          <div className="content-container">
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
