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
  >
    <HomeTemplate data={data.data} />
  </Layout>
);

export const query = graphql`
  query {
    cms {
      labels(where: { region: NORTH_AMERICA }) {
        common(locale: EN)
        header(locale: EN)
        footer(locale: EN)
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
    }
  }
`;

export default Home;
