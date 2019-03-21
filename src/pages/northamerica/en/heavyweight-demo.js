import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';
import heavyweightImage from '../../../../static/almex_cat.jpg';

const shimStyle = {
  display: 'flex',
  justifyContent: 'center',
  minWidth: '1280px',
  overflow: 'hidden',
};

const HeavyweightPage = ({ data }) => (
  <Layout
    activeLanguage="EN"
    activeSection="PRODUCTS"
    childrenClass="landing"
    data={data.cms}
    region="NORTH_AMERICA"
    title="Heavyweight"
    headerFooter={data.cms.headerFooter}
    label={data.cms.label}
  >
    <div style={shimStyle}>
      <Link to="/northamerica/en/ubr/">
        <img src={heavyweightImage} alt="Heavyweight Presses" width="1280" />
      </Link>
    </div>
  </Layout>
);

HeavyweightPage.defaultProps = {
  data: {},
};

HeavyweightPage.propTypes = {
  data: articleType,
};

export default HeavyweightPage;

export const query = graphql`
  query {
    cms {
      headerFooter(where: { availableIn: NORTH_AMERICA }) {
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
      label(where: { availableIn: NORTH_AMERICA }) {
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
