import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import YouTube from 'react-youtube';
import Layout from '../../../components/layout';
// import { articleType } from '../../../types';

import '../../../styles/corporate.scss';

const CorporatePage = ({
  data: {
    cms: { articles },
  },
}) => {
  const article = articles[0];
  return (
    <Layout activeSection={article.navSection} childrenClass="corporate-page">
      <div className="banner-container">
        <h1>{article.labels.corporate}</h1>
      </div>
      <div className="video-container">
        <YouTube videoId={article.youTubeId[0]} />
      </div>
      <div className="main-container">
        <div className="col-1">
          <div className="content-1">
            <Markdown source={article.body[0]} />
          </div>
        </div>
        <div className="col-2">
          <div className="images-container">
            <img src={article.images[0].url} alt={article.imageLabels[0] || ''} />
            <img src={article.images[1].url} alt={article.imageLabels[1] || ''} />
          </div>
          <div className="content-2">
            <Markdown source={article.body[1]} />
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
  // data: PropTypes.shape(articleType),
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
    }
  }
`;
