import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import LinkWithPrevious from '../components/linkWithPrevious';
import ProductShowcase from '../components/productShowcase';
import AccessoryAndRelatedTile from '../components/accessoryAndRelatedTile';
import AddOn from '../icons/addOns';
import Configuration from '../icons/configurations';
import { THEMES } from '../constants';
import { getSlug, makeid, renderLink } from '../utils/functions';
import '../styles/product.scss';

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
          caseStudies,
          configurations,
          addOns,
          accessories,
          relatedItems,
          visitResourcesForMore,
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
  const defaultColour = 'default';
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
            location={location}
            products={products}
            themeColour={themeColour}
            title={title}
            youTubeVideos={youTubeVideos}
            pdfDownloads={pdfDownloads}
            showResourcesLink={visitResourcesForMore}
          />
          <div className={`product-marketing ${themeColour}`}>
            <ReactMarkdown
              source={marketing}
              escapeHtml={false}
              renderers={{
                link: props => renderLink(props, location),
              }}
            />
          </div>
          {advantages && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ADVANTAGES}</div>
              </div>
              <div className={`product-advantages ${themeColour}`}>
                <div className="advantages-text">
                  <ReactMarkdown
                    source={advantages}
                    escapeHtml={false}
                    renderers={{
                      link: props => renderLink(props, location),
                    }}
                  />
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
                    <ReactMarkdown
                      source={features}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
                  </div>
                )}
                {productInfo && (
                  <div className={`product-info ${themeColour}`}>
                    <h4>{products.PROD_INFO}</h4>
                    <ReactMarkdown
                      source={productInfo}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
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
                <ReactMarkdown
                  source={specs}
                  escapeHtml={false}
                  renderers={{
                    link: props => renderLink(props, location),
                  }}
                />
              </div>
            </>
          )}
          {caseStudies.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.CASE_STUDIES}</div>
              </div>
              <div className={`product-case-studies ${themeColour}`}>
                {caseStudies.map(study => (
                  <div className="pdf" key={makeid()}>
                    <a href={study.url} target="_new">
                      <div className="pdf-icon" />
                      {study.documentTitle || study.fileName.split('.pdf')[0]}
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
          {configurations.length > 0 && (
            <>
              <div className={`title-container ${defaultColour}`}>
                <div className="section-title">{products.CONFIGURATIONS}</div>
              </div>
              <Configuration
                options={configurations}
                label={products}
                themeColour={defaultColour}
              />
            </>
          )}
          {addOns.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ADD_ONS}</div>
              </div>
              <AddOn options={addOns} label={products} themeColour={themeColour} />
            </>
          )}
          {accessories.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ACCESSORIES}</div>
              </div>
              <div className="product-accessories">
                {accessories.map((accessory, idx) => {
                  if (idx < 5) {
                    return (
                      <AccessoryAndRelatedTile
                        location={location}
                        slug={accessory.slug}
                        tile={accessory.tile}
                        title={accessory.title}
                        key={makeid()}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </>
          )}
          {relatedItems.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.RELATED_ITEMS}</div>
              </div>
              <div className="product-related-items">
                {relatedItems.map((relatedItem, idx) => {
                  if (idx < 5) {
                    return (
                      <AccessoryAndRelatedTile
                        location={location}
                        slug={relatedItem.slug}
                        tile={relatedItem.tile}
                        title={relatedItem.title}
                        key={makeid()}
                      />
                    );
                  }
                  return null;
                })}
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
        resourcesLink {
          slug(locale: $locale)
        }
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
          visitResourcesForMore
          marketing(locale: $locale)
          advantages(locale: $locale)
          advantagesImage {
            url
          }
          features(locale: $locale)
          productInfo(locale: $locale)
          specs(locale: $locale)
          caseStudies {
            documentTitle
            fileName
            url
          }
          configurations
          addOns
          pdfDownloads {
            fileName
            documentTitle(locale: $locale)
            resourceType
            url
          }
          attractText(locale: $locale)
          accessories(where: { status: PUBLISHED }) {
            slug(locale: $locale)
            tile {
              url
            }
            title(locale: $locale)
          }
          relatedItems(where: { status: PUBLISHED }) {
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
