import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
// import Dump from '../utils/dump';
import Layout from '../components/layout';
import LinkWithPrevious from '../components/linkWithPrevious';
import { getSlug } from '../utils/functions';
import '../styles/product.scss';
import ProductShowcase from '../components/productShowcase';

const allowHTML = { html: true };

/* location prop is received from LinkWithPrevious's composition with Location */
const ProductTemplate = ({ data, location, pageContext }) => {
  const { locale, siteData, region } = pageContext;
  const {
    cms: {
      labels,
      page: {
        belongsTo,
        product: { title, marketing, advantages, features, images, productInfo, specs, youTubeIDs },
      },
    },
  } = data;
  const { common, products } = labels[0];
  let slideNum = 0;
  const slideArray = [];

  for (let i = 0; i < images.length; i += 1) {
    let element = null;
    slideNum += 1;
    const slideStyle = {
      backgroundImage: `url(${images[i].url})`,
    };
    element = (
      <React.Fragment key={slideNum}>
        <div className="slide-image" style={slideStyle} />
        {/* <div className="heading-container">
            <div className="heading">
              <Link to={location.pathname + images[i].page.slug}>
                <Markdown source={slides[i].slideText} options={{ html: true }} />
              </Link>
            </div>
          </div> */}
      </React.Fragment>
    );
    slideArray.push(element);
  }

  const theme = 'heavyweight';

  return (
    <Layout
      activeLanguage={locale}
      activeSection={belongsTo}
      childrenClass="product"
      region={region}
      title={title}
      data={siteData}
    >
      <>
        <div className="product-container">
          <div className={`title-container ${theme}`}>
            <div className="section-title">{title}</div>
          </div>
          {location.state && (
            <div className="go-back">
              <div className="link-container">
                <LinkWithPrevious to={location.state.prevLocation}>
                  <span className="back-arrow">&laquo;&nbsp;</span>
                  <span className="back-text">
                    {`${common.BACK} /${getSlug(location.state.prevLocation)}`}
                  </span>
                </LinkWithPrevious>
              </div>
            </div>
          )}
          <ProductShowcase images={images} title={title} youTubeIDs={youTubeIDs} />
          {/* <div className="showcase">
            <div className="carousel-container">
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
                renderBottomCenterControls={() => null}
                wrapAround={options.wrapAround}
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
          <div className="carousel-controls" /> */}
          {/* <Dump src={data} /> */}
          <div className="product-marketing">
            <Markdown source={marketing} options={allowHTML} />
          </div>
          {advantages && (
            <>
              <div className={`title-container ${theme}`}>
                <div className="section-title">{products.ADVANTAGES}</div>
              </div>
              <div className="product-advantages">
                <Markdown source={advantages} options={allowHTML} />
              </div>
            </>
          )}
          {(features || productInfo) && (
            <>
              <div className={`title-container ${theme}`}>
                <div className="section-title">{products.FEATURES}</div>
              </div>
              <div className="features-info-container">
                {features && (
                  <div className="product-features">
                    <Markdown source={features} options={allowHTML} />
                  </div>
                )}
                {productInfo && (
                  <div className="product-info">
                    <Markdown source={productInfo} options={allowHTML} />
                  </div>
                )}
              </div>
            </>
          )}
          {specs && (
            <>
              <div className={`title-container ${theme}`}>
                <div className="section-title">{products.SPECS}</div>
              </div>
              <div className="product-specs">
                <Markdown source={specs} options={allowHTML} />
              </div>
            </>
          )}
        </div>
      </>
    </Layout>
  );
};

ProductTemplate.defaultProps = {
  data: {},
  location: {
    state: {},
  },
  pageContext: {},
};

ProductTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      page: PropTypes.shape({}),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
    siteData: PropTypes.object,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      labels(where: { region: $region }) {
        common(locale: $locale)
        products(locale: $locale)
      }
      page(where: { id: $id }) {
        belongsTo
        pageType
        product {
          title(locale: $locale)
          marketing(locale: $locale)
          advantages(locale: $locale)
          features(locale: $locale)
          images {
            url
          }
          productInfo(locale: $locale)
          specs(locale: $locale)
          youTubeIDs
        }
      }
    }
  }
`;

export default ProductTemplate;
