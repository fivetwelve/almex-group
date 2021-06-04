import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Layout from '../components/layout';
import { renderLink } from '../utils/functions';
import '../styles/promo.scss';

const PromoTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.contentSource) {
  //   throw Error(
  //     `Check the connection to promoSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const {
    cms: {
      page: {
        contentSource: { bannerImage, marketing, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="promo-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="promo-container">
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
                  <div className="marketing">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {marketing}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

PromoTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

PromoTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.instanceOf(Object),
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
        contentSource {
          sourceType: __typename
          ... on GraphCMS_PromoSource {
            bannerImage {
              handle
              width
              height
            }
            marketing
            title
          }
        }
      }
    }
  }
`;

export default PromoTemplate;
