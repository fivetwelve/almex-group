import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import LinkWithPrevious from '../components/linkWithPrevious';
import ProductShowcase from '../components/productShowcase';
import Options from '../components/options';
import AccessoryAndRelatedTile from '../components/accessoryAndRelatedTile';
import { allThemes } from '../constants';
import { getSlug, makeid } from '../utils/functions';
import '../styles/product.scss';

const allowHTML = { html: true };

/* location prop is received from LinkWithPrevious's composition with Location */
const ProductTemplate = ({ data, location, pageContext }) => {
  const { locale, siteData, region } = pageContext;
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
          subtitle,
          images,
          youTubeIDs,
          attractText,
          pdfDownloads,
          pdfTitles,
          marketing,
          advantages,
          advantagesImage,
          features,
          productInfo,
          specs,
          options,
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
    case allThemes.HEAVYWEIGHT: {
      break;
    }
    case allThemes.LIGHTWEIGHT: {
      themeColour = 'teal';
      break;
    }
    case allThemes.INDUSTRIAL: {
      break;
    }
    case allThemes.FUSION_COLD: {
      break;
    }
    case allThemes.FUSION_HOT: {
      themeColour = 'orange';
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
      childrenClass="product"
      data={siteData}
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
            locale={locale}
            products={products}
            themeColour={themeColour}
            title={title}
            subtitle={subtitle}
            youTubeIDs={youTubeIDs}
            pdfDownloads={pdfDownloads}
            pdfTitles={pdfTitles}
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
          {options && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.OPTIONS}</div>
              </div>
              <Options options={options} label={products} themeColour={themeColour} />
            </>
          )}
          {accessories && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ACCESSORIES}</div>
              </div>
              <div className="product-accessories">
                {accessories.map(accessory => (
                  <AccessoryAndRelatedTile
                    image={accessory.productSource.thumbnail}
                    location={location}
                    slug={accessory.slug}
                    title={accessory.productSource.title}
                    key={makeid()}
                  />
                ))}
              </div>
              {/* {console.log(accessories)} */}
            </>
          )}
          {relatedItems && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.RELATED_ITEMS}</div>
              </div>
              <div className="product-related-items">
                {relatedItems.map(relatedItem => (
                  <AccessoryAndRelatedTile
                    image={relatedItem.productSource.thumbnail}
                    location={location}
                    slug={relatedItem.slug}
                    title={relatedItem.productSource.title}
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
      ...CommonQuery
      label(where: { availableIn: $region }) {
        products(locale: $locale)
      }
      page(where: { id: $id }) {
        # belongsTo
        pageType
        product: productSource {
          brand
          theme
          title(locale: $locale)
          subtitle(locale: $locale)
          images {
            url
          }
          youTubeIDs
          marketing(locale: $locale)
          advantages(locale: $locale)
          advantagesImage {
            url
          }
          features(locale: $locale)
          productInfo(locale: $locale)
          specs(locale: $locale)
          options
          pdfDownloads(locale: $locale) {
            fileName
            url
          }
          pdfTitles(locale: $locale)
          attractText
          accessories {
            slug
            productSource {
              title(locale: $locale)
              thumbnail {
                url
              }
            }
          }
          relatedItems {
            slug
            productSource {
              title(locale: $locale)
              thumbnail {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export default ProductTemplate;
