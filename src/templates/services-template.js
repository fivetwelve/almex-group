import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import Layout from '../components/layout';
import { makeid, renderLink } from '../utils/functions';
import '../styles/services.scss';

const ServicesTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        services: { bannerImage, description, sideContent, title },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="services-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
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
                      source={description}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
                  </div>
                </div>
                <aside className="aside-container">
                  {sideContent.map(content => (
                    <div className="aside-block" key={makeid()}>
                      <ReactMarkdown
                        key={makeid()}
                        source={content}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props, location),
                        }}
                      />
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
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: [GraphCMS_Locale!]!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      page(locales: $locale, where: { id: $id }) {
        services: servicesSource {
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
`;

export default ServicesTemplate;
