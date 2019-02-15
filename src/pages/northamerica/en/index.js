import React from 'react';
import { graphql } from 'gatsby';
import HomeTemplate from '../../../templates/home-template';
import Layout from '../../../components/layout';

const Home = data => (
  <Layout
    activeLanguage="EN"
    activeSection=""
    childrenClass="home-page"
    region="NORTH_AMERICA"
    title=""
    data={data.data.cms}
  >
    <HomeTemplate data={data.data} />
  </Layout>
);

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
      homepages(where: { region: NORTH_AMERICA }) {
        heading(locale: EN)
        homepageCarouselSlides {
          asset {
            url
          }
          slideText(locale: EN)
          slideType
        }
        homepageEventTiles {
          title
          description(locale: EN)
          image {
            url
          }
        }
        homepageTiles {
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
      labels(where: { region: NORTH_AMERICA }) {
        common(locale: EN)
        header(locale: EN)
        footer(locale: EN)
      }
    }
  }
`;

export default Home;
