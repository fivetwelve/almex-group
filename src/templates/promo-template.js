import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import { renderLink } from '../utils/functions';
import '../styles/promo.scss';

const PromoTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.promoContent) {
    throw Error(
      `Check the connection to promoSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
    );
  }
  const { languages, locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        promoContent: { bannerImage, marketing, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="promo-page"
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
                      source={marketing}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
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
    cms: PropTypes.object,
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.array,
    locale: PropTypes.string,
    locales: PropTypes.array,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
    $region: GraphCMS_Region!
  ) {
    cms {
      ...CommonQuery
      page(locales: $locales, where: { id: $id }) {
        promoContent: promoSource {
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
`;

export default PromoTemplate;
