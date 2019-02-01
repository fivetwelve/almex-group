import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import YouTube from 'react-youtube';
import Layout from '../../../components/layout';

import '../../../styles/corporate.scss';

const allowHTML = { html: true };

const CorporatePage = ({
  data: {
    cms: { labels, articles },
  },
}) => {
  const label = labels[0];
  const article = articles[0];
  return (
    <Layout
      activeLanguage="EN"
      activeSection={article.navSection}
      childrenClass="corporate-page"
      region="NORTH_AMERICA"
      title={article.title}
    >
      <div className="banner-container">
        <h1>{article.labels.corporate}</h1>
      </div>

      <div className="breadcrumb">
        {label.header[article.navSection]} : {article.labels.corporate}
      </div>

      <div className="main-container">
        <div className="content">
          {article.youTubeId[0] && (
            <div className="video-container">
              <YouTube videoId={article.youTubeId[0]} />
            </div>
          )}
          <div className="col-container">
            <div className="col-1">
              <div className="content-1">
                <Markdown source={article.body[0]} options={allowHTML} />
              </div>
            </div>
            <div className="col-2">
              <div className="images-container">
                <img src={article.images[0].url} alt={article.imageLabels[0] || ''} />
                <img src={article.images[1].url} alt={article.imageLabels[1] || ''} />
              </div>
              <div className="content-2">
                <Markdown source={article.body[1]} options={allowHTML} />
              </div>
            </div>
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
      labels {
        header
      }
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
