import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import moment from 'moment';
import 'moment/locale/es';
import Layout from '../components/layout';
import UsedEquipmentListing from '../components/usedEquipmentListing';
import { makeid, matchMomentLocale } from '../utils/functions';
import '../styles/usedEquipment.scss';

const allowHTML = { html: true };

const UsedEquipmentTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      navigation,
      sparesRepairsLabel,
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
      childrenClass="used-equipment"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
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
            <Markdown source={description} options={allowHTML} />
          </div>
        </div>
        {usedEquipmentListings.map(listing => (
          <UsedEquipmentListing {...listing} key={makeid()} label={sparesRepairsLabel} />
        ))}
        <div className="disclaimer">{disclaimer}</div>
      </div>
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
      page: PropTypes.shape({}),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      sparesRepairsLabel: label(where: { availableIn: $region }) {
        # products(locale: $locale)
        sparesRepairs(locale: $locale)
      }
      page(where: { id: $id }) {
        usedEquipment: usedEquipmentSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          disclaimer(locale: $locale)
          title(locale: $locale)
          usedEquipmentListings {
            date
            equipmentStatus
            title(locale: $locale)
            modelNumber
            contactInformation(locale: $locale)
            equipmentDescription(locale: $locale)
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
