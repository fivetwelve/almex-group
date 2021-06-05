import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import Layout from '../components/layout';
import { makeid, renderLink } from '../utils/functions';
import '../styles/services.scss';

const ServicesTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.services) {
  //   throw Error(
  //     `Check the connection to servicesSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const {
    cms: {
      page: {
        services: { bannerImage, description, sideContent, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="services-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="services-container">
              {bannerImage && (
                <div className="banner-wrapper">
                  <div className="banner-image">
                    <GraphImg image={bannerImage} maxWidth={1280} />
                  </div>
                </div>
              )}
              <div className="main-container">
                <div className="main-content">
                  <h1 className="title">{title}</h1>
                  <div className="description">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[gfm]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                  </div>
                </div>
                <aside className="aside-container">
                  {sideContent.map(content => (
                    <div className="aside-block" key={makeid()}>
                      <ReactMarkdown
                        key={makeid()}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ))}
                </aside>
              </div>
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

ServicesTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ServicesTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      page: PropTypes.instanceOf(Object),
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locales: [GraphCMS_Locale!]!) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        services: contentSource {
          # sourceType: __typename
          ... on GraphCMS_ServicesSource {
            bannerImage {
              handle
              width
              height
            }
            description
            sideContent
            title
          }
        }
      }
    }
  }
`;

export default ServicesTemplate;
