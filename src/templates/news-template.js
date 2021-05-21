import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import 'moment/locale/es';
import Layout from '../components/layout';
import { makeid, matchMomentLocale, renderLink } from '../utils/functions';
import { ARTICLE_STATUS } from '../constants';
import '../styles/news.scss';

const NewsTemplate = ({ data, pageContext }) => {
  const { languages, locale, localeData, region } = pageContext;
  const { brandNavigation, headerFooter, navigation } = localeData;
  const {
    cms: {
      label,
      page: {
        news: { articles, bannerImage, description, title },
      },
    },
  } = data;
  const [articleNum, setArticleNum] = useState(0);

  moment.locale(matchMomentLocale(locale));

  /* sort articles in descending date order */
  const published = articles.filter(article => article.articleStatus === ARTICLE_STATUS.RECENT);
  const archived = articles.filter(article => article.articleStatus === ARTICLE_STATUS.ARCHIVED);
  published.sort((a, b) => new Date(b.date) - new Date(a.date));
  archived.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="news-page"
      headerFooter={headerFooter}
      label={label}
      languages={languages}
      navigation={navigation}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
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
                      <ReactMarkdown
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
              {published.length > 0 && (
                <>
                  <hr className="divider" />
                  <div className="article-container">
                    <p>{moment(published[articleNum].date).format('LL')}</p>
                    <ReactMarkdown
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {published[articleNum].content}
                    </ReactMarkdown>
                  </div>
                  {published[articleNum].pdfDownloads.length > 0 && (
                    <div className="downloads-container">
                      <p>{label.common.DOWNLOAD}</p>
                      {published[articleNum].pdfDownloads.map(download => (
                        <div key={makeid()} className="pdf">
                          <div className="pdf-icon" />
                          <a
                            href={download.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow noindex"
                          >
                            {download.documentTitle}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {archived.map(archive =>
                      archive.pdfDownloads.map(download => (
                        <div key={makeid()} className="pdf">
                          <div className="pdf-icon" />
                          <a
                            href={download.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow noindex"
                          >
                            {moment(archive.date).format('LL')} -{' '}
                            {download.documentTitle || download.fileName.split('.pdf')[0]}
                          </a>
                        </div>
                      )),
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

NewsTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

NewsTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.instanceOf(Object),
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.instanceOf(Array),
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    # $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        news: newsSource {
          bannerImage {
            handle
            width
            height
          }
          description
          title
          articles {
            tile {
              url
            }
            date
            title
            excerpt
            content
            pdfDownloads {
              documentTitle
              fileName
              url
            }
            articleStatus
          }
        }
      }
    }
  }
`;

export default NewsTemplate;
