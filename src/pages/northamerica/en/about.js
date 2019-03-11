import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../../../components/layout';
// import { articleType } from '../../../types';

const allowHTML = { html: true };

const AboutPage = ({ data }) => (
  <Layout
    activeLanguage="EN"
    activeSection="ABOUT"
    childrenClass="about"
    data={data.cms}
    region="NORTH_AMERICA"
    title={data.cms.articles[0].title}
    headerFooters={data.cms.headerFooters}
    labels={data.cms.labels}
  >
    <Markdown source={data.cms.articles[0].body[0]} options={allowHTML} />
  </Layout>
);

AboutPage.defaultProps = {
  data: {},
};

AboutPage.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
  }),
};

export default AboutPage;

export const query = graphql`
  query {
    cms {
      articles(where: { articleType: About }) {
        articleType
        title(locale: EN)
        body(locale: EN)
      }
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
      homepages(where: { region: NORTH_AMERICA }) {
        heading(locale: EN)
        homepageTiles {
          image {
            url
          }
          title(locale: EN)
          description(locale: EN)
          subtitle(locale: EN)
        }
        eventTitle(locale: EN)
        eventDescription(locale: EN)
        eventImage {
          url
        }
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
