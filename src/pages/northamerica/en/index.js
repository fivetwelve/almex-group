import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import HomepageTemplate from '../../../templates/homepage-template';
import Layout from '../../../components/layout';

const Home = ({ data }) => (
  <Layout
    activeLanguage="EN"
    activeSection=""
    childrenClass="homepage"
    region="NORTH_AMERICA"
    title=""
    data={data.cms}
    headerFooter={data.cms.headerFooter}
    label={data.cms.label}
  >
    <Location>{({ location }) => <HomepageTemplate data={data} location={location} />}</Location>
  </Layout>
);

Home.defaultProps = {
  data: {},
};

Home.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
};

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
      homepages(where: { region: NORTH_AMERICA }) {
        heading(locale: EN)
        homepageCarouselSlides(orderBy: sort_ASC) {
          sort
          asset {
            url
          }
          page {
            slug
          }
          slideText(locale: EN)
          slideType
        }
        homepageEventTiles(orderBy: sort_ASC) {
          sort
          title
          description(locale: EN)
          image {
            url
          }
        }
        homepageTiles(orderBy: sort_ASC) {
          sort
          description(locale: EN)
          image {
            url
          }
          subtitle(locale: EN)
          title(locale: EN)
        }
        eventDescription(locale: EN)
        eventImage {
          url
        }
        eventTitle(locale: EN)
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

export default Home;
