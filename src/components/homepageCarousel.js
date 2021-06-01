import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ReactMarkdown from 'react-markdown';
import Carousel from 'nuka-carousel';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { createLink, renderLink, getIPapiJson } from '../utils/functions';
import '../styles/homepageTile.scss';

const HomepageCarousel = ({ contentSource, location }) => {
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

  let slideNum = 0;

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

  const renderSlideAndLink = slide => {
    const { asset, page, slideType, url } = slide;
    const slideStyle =
      slideType === 'IMAGE'
        ? {
            backgroundImage: `url(${asset.url})`,
          }
        : {};

    const slideContent =
      slideType === 'IMAGE' ? (
        <div className="slide-image" style={slideStyle} />
      ) : (
        <div className="slide-video" style={slideStyle}>
          <div className="video-container">
            <video width="100%" height="auto" autoPlay loop muted>
              <source src={asset.url} type="video/mp4" />
            </video>
          </div>
        </div>
      );

    if (page) {
      return <Link to={createLink(location, page.slug)}>{slideContent}</Link>;
    }
    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer nofollow noindex">
          {slideContent}
        </a>
      );
    }
    return { slideContent };
  };

  const renderDescAndLink = slide => {
    const { page, slideText, url } = slide;
    if (page) {
      return (
        <Link to={createLink(location, page.slug)}>
          <ReactMarkdown
            components={{
              link: props => renderLink(props, location),
            }}
          >
            {slideText}
          </ReactMarkdown>
        </Link>
      );
    }
    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer nofollow noindex">
          <ReactMarkdown
            components={{
              link: props => renderLink(props, location),
            }}
          >
            {slideText}
          </ReactMarkdown>
        </a>
      );
    }
    return (
      <ReactMarkdown
        components={{
          link: props => renderLink(props, location),
        }}
      >
        {slideText}
      </ReactMarkdown>
    );
  };

  const renderSlides = () => {
    const slideArray = [];
    for (let i = 0; i < slides.length; i += 1) {
      let element = null;
      slideNum += 1;
      if (!slides[i].geoRestrict || (slides[i].geoRestrict && countryPermitted)) {
        if (slides[i].slideType === 'IMAGE') {
          element = (
            <React.Fragment key={slideNum}>
              {renderSlideAndLink(slides[i])}
              <div className="heading-container">
                <div className="heading">
                  <ReactMarkdown>{slides[i].slideHeading}</ReactMarkdown>
                </div>
              </div>
              <div className="description-container">
                <div className="description">{renderDescAndLink(slides[i])}</div>
              </div>
            </React.Fragment>
          );
        }
        if (slides[i].slideType === 'VIDEO') {
          element = (
            <React.Fragment key={slideNum}>
              {renderSlideAndLink(slides[i])}
              <div className="heading-container">
                <div className="heading">
                  <ReactMarkdown>{slides[i].slideHeading}</ReactMarkdown>
                </div>
              </div>
              <div className="description-container">
                <div className="description">{renderDescAndLink(slides[i])}</div>
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

  return (
    <Carousel
      className="carousel"
      autoplay={options.autoplay}
      autoplayInterval={options.autoplayInterval}
      autoGenerateStyleTag={options.autoGenerateStyleTag}
      dragging={false}
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
  );
};

HomepageCarousel.defaultProps = {
  contentSource: {},
  location: {},
};

HomepageCarousel.propTypes = {
  contentSource: PropTypes.shape({
    homepageCarouselSlides: PropTypes.instanceOf(Array),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default HomepageCarousel;
