import React from 'react';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import YouTube from 'react-youtube';
import Layout from '../../../components/layout';
import { articleType } from '../../../types';

import '../../../styles/corporate.scss';

const CorporatePage = ({
  data: {
    cms: { articles },
  },
}) => (
  <Layout activeTab={articles[0].navCategory} childrenClass="corporate-page">
    <div className="video-container">
      <YouTube videoId={articles[0].youTubeId} />
    </div>
    <div className="content0">
      <Markdown source={articles[0].body[0]} />
    </div>
    <div className="images-container">
      <img src={articles[0].images[0].url} alt={articles[0].imagesAlt[0] || ''} />
      <img src={articles[0].images[1].url} alt={articles[0].imagesAlt[1] || ''} />
    </div>
    <div className="content1">
      <Markdown source={articles[0].body[1]} />
    </div>
  </Layout>
);

CorporatePage.defaultProps = {
  data: {},
};

CorporatePage.propTypes = {
  data: articleType,
};

export default CorporatePage;

export const query = graphql`
  query {
    cms {
      articles(where: { articleCategory: Corporate }) {
        articleCategory
        navCategory
        title(locale: EN)
        body(locale: EN)
        images {
          url
        }
        imagesAlt(locale: EN)
        youTubeId
      }
    }
  }
`;
