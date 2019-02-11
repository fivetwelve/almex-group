import React from 'react';
import { graphql } from 'gatsby';
import HomeTemplate from '../../../templates/home-template';
// import netlifyIdentity from 'netlify-identity-widget';
import Layout from '../../../components/layout';

const Home = data => (
  <Layout
    activeLanguage="ES"
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
        companyAddress(locale: ES)
        companyEmail
        companyPhone
        footerLinks(locale: ES)
        formattedTagline(locale: EN)
        language
        navigation(locale: ES)
        simpleTagline(locale: EN)
        socialMedia(locale: ES)
      }
      homepages(where: { region: NORTH_AMERICA }) {
        heading(locale: ES)
        homepageCarouselSlides {
          asset {
            url
          }
          slideText(locale: ES)
          slideType
        }
        homepageTiles {
          image {
            url
          }
          title(locale: ES)
          description(locale: ES)
          subtitle(locale: ES)
        }
        eventTitle(locale: ES)
        eventDescription(locale: ES)
        eventImage {
          url
        }
      }
      labels(where: { region: NORTH_AMERICA }) {
        common(locale: ES)
        header(locale: ES)
        footer(locale: ES)
      }
    }
  }
`;

export default Home;
