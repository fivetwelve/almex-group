import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';
import productTitle from '../../../../static/product-title.jpg';
import productAlmex from '../../../../static/product-almex.jpg';
import productDetails from '../../../../static/product-details.jpg';
import productPdfs from '../../../../static/product-pdfs.jpg';
import productPhoto from '../../../../static/product-photo.jpg';
import productFeatures from '../../../../static/product-features.mp4';

const shimStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '1280px',
  minWidth: '1280px',
  overflow: 'hidden',
  margin: '0 auto',
};

const columnStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const upperStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const animationStyle = {
  paddingLeft: '45px',
};

const detailsStyle = {};

const UBRPage = ({ data }) => (
  <Layout activeSection="PRODUCTS" data={data.cms}>
    <div style={shimStyle}>
      <div style={columnStyle}>
        <div>
          <img src={productTitle} alt="UBR Heavyweight Press" width="1280" />
        </div>
        <div style={upperStyle}>
          <div>
            <img src={productPhoto} alt="UBR Heavyweight Press" width="883" height="563" />
          </div>
          <div style={columnStyle}>
            <div style={rowStyle}>
              <div>
                <img src={productAlmex} alt="Almex" width="170" height="170" />
              </div>
              <div style={animationStyle}>
                <video width="170" height="170" autoPlay loop muted>
                  <source src={productFeatures} type="video/mp4" />
                </video>
              </div>
            </div>
            <div>
              <img src={productPdfs} alt="UBR PDFs" width="397px" height="393" />
            </div>
          </div>
        </div>
        <div style={detailsStyle}>
          <img src={productDetails} alt="UBR Details" width="1280" />
        </div>
      </div>
    </div>
  </Layout>
);

UBRPage.defaultProps = {
  data: {},
};

UBRPage.propTypes = {
  data: articleType,
};

export default UBRPage;

export const query = graphql`
  query {
    cms {
      headerFooters(where: { region: NORTH_AMERICA }) {
        companyAddress(locale: EN)
        companyEmail
        companyPhone
        footerLinks(locale: EN)
        formattedTagline(locale: EN)
        language
        navigation(locale: EN)
        simpleTagline(locale: EN)
        socialMedia(locale: EN)
      }
      labels(where: { region: NORTH_AMERICA }) {
        common(locale: EN)
        header(locale: EN)
        footer(locale: EN)
      }
      navigations(where: { availableIn: NORTH_AMERICA }) {
        availableIn
        navigationSections {
          titleEN: title(locale: EN)
          titleES: title(locale: ES)
          pages {
            slugEN: slug(locale: EN)
            slugES: slug(locale: EN)
            pageType
            article {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            industry {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            product {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            promo {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            service {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            landing {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
              landingSections {
                title(locale: EN)
                pages {
                  slug(locale: EN)
                  pageType
                  product {
                    title(locale: EN)
                    subtitle(locale: EN)
                    tileImage {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
