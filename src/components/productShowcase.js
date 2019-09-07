import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';
import YouTube from 'react-youtube';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight, FaYoutube } from 'react-icons/fa';
import { makeid } from '../utils/functions';
import ProductBrand from './productBrand';
import Attraction from './attraction';

class ProductShowcase extends React.Component {
  constructor(props) {
    super(props);
    const { images, youTubeVideos, pdfDownloads } = props;
    const slideArray = [];
    const pdfArray = [];

    /* ascending sort of images */
    images.sort((a, b) => (a.sortName < b.sortName ? -1 : 1));

    /* populating carousel with images */
    for (let i = 0; i < images.length; i += 1) {
      const slideStyle = {
        backgroundImage: `url(${images[i].url})`,
      };
      const slide = <div className="slide-image" style={slideStyle} key={makeid()} />;
      slideArray.push(slide);
    }

    /* populating carousel with YouTube video */
    for (let j = 0; j < youTubeVideos.length; j += 1) {
      const slide = (
        <div className="video-container" key={makeid()}>
          <YouTube videoId={youTubeVideos[j].youTubeId} />
        </div>
      );
      slideArray.push(slide);
    }

    /* creating list of PDFs */
    for (let k = 0; k < pdfDownloads.length; k += 1) {
      const pdf = (
        <div className="pdf" key={makeid()}>
          <a href={pdfDownloads[k].url} target="_new">
            <div className="pdf-icon" />
            {pdfDownloads[k].documentTitle || pdfDownloads[k].fileName}
          </a>
        </div>
      );
      pdfArray.push(pdf);
    }

    this.state = {
      autoGenerateStyleTag: false,
      enableKeyboardControls: true,
      slideIdx: 0,
      slideArray,
      pdfArray,
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
      attractText,
      brand,
      images,
      locale,
      products,
      // themeColour,
      // subtitle,
      title,
      youTubeVideos,
      pdfDownloads,
    } = this.props;
    const {
      autoGenerateStyleTag,
      enableKeyboardControls,
      slideIdx,
      slideArray,
      pdfArray,
      wrapAround,
    } = this.state;

    return (
      <>
        <div className="showcase">
          <div className="carousel-container">
            {slideArray.length === 1 && <div className="carousel">{slideArray}</div>}
            {slideArray.length > 1 && (
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
            )}
          </div>
          <div className="data-container">
            {brand && <ProductBrand brand={brand} />}
            <div className="product-title">{title}</div>
            {/* <div className={`product-subtitle ${themeColour}`}>{subtitle}</div> */}
            {attractText.length > 0 && (
              <div className="attraction-container">
                <Attraction attractText={attractText} locale={locale} products={products} />
              </div>
            )}
            {pdfDownloads && <div className="pdf-downloads">{pdfArray}</div>}
          </div>
        </div>
        {((images.length > 1 && youTubeVideos.length === 0) ||
          (images.length > 0 && youTubeVideos.length > 0)) && (
          <div className="carousel-controls">
            {images.map((image, idx) => {
              const thumbStyle = {
                backgroundImage: `url(${images[idx].url})`,
              };
              return (
                <div
                  className={`thumb-container${slideIdx === idx ? ' active' : ''}`}
                  key={makeid()}
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
            {youTubeVideos.map((yt, idx) => {
              const thumbStyle = {
                backgroundColor: '$black',
              };
              const thisIdx = idx + images.length;
              return (
                <div
                  className={`thumb-container${slideIdx === thisIdx ? ' active' : ''}`}
                  key={makeid()}
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
        )}
      </>
    );
  }
}

ProductShowcase.defaultProps = {
  attractText: [],
  brand: '',
  images: [],
  locale: '',
  products: {},
  // themeColour: '',
  // subtitle: '',
  title: '',
  youTubeVideos: [],
  pdfDownloads: [],
};

ProductShowcase.propTypes = {
  attractText: PropTypes.arrayOf(PropTypes.string),
  brand: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    }),
  ),
  locale: PropTypes.string,
  products: PropTypes.shape({
    SHOULD_KNOW: PropTypes.string,
  }),
  // themeColour: PropTypes.string,
  // subtitle: PropTypes.string,
  title: PropTypes.string,
  youTubeVideos: PropTypes.arrayOf(PropTypes.object),
  pdfDownloads: PropTypes.arrayOf(
    PropTypes.shape({
      documentTitle: PropTypes.string,
      fileName: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
};

export default ProductShowcase;
