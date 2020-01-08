import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import LinkWithPrevious from '../components/linkWithPrevious';
import ProductShowcase from '../components/productShowcase';
import Options from '../components/options';
import AccessoryAndRelatedTile from '../components/accessoryAndRelatedTile';
import { THEMES } from '../constants';
import { getSlug, makeid } from '../utils/functions';
import '../styles/product.scss';

const allowHTML = { html: true };

/* location prop is received from LinkWithPrevious's composition with Location */
const ProductTemplate = ({ data, location, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        product: {
          brand,
          theme,
          title,
          images,
          youTubeVideos,
          attractText,
          pdfDownloads,
          marketing,
          advantages,
          advantagesImage,
          features,
          productInfo,
          specs,
          configurations,
          addOns,
          accessories,
          relatedItems,
        },
      },
    },
  } = data;
  const { common, products } = label;
  const advantagesImageStyle = advantagesImage
    ? {
        backgroundImage: `url(${advantagesImage.url})`,
      }
    : '';
  let themeColour = '';
  let featuresProdInfoTitle = '';

  if (features && productInfo) {
    featuresProdInfoTitle = products.FEATURES_PROD_INFO;
  }
  if (!productInfo) {
    featuresProdInfoTitle = products.FEATURES;
  }
  if (!features) {
    featuresProdInfoTitle = products.PROD_INFO;
  }

  switch (theme) {
    case THEMES.HEAVYWEIGHT: {
      break;
    }
    case THEMES.LIGHTWEIGHT: {
      themeColour = 'teal';
      break;
    }
    case THEMES.INDUSTRIAL: {
      break;
    }
    case THEMES.FUSION_COLD: {
      break;
    }
    case THEMES.FUSION_HOT: {
      themeColour = 'orange';
      break;
    }
    case THEMES.FUSION_SPICY: {
      themeColour = 'red';
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="product-page"
      headerFooter={headerFooter}
      label={label}
      locale={locale}
      navigation={navigation}
      region={region}
      title={title}
    >
      <>
        <div className="product-container">
          <div className={`title-container ${themeColour}`}>
            <div className="section-title">{title}</div>
          </div>
          {location && location.state && location.state.prevLocation && (
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
          <ProductShowcase
            attractText={attractText}
            brand={brand}
            images={images}
            label={label}
            locale={locale}
            products={products}
            themeColour={themeColour}
            title={title}
            youTubeVideos={youTubeVideos}
            pdfDownloads={pdfDownloads}
          />
          <div className={`product-marketing ${themeColour}`}>
            <Markdown source={marketing} options={allowHTML} />
          </div>
          {advantages && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ADVANTAGES}</div>
              </div>
              <div className={`product-advantages ${themeColour}`}>
                <div className="advantages-text">
                  <Markdown source={advantages} options={allowHTML} />
                </div>
                {advantagesImage && (
                  <div className="advantages-image" style={advantagesImageStyle} />
                )}
              </div>
            </>
          )}
          {(features || productInfo) && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{featuresProdInfoTitle}</div>
              </div>
              <div className="features-info-container">
                {features && (
                  <div className={`product-features ${themeColour}`}>
                    <h4>{products.FEATURES}</h4>
                    <Markdown source={features} options={allowHTML} />
                  </div>
                )}
                {productInfo && (
                  <div className={`product-info ${themeColour}`}>
                    <h4>{products.PROD_INFO}</h4>
                    <Markdown source={productInfo} options={allowHTML} />
                  </div>
                )}
              </div>
            </>
          )}
          {specs && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.SPECS}</div>
              </div>
              <div className={`product-specs ${themeColour}`}>
                <Markdown source={specs} options={allowHTML} />
              </div>
            </>
          )}
          {configurations && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.CONFIGURATIONS}</div>
              </div>
              <div className={`product-configurations ${themeColour}`}>
                <Markdown source={configurations} options={allowHTML} />
              </div>
            </>
          )}
          {addOns.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ADD_ONS}</div>
              </div>
              <Options options={addOns} label={products} themeColour={themeColour} />
            </>
          )}
          {accessories.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ACCESSORIES}</div>
              </div>
              <div className="product-accessories">
                {accessories.map(accessory => (
                  <AccessoryAndRelatedTile
                    location={location}
                    slug={accessory.slug}
                    tile={accessory.tile}
                    title={accessory.title}
                    key={makeid()}
                  />
                ))}
              </div>
            </>
          )}
          {relatedItems.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.RELATED_ITEMS}</div>
              </div>
              <div className="product-related-items">
                {relatedItems.map(relatedItem => (
                  <AccessoryAndRelatedTile
                    location={location}
                    slug={relatedItem.slug}
                    tile={relatedItem.tile}
                    title={relatedItem.title}
                    key={makeid()}
                  />
                ))}
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
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
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
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      label(where: { availableIn: $region }) {
        products(locale: $locale)
      }
      page(where: { id: $id }) {
        pageType
        product: productSource {
          brand
          theme
          title(locale: $locale)
          images {
            url
            sortName
          }
          youTubeVideos {
            youTubeId
            title(locale: $locale)
            videoType
          }
          marketing(locale: $locale)
          advantages(locale: $locale)
          advantagesImage {
            url
          }
          features(locale: $locale)
          productInfo(locale: $locale)
          specs(locale: $locale)
          configurations(locale: $locale)
          addOns
          pdfDownloads(locale: $locale) {
            fileName
            documentTitle(locale: $locale)
            url
          }
          attractText(locale: $locale)
          accessories {
            slug(locale: $locale)
            tile {
              url
            }
            title(locale: $locale)
          }
          relatedItems {
            slug(locale: $locale)
            tile {
              url
            }
            title(locale: $locale)
          }
        }
      }
    }
  }
`;

export default ProductTemplate;
