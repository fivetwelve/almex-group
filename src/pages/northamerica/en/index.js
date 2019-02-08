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
        language
        socialMedia(locale: EN)
        tagline(locale: EN)
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
    }
  }
`;

export default Home;
