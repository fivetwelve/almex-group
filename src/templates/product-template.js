import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
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
  // if (!data.cms.page.product) {
  //   throw Error(
  //     `Check the connection to productSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const { label } = localeData;
  const { common, products } = label;
  // console.log('data');
  // console.log(data);
  const {
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
  } = data.cms.page.contentSource;
  // const {
  //   cms: {
  //     page: {
  //       contentSource: {
  //         brand,
  //         theme,
  //         title,
  //         images,
  //         youTubeVideos,
  //         attractText,
  //         pdfDownloads,
  //         marketing,
  //         advantages,
  //         advantagesImage,
  //         features,
  //         productInfo,
  //         specs,
  //         caseStudies,
  //         configurations,
  //         addOns,
  //         accessories,
  //         relatedItems,
  //         visitResourcesForMore,
  //       },
  //     },
  //   },
  // } = data;
  /* availableIn_contains_some filter taken out of query so filtering here instead may help with build time */
  const regionalAccessories = accessories.filter(
    accessory => accessory.availableIn && accessory.availableIn.includes(region),
  );
  const regionalRelatedItems = relatedItems.filter(
    item => item.availableIn && item.availableIn.includes(region),
  );
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
      childrenClass="product-page"
      languages={languages}
      locale={locale}
      localeData={localeData}
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
            region={region}
          />
          <div className={`product-marketing ${themeColour}`}>
            <ReactMarkdown
              components={{
                link: props => renderLink(props, location),
              }}
            >
              {marketing}
            </ReactMarkdown>
          </div>
          {advantages && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ADVANTAGES}</div>
              </div>
              <div className={`product-advantages ${themeColour}`}>
                <div className="advantages-text">
                  <ReactMarkdown
                    remarkPlugins={[gfm]}
                    components={{
                      link: props => renderLink(props, location),
                    }}
                  >
                    {advantages}
                  </ReactMarkdown>
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
                      remarkPlugins={[gfm]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {features}
                    </ReactMarkdown>
                  </div>
                )}
                {productInfo && (
                  <div className={`product-info ${themeColour}`}>
                    <h4>{products.PROD_INFO}</h4>
                    <ReactMarkdown
                      remarkPlugins={[gfm]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {productInfo}
                    </ReactMarkdown>
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
                  remarkPlugins={[gfm]}
                  components={{
                    link: props => renderLink(props, location),
                  }}
                >
                  {specs}
                </ReactMarkdown>
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
          {regionalAccessories.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.ACCESSORIES}</div>
              </div>
              <div className="product-accessories">
                {regionalAccessories.map((accessory, idx) => {
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
          {regionalRelatedItems.length > 0 && (
            <>
              <div className={`title-container ${themeColour}`}>
                <div className="section-title">{products.RELATED_ITEMS}</div>
              </div>
              <div className="product-related-items">
                {regionalRelatedItems.map((relatedItem, idx) => {
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
      page: PropTypes.instanceOf(Object),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locales: [GraphCMS_Locale!]!) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        contentSource {
          sourceType: __typename
          ... on GraphCMS_ProductSource {
            brand
            theme
            title
            images {
              url
            }
            youTubeVideos {
              youTubeId
              title
              videoType
            }
            visitResourcesForMore
            marketing
            advantages
            advantagesImage {
              url
            }
            features
            productInfo
            specs
            caseStudies {
              documentTitle
              fileName
              url
              availableIn
            }
            configurations
            addOns
            pdfDownloads {
              id
              fileName
              documentTitle
              resourceType
              url
              availableIn
            }
            attractText
            accessories {
              availableIn
              slug
              tile {
                url
              }
              title
            }
            relatedItems {
              availableIn
              slug
              tile {
                url
              }
              title
            }
          }
        }
      }
    }
  }
`;

export default ProductTemplate;
