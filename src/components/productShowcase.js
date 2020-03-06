import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import Carousel from 'nuka-carousel';
import YouTube from 'react-youtube';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight, FaYoutube } from 'react-icons/fa';
import { createLink, makeid } from '../utils/functions';
import { RESOURCE_TYPES } from '../constants';
import ProductBrand from './productBrand';
import Attraction from './attraction';

const excludeList = [RESOURCE_TYPES.OPERATING_MANUAL, RESOURCE_TYPES.SAFETY_DATA_SHEET];

const $imageLimit = 5; // max # of images we're permitting in the gallery
const $videoLimit = 2; // max # of videos we're permitting in the gallery

class ProductShowcase extends React.Component {
  constructor(props) {
    super(props);
    const { images, youTubeVideos, pdfDownloads } = props;
    const slideArray = [];
    const pdfArray = [];
    /* ascending sort of images */
    images.sort((a, b) => {
      if (a.sortName > b.sortName) return 1;
      if (a.sortName < b.sortName) return -1;
      return 0;
    });

    /* populating carousel with images */
    for (let i = 0; i < images.length; i += 1) {
      if (i < $imageLimit) {
        const slideStyle = {
          backgroundImage: `url(${images[i].url})`,
        };
        const slide = <div className="slide-image" style={slideStyle} key={makeid()} />;
        slideArray.push(slide);
      }
    }

    /* populating carousel with YouTube video */
    for (let j = 0; j < youTubeVideos.length; j += 1) {
      if (j < $videoLimit) {
        const slide = (
          <div className="video-container" key={makeid()}>
            <YouTube videoId={youTubeVideos[j].youTubeId} opts={{ playerVars: { rel: 0 } }} />
          </div>
        );
        slideArray.push(slide);
      }
    }

    /* creating list of PDFs */
    for (let k = 0; k < pdfDownloads.length; k += 1) {
      /* if PDF type is not in the excludeList, proceed */
      if (!excludeList.includes(pdfDownloads[k].resourceType)) {
        const pdf = (
          <div className="pdf" key={makeid()}>
            <a href={pdfDownloads[k].url} target="_new" rel="nofollow noindex">
              <div className="pdf-icon" />
              {pdfDownloads[k].documentTitle || pdfDownloads[k].fileName.split('.pdf')[0]}
            </a>
          </div>
        );
        pdfArray.push(pdf);
      }
    }

    this.state = {
      autoGenerateStyleTag: false,
      enableKeyboardControls: true,
      slideIdx: 0,
      slideArray,
      sortedImages: images,
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
      label,
      locale,
      location,
      products,
      title,
      youTubeVideos,
      pdfDownloads,
      showResourcesLink,
    } = this.props;
    const {
      autoGenerateStyleTag,
      enableKeyboardControls,
      slideIdx,
      slideArray,
      sortedImages,
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
                autoGenerateStyleTag={autoGenerateStyleTag}
                className="carousel"
                enableKeyboardControls={enableKeyboardControls}
                renderCenterLeftControls={({ currentSlide, previousSlide }) => (
                  <button
                    onClick={evt =>
                      this.handleClickDirection(evt, currentSlide, previousSlide, 'PREVIOUS')
                    }
                    type="button"
                    className="left-controls"
                    aria-label=""
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
            {attractText.length > 0 && (
              <div className="attraction-container">
                <Attraction attractText={attractText} locale={locale} products={products} />
              </div>
            )}
            {pdfDownloads && <div className="pdf-downloads">{pdfArray}</div>}
            {showResourcesLink && (
              <div className="resources-link">
                <Link to={createLink(location, label.resourcesLink.slug)}>
                  {label.products.REQUEST_DOCUMENTS}
                  <div className="more-arrow">&nbsp;&raquo;</div>
                </Link>
              </div>
            )}
          </div>
        </div>
        {((sortedImages.length > 1 && youTubeVideos.length === 0) ||
          (sortedImages.length > 0 && youTubeVideos.length > 0)) && (
          <div className="carousel-controls">
            {sortedImages.map((image, idx) => {
              if (idx < $imageLimit) {
                const thumbStyle = {
                  backgroundImage: `url(${sortedImages[idx].url})`,
                };
                return (
                  <div
                    className={`thumb-container${slideIdx === idx ? ' active' : ''}`}
                    key={makeid()}
                  >
                    <button
                      className="thumb-image"
                      onClick={() => this.setState({ slideIdx: idx })}
                      style={thumbStyle}
                      type="button"
                      aria-label={label.common.VIEW_IMAGE}
                    />
                  </div>
                );
              }
              return null;
            })}
            {youTubeVideos.map((yt, idx) => {
              if (idx < $videoLimit) {
                const thumbStyle = {
                  backgroundColor: '$black',
                };
                /* we may have more images than we can display so we have to impose a limit and we check 
                   whether to use given size of images, or the limit imposed */
                const thisIdx =
                  idx + (sortedImages.length >= $imageLimit ? $imageLimit : sortedImages.length);
                return (
                  <div
                    className={`thumb-container${slideIdx === thisIdx ? ' active' : ''}`}
                    key={makeid()}
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
              }
              return null;
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
  label: {},
  locale: '',
  location: {},
  products: {},
  title: '',
  youTubeVideos: [],
  pdfDownloads: [],
  showResourcesLink: false,
};

ProductShowcase.propTypes = {
  attractText: PropTypes.arrayOf(PropTypes.string),
  brand: PropTypes.string,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    }),
  ),
  label: PropTypes.shape({
    common: PropTypes.object,
    products: PropTypes.object,
    resourcesLink: PropTypes.object,
  }),
  locale: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  products: PropTypes.shape({
    SHOULD_KNOW: PropTypes.string,
  }),
  title: PropTypes.string,
  youTubeVideos: PropTypes.arrayOf(PropTypes.object),
  pdfDownloads: PropTypes.arrayOf(
    PropTypes.shape({
      resourceType: PropTypes.string,
      documentTitle: PropTypes.string,
      fileName: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  showResourcesLink: PropTypes.bool,
};

export default ProductShowcase;
