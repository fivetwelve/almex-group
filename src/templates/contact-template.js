import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import RegionLookup from '../components/regionLookup';
import ContactMap from '../components/contactMap';

import '../styles/contact.scss';
import ContactModal from '../components/contactModal';

const allowHTML = { html: true };

class ContactTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.shroud = React.createRef();
    this.state = {
      office: '',
      showModal: false,
    };
  }

  handleContactUs = officeIndex => {
    // console.log('office:', officeIndex);
    this.setState({
      office: String(officeIndex),
      showModal: true,
    });
    if (typeof document !== 'undefined') {
      document.querySelector('html').classList.toggle('hide-overflow');
    }
    this.shroud.current.classList.add('in-view');
  };

  handleHideModal = () => {
    this.setState({
      showModal: false,
    });
    this.shroud.current.classList.remove('in-view');
  };

  render() {
    const { office, showModal } = this.state;
    const { data, pageContext } = this.props;
    const { locale, siteData, region } = pageContext;
    const {
      cms: {
        brandNavigation,
        headerFooter,
        label,
        navigation,
        page: {
          contact: { title, description, offices },
        },
      },
    } = data;

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="contact"
        data={siteData}
        headerFooter={headerFooter}
        label={label}
        navigation={navigation}
        region={region}
        title=""
      >
        {/* <Location>
          {({ location }) => ( */}
        <>
          <div className="contact-container">
            {/* <div className="banner-image">
                   <GraphImg image={bannerImage} maxWidth={1280} />
                 </div> */}
            <div className="intro-container">
              <div className="intro-content">
                <h1 className="title">{title}</h1>
                <div className="description">
                  <Markdown source={description} options={allowHTML} />
                </div>
              </div>
              <div className="links">
                <div className="resources">
                  <div className="label">{label.about.RESOURCES}</div>
                </div>
              </div>
            </div>

            <RegionLookup />

            <div className="almex-locations">
              <a href="#offices">
                <span className="more">{label.about.ALMEX_LOCATIONS}</span>
                <span className="more-arrow">&nbsp;&raquo;</span>
              </a>
            </div>
            <ContactMap
              label={label}
              locale={locale}
              offices={offices}
              handleContactUs={this.handleContactUs}
            />
            <div className="contact-shroud" ref={this.shroud} />
            <ContactModal
              hideModal={this.handleHideModal}
              label={label}
              offices={offices}
              selectedOffice={office}
              showModal={showModal}
            />
          </div>
        </>
        {/* )}
        </Location> */}
      </Layout>
    );
  }
}

ContactTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ContactTemplate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
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
        about(locale: $locale)
        common(locale: $locale)
      }
      page(where: { id: $id }) {
        contact: contactSource {
          title(locale: $locale)
          description(locale: $locale)
          offices {
            address
            backupOffice
            belongsTo
            contactPerson
            countries(locale: $locale)
            # 2-letter format of this office's country
            countryCode
            # Not a typo, same list of supported countries in 2-letter format
            countryCodes
            description(locale: $locale)
            email
            fax
            latitude
            longitude
            mobile
            name
            telephone
            tollFree
          }
        }
      }
    }
  }
`;

export default ContactTemplate;
