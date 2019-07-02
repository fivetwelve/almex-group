import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import moment from 'moment';
import 'moment/locale/es';
import Layout from '../components/layout';
import { makeid, matchMomentLocale } from '../utils/functions';
import { STATUS } from '../constants';
import '../styles/news.scss';

const allowHTML = { html: true };

const NewsTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        news: { articles, bannerImage, description, title },
      },
    },
  } = data;
  const [articleNum, setArticleNum] = useState(0);

  moment.locale(matchMomentLocale(locale));

  /* sort articles in descending date order */
  const published = articles.filter(article => article.status === STATUS.PUBLISHED);
  const archived = articles.filter(article => article.status === STATUS.ARCHIVED);
  published.sort((a, b) => new Date(b.date) - new Date(a.date));
  archived.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="news"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
      <>
        <div className="news-container">
          {bannerImage && (
            <div className="banner-wrapper">
              <div className="banner-image">
                <GraphImg image={bannerImage} maxWidth={1280} />
              </div>
            </div>
          )}
          <div className="intro-container">
            <div className="intro-content">
              <h1 className="title">{title}</h1>
              {description && (
                <div className="description">
                  <Markdown source={description} options={allowHTML} />
                </div>
              )}
            </div>
          </div>
          {published.length > 0 && (
            <>
              <hr className="divider" />
              <div className="article-container">
                <p>{moment(published[articleNum].date).format('LL')}</p>
                <Markdown source={published[articleNum].content} options={allowHTML} />
              </div>
              <hr className="divider" />
              <div className="tile-container">
                {published.map((article, idx) => (
                  <button
                    className={idx === articleNum ? 'active' : ''}
                    key={makeid()}
                    type="button"
                    onClick={() => setArticleNum(idx)}
                  >
                    <div className="date">{moment(article.date).format('LL')}</div>
                    <div className="tile">
                      <div className="image">
                        <img src={article.tile.url} alt="" />
                      </div>
                      <div className="excerpt">{article.excerpt}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {archived.length > 0 && (
            <>
              <hr className="divider" />
              <div className="archive-container">
                <h3>{label.common.ARCHIVED}</h3>
                <ul>
                  {archived.forEach(archive => {
                    archive.pdfDownloads.map((download, idx) => (
                      <li>
                        <a href={download.url}>{archive.pdfTitles[idx]}</a>
                      </li>
                    ));
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

NewsTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

NewsTemplate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      page(where: { id: $id }) {
        news: newsSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          title(locale: $locale)
          articles {
            tile {
              url
            }
            date
            title(locale: $locale)
            excerpt(locale: $locale)
            content(locale: $locale)
            pdfDownloads(locale: $locale) {
              fileName
              url
            }
            pdfTitles(locale: $locale)
            status
          }
        }
      }
    }
  }
`;

export default NewsTemplate;
