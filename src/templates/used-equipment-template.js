import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import 'moment/locale/es';
import Layout from '../components/layout';
import UsedEquipmentListing from '../components/usedEquipmentListing';
import { makeid, matchMomentLocale, renderLink } from '../utils/functions';
import '../styles/usedEquipment.scss';

const UsedEquipmentTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.usedEquipment) {
    throw Error(
      `Check the connection to usedEquipmentSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
    );
  }
  const { languages, locale, localeData, region } = pageContext;
  // const { brandNavigation, headerFooter, navigation } = localeData;
  const { label } = localeData;
  const {
    cms: {
      // label,
      page: {
        usedEquipment: { bannerImage, description, disclaimer, title, usedEquipmentListings },
      },
    },
  } = data;

  moment.locale(matchMomentLocale(locale));

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="used-equipment-page"
      languages={languages}
      localeData={localeData}
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
                  components={{
                    link: props => renderLink(props, location),
                  }}
                >
                  {description}
                </ReactMarkdown>
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
      // label: PropTypes.instanceOf(Object),
      page: PropTypes.instanceOf(Object),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
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
  query(
    $id: ID!
    # $locale: [GraphCMS_Locale!]!
    # $region: GraphCMS_Region!
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      # label(locales: $locale, where: { availableIn: $region }) {
      #   sparesRepairs
      # }
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
