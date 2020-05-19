import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import moment from 'moment';
import 'moment/locale/es';
import Layout from '../components/layout';
import UsedEquipmentListing from '../components/usedEquipmentListing';
import { makeid, matchMomentLocale, renderLink } from '../utils/functions';
import '../styles/usedEquipment.scss';

const UsedEquipmentTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.usedEquipment) {
    throw Error('usedEquipmentSource is either not connected or not published');
  }
  const { languages, locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        usedEquipment: { bannerImage, description, disclaimer, title, usedEquipmentListings },
      },
    },
  } = data;

  moment.locale(matchMomentLocale(locale));

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="used-equipment-page"
      headerFooter={headerFooter}
      label={label}
      languages={languages}
      navigation={navigation}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <div className="used-equipment-container">
            {bannerImage && (
              <div className="banner-wrapper">
                <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
              </div>
            )}
            <div className="heading">
              <div className="title-container">
                <div className="title">{title}</div>
              </div>
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
            {usedEquipmentListings.map(listing => (
              <UsedEquipmentListing {...listing} key={makeid()} label={label} />
            ))}
            <div className="disclaimer">{disclaimer}</div>
          </div>
        )}
      </Location>
    </Layout>
  );
};

UsedEquipmentTemplate.defaultProps = {
  data: {},
  location: {
    state: {},
  },
  pageContext: {},
};

UsedEquipmentTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
  }),
  pageContext: PropTypes.shape({
    languages: PropTypes.array,
    locale: PropTypes.string,
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
      label(locales: $locale, where: { availableIn: $region }) {
        sparesRepairs
      }
      page(locales: $locales, where: { id: $id }) {
        usedEquipment: usedEquipmentSource {
          bannerImage {
            handle
            width
            height
          }
          description
          disclaimer
          title
          usedEquipmentListings {
            date
            equipmentStatus
            title
            modelNumber
            contactInformation
            equipmentDescription
            images {
              url
            }
          }
        }
      }
    }
  }
`;

export default UsedEquipmentTemplate;
