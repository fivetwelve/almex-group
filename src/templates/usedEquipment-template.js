import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Markdown from 'react-remarkable';
import shortid from 'shortid';
import Layout from '../components/layout';
import UsedEquipmentListing from '../components/usedEquipmentListing';
import '../styles/usedEquipment.scss';

const allowHTML = { html: true };

const UsedEquipmentTemplate = ({ data, pageContext }) => {
  const { locale, siteData, region } = pageContext;
  const {
    cms: {
      brandNavigation,
      headerFooter,
      label,
      page: {
        usedEquipment: { title, description, disclaimer, usedEquipmentListings },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      activeSection=""
      brandNavigation={brandNavigation}
      childrenClass="used-equipment"
      region={region}
      title=""
      data={siteData}
      headerFooter={headerFooter}
      label={label}
    >
      <div className="used-equipment-container">
        <div className="heading">
          <div className="title-container">
            <div className="used-icon" aria-hidden="true" />
            <div className="title">{title}</div>
          </div>
          <div className="description">
            <Markdown source={description} options={allowHTML} />
          </div>
        </div>
        {usedEquipmentListings.map(listing => (
          <UsedEquipmentListing {...listing} key={shortid.generate()} />
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
    siteData: PropTypes.object,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      label(where: { availableIn: $region }) {
        products(locale: $locale)
      }
      page(where: { id: $id }) {
        usedEquipment {
          title(locale: $locale)
          description(locale: $locale)
          disclaimer(locale: $locale)
          usedEquipmentListings {
            date
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
