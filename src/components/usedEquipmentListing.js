import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';
import Markdown from 'react-remarkable';
import shortid from 'shortid';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import defaultImage from '../../static/img/icon-used-wide.svg';

const allowHTML = { html: true };

class UsedEquipmentListing extends React.Component {
  constructor(props) {
    super(props);
    const slideArray = [];
    const { images } = props;

    // /* populating carousel with images */
    if (images.length === 0) {
      const defaultPlaceholder = {
        url: defaultImage,
      };
      images.push(defaultPlaceholder);
    }
    for (let i = 0; i < images.length; i += 1) {
      const slideStyle = {
        backgroundImage: `url(${images[i].url})`,
      };
      const slide = <div className="slide-image" style={slideStyle} key={shortid.generate()} />;
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
    const {
      contactInformation,
      date,
      equipmentDescription,
      images,
      modelNumber,
      title,
    } = this.props;
    const {
      autoGenerateStyleTag,
      enableKeyboardControls,
      slideIdx,
      slideArray,
      wrapAround,
    } = this.state;

    return (
      <>
        <div className="listing">
          <div className="carousel-container">
            <Carousel
              afterSlide={slideIndex => this.setState({ slideIdx: slideIndex })}
              className="carousel"
              autoGenerateStyleTag={autoGenerateStyleTag}
              enableKeyboardControls={enableKeyboardControls}
              renderCenterLeftControls={({ currentSlide, previousSlide }) => {
                if (slideArray.length <= 1) {
                  return null;
                }
                return (
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
                );
              }}
              renderCenterRightControls={({ currentSlide, nextSlide }) => {
                if (slideArray.length <= 1) {
                  return null;
                }
                return (
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
                );
              }}
              renderBottomCenterControls={() => null}
              slideIndex={slideIdx}
              wrapAround={wrapAround}
            >
              {slideArray}
            </Carousel>
          </div>
          <div className="details-and-controls">
            <div className="date">{moment(date).format('MMMM DD, YYYY')}</div>
            <div className="used-icon" aria-hidden="true" />
            <div className="title">{title}</div>
            <div className="model-number">{modelNumber}</div>
            <div className="contact-info">
              <Markdown source={contactInformation} options={allowHTML} />
            </div>
            {slideArray.length > 1 && (
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
              </div>
            )}
          </div>
        </div>
        <div className="listing-specs">
          <div className="listing-description">
            <Markdown source={equipmentDescription} allowHTML={allowHTML} />
          </div>
        </div>
      </>
    );
  }
}

UsedEquipmentListing.defaultProps = {
  contactInformation: '',
  date: '',
  equipmentDescription: '',
  images: [],
  modelNumber: '',
  title: '',
};

UsedEquipmentListing.propTypes = {
  contactInformation: PropTypes.string,
  date: PropTypes.string,
  equipmentDescription: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    }),
  ),
  modelNumber: PropTypes.string,
  title: PropTypes.string,
};

export default UsedEquipmentListing;
