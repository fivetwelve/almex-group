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
  <Layout activeSection="PRODUCTS" data={data.cms}>
    <div style={shimStyle}>
      <Link to="northamerica/en/product">
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
    }
  }
`;
