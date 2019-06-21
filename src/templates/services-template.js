import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import { makeid } from '../utils/functions';
import '../styles/services.scss';

const allowHTML = { html: true };

const ServicesTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      // aboutLabel,
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
      childrenClass="services"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
      <>
        <div className="services-container">
          <div className="banner-wrapper">
            <div className="banner-image">
              <GraphImg image={bannerImage} maxWidth={1280} />
            </div>
          </div>
          <div className="main-container">
            <div className="main-content">
              <h1 className="title">{title}</h1>
              <div className="description">
                <Markdown source={description} options={allowHTML} />
              </div>
            </div>
            <aside className="aside-container">
              {sideContent.map(content => (
                <Markdown key={makeid()} source={content} options={allowHTML} />
              ))}
            </aside>
          </div>
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

ServicesTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ServicesTemplate.propTypes = {
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
      # aboutLabel: label(where: { availableIn: $region }) {
      #   about(locale: $locale)
      # }
      page(where: { id: $id }) {
        services: servicesSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          sideContent(locale: $locale)
          title(locale: $locale)
        }
      }
    }
  }
`;

export default ServicesTemplate;
