import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';

const AboutPage = ({ data }) => (
  <Layout activeSection="ABOUT" data={data.cms}>
    <Markdown source={data.cms.articles[0].body[0]} options={{ html: true }} />
  </Layout>
);

AboutPage.defaultProps = {
  data: {},
};

AboutPage.propTypes = {
  data: articleType,
};

export default AboutPage;

// TODO Change to CENTRAL_SOUTH_AMERICA and ES when CMS data is available

export const query = graphql`
  query {
    cms {
      articles(where: { articleType: About }) {
        articleType
        title(locale: ES)
        body(locale: ES)
      }
      headerFooters(where: { region: NORTH_AMERICA }) {
        companyAddress(locale: EN)
        companyEmail
        companyPhone
        footerLinks(locale: EN)
        formattedTagline(locale: EN)
        language
        navigation(locale: ES)
        simpleTagline(locale: EN)
        socialMedia(locale: EN)
      }
      labels(where: { region: NORTH_AMERICA }) {
        common(locale: EN)
        header(locale: EN)
        footer(locale: EN)
      }
    }
  }
`;
