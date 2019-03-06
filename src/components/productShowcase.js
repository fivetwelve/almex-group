import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';
import YouTube from 'react-youtube';
import shortid from 'shortid';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight, FaYoutube } from 'react-icons/fa';

class ProductShowcase extends React.Component {
  constructor(props) {
    super(props);
    const { images, youTubeIDs } = props;
    const slideArray = [];

    for (let i = 0; i < images.length; i += 1) {
      let slide = null;
      const slideStyle = {
        backgroundImage: `url(${images[i].url})`,
      };
      slide = <div className="slide-image" style={slideStyle} key={shortid.generate()} />;
      slideArray.push(slide);
    }

    for (let j = 0; j < youTubeIDs.length; j += 1) {
      let slide = null;

      slide = (
        <div className="video-container" key={shortid.generate()}>
          <YouTube videoId={youTubeIDs[j]} />
        </div>
      );
      slideArray.push(slide);
    }

    this.state = {
      autoGenerateStyleTag: false,
      enableKeyboardControls: true,
      slideIdx: 0,
      slideArray,
      wrapAround: true,
    };
  }

  calcSlideIndex = (currentSlide, direction) => {
    const { slideArray } = this.state;
    const len = slideArray.length;
    let slideNum = currentSlide;
    if (direction === 'NEXT') {
      slideNum += 1;
      if (slideNum === len) {
        return 0;
      }
    }
    if (direction === 'PREVIOUS') {
      slideNum -= 1;
      if (slideNum < 0) {
        return len - 1;
      }
    }
    return slideNum;
  };

  handleClickDirection = (evt, currentSlide, func, direction) => {
    const newSlide = this.calcSlideIndex(currentSlide, direction);
    func();
    this.setState({ slideIdx: newSlide });
  };

  render() {
    const { images, title, youTubeIDs } = this.props;
    const {
      autoGenerateStyleTag,
      enableKeyboardControls,
      slideIdx,
      slideArray,
      wrapAround,
    } = this.state;

    return (
      <>
        <div className="showcase">
          <div className="carousel-container">
            <Carousel
              afterSlide={slideIndex => this.setState({ slideIdx: slideIndex })}
              className="carousel"
              autoGenerateStyleTag={autoGenerateStyleTag}
              enableKeyboardControls={enableKeyboardControls}
              renderCenterLeftControls={({ currentSlide, previousSlide }) => (
                <button
                  onClick={evt =>
                    this.handleClickDirection(evt, currentSlide, previousSlide, 'PREVIOUS')
                  }
                  type="button"
                  className="left-controls"
                >
                  <span className="sr-only">Previous</span>
                  <span aria-hidden="true" className="left-controls-icon">
                    <IconContext.Provider value={{ className: 'left-controls-icon' }}>
                      <FaChevronLeft aria-hidden />
                    </IconContext.Provider>
                  </span>
                </button>
              )}
              renderCenterRightControls={({ currentSlide, nextSlide }) => (
                <button
                  onClick={evt => this.handleClickDirection(evt, currentSlide, nextSlide, 'NEXT')}
                  type="button"
                  className="right-controls"
                >
                  <span className="sr-only">Next</span>
                  <span aria-hidden="true" className="right-controls-icon">
                    <IconContext.Provider value={{ className: 'right-controls-icon' }}>
                      <FaChevronRight aria-hidden />
                    </IconContext.Provider>
                  </span>
                </button>
              )}
              renderBottomCenterControls={() => null}
              slideIndex={slideIdx}
              wrapAround={wrapAround}
            >
              {slideArray}
            </Carousel>
          </div>
          <div className="data-container">
            <div className="logo" />
            <div className="product-name">{title}</div>
            <div className="attract-loop" />
            <div className="downloads" />
          </div>
        </div>
        <div className="carousel-controls">
          {images.map((image, idx) => {
            const thumbStyle = {
              backgroundImage: `url(${images[idx].url})`,
            };
            return (
              <div
                className={`thumb-container${slideIdx === idx ? ' active' : ''}`}
                key={shortid.generate()}
                data-num={idx}
              >
                <button
                  className="thumb-image"
                  onClick={() => this.setState({ slideIdx: idx })}
                  style={thumbStyle}
                  type="button"
                />
              </div>
            );
          })}
          {youTubeIDs.map((yt, idx) => {
            const thumbStyle = {
              backgroundColor: 'var(--black)',
            };
            const thisIdx = idx + images.length;
            return (
              <div
                className={`thumb-container${slideIdx === thisIdx ? ' active' : ''}`}
                key={shortid.generate()}
                data-num={images.length + thisIdx}
              >
                <button
                  className="thumb-image"
                  onClick={() => this.setState({ slideIdx: thisIdx })}
                  style={thumbStyle}
                  type="button"
                >
                  <IconContext.Provider value={{ className: 'play-icon' }}>
                    <FaYoutube aria-hidden />
                  </IconContext.Provider>
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

ProductShowcase.defaultProps = {
  images: {},
  title: '',
  youTubeIDs: [],
};

ProductShowcase.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    }),
  ),
  title: PropTypes.string,
  youTubeIDs: PropTypes.arrayOf(PropTypes.string),
};

export default ProductShowcase;
