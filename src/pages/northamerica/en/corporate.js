import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import YouTube from 'react-youtube';
import Layout from '../../../components/layout';

import '../../../styles/corporate.scss';

const allowHTML = { html: true };

const CorporatePage = ({ data }) => {
  const { cms } = data;
  const { articles, brandNavigation, headerFooter, label, navigation } = cms;
  const article = articles[0];
  return (
    <Layout
      activeLanguage="EN"
      brandNavigation={brandNavigation}
      childrenClass="corporate-page"
      data={data.cms}
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region="NORTH_AMERICA"
      title={article.title}
    >
      <div className="banner-container">
        <h1>{article.labels.corporate}</h1>
      </div>

      <div className="breadcrumb">
        {label.header[article.navSection]} : {article.labels.corporate}
      </div>

      <div className="main-container">
        <div className="content">
          {article.youTubeId[0] && (
            <div className="video-container">
              <YouTube videoId={article.youTubeId[0]} />
            </div>
          )}
          <div className="col-container">
            <div className="col-1">
              <div className="content-1">
                <Markdown source={article.body[0]} options={allowHTML} />
              </div>
            </div>
            <div className="col-2">
              <div className="images-container">
                <img src={article.images[0].url} alt={article.imageLabels[0] || ''} />
                <img src={article.images[1].url} alt={article.imageLabels[1] || ''} />
              </div>
              <div className="content-2">
                <Markdown source={article.body[1]} options={allowHTML} />
              </div>
            </div>
          </div>
        </div>

        <div className="related">
          <a href="http://almex.com">
            <button type="button">ALMEX LOCATIONS</button>
          </a>
          <button type="button">NEWS</button>
          <button type="button">EVENTS</button>
          <button type="button">ALMEX HISTORY</button>
          <button type="button">ALMEX CAREERS</button>
          <button type="button">ALMEX HOPE</button>
        </div>
      </div>
    </Layout>
  );
};

CorporatePage.defaultProps = {
  data: {},
};

CorporatePage.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      articles: PropTypes.array,
    }),
  }),
};

export default CorporatePage;

export const query = graphql`
  query {
    cms {
      articles(where: { articleType: Corporate }) {
        articleType
        navSection
        title(locale: EN)
        body(locale: EN)
        labels(locale: EN)
        images {
          url
        }
        imageLabels(locale: EN)
        youTubeId
      }
      brandNavigation(where: { availableIn: NORTH_AMERICA }) {
        pages {
          slug(locale: EN)
          landing: landingSource {
            brand
            title(locale: EN)
          }
        }
      }
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
      navigation(where: { availableIn: NORTH_AMERICA }) {
        availableIn
        navigationSections {
          titleEN: title(locale: EN)
          titleES: title(locale: ES)
          pages {
            slugEN: slug(locale: EN)
            slugES: slug(locale: EN)
            pageType
            about: aboutSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            article: articleSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            events: eventsSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            industry: industrySource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            product: productSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            promo: promoSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            service: serviceSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
            landing: landingSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
              landingSections {
                title(locale: EN)
                pages {
                  slug(locale: EN)
                  pageType
                  product: productSource {
                    title(locale: EN)
                    subtitle(locale: EN)
                    tileImage {
                      url
                    }
                  }
                }
              }
            }
            usedEquipment: usedEquipmentSource {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
            }
          }
        }
      }
    }
  }
`;
