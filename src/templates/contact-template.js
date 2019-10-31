import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import ContactExpert from '../components/contactExpert';
import ContactMap from '../components/contactMap';
import ContactFormModal from '../components/contactFormModal';
import { fetch, makeid, mapToOffice } from '../utils/functions';
import { CONTACT_TYPES } from '../constants';

import '../styles/contact.scss';

const allowHTML = { html: true };

class ContactTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.shroud = React.createRef();
    this.state = {
      contactType: '',
      expert: null,
      office: null,
      showModal: false,
      visitorRegion: null,
      view: CONTACT_TYPES.OFFICE,
    };
  }

  componentDidMount() {
    const {
      data: {
        cms: {
          page: {
            contact: { offices },
          },
        },
      },
    } = this.props;

    // 3rd party api to get country code from visitor's IP address
    fetch('https://ipapi.co/json/', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(result => result.json())
      .then(json => {
        const visitorRegion = mapToOffice(json.country, offices);
        this.setState({
          visitorRegion,
        });
      })
      .catch(() => {
        this.setState({
          visitorRegion: null,
        });
      });
  }

  handleViewToggle = evt => {
    evt.preventDefault();
    const { view } = this.state;
    this.setState({
      view: view === CONTACT_TYPES.EXPERT ? CONTACT_TYPES.OFFICE : CONTACT_TYPES.EXPERT,
    });
  };

  handleContactUs = (expert, office) => {
    const contactType = expert ? CONTACT_TYPES.EXPERT : CONTACT_TYPES.OFFICE;
    this.setState({
      expert,
      contactType,
      office,
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
    const { contactType, expert, office, visitorRegion, showModal, view } = this.state;
    const { data, pageContext } = this.props;
    const { locale, region } = pageContext;
    const {
      cms: {
        aboutLabel,
        brandNavigation,
        experts,
        headerFooter,
        label,
        navigation,
        page: {
          contact: { bannerImage, title, description, offices },
        },
      },
    } = data;
    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="contact"
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
            {bannerImage && (
              <div className="banner-wrapper">
                <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
              </div>
            )}
            <div className="intro-container">
              <div className="intro-content">
                <h1 className="title">{title}</h1>
                <div className="description">
                  <Markdown source={description} options={allowHTML} />
                </div>
              </div>
            </div>

            <div className="view-toggle-container">
              <button type="button" onClick={this.handleViewToggle}>
                {view === CONTACT_TYPES.OFFICE
                  ? aboutLabel.about.SEE_EXPERTS
                  : aboutLabel.about.SEE_OFFICES}
              </button>
            </div>

            <div className={`offices-view ${view === CONTACT_TYPES.OFFICE ? 'active' : ''}`}>
              <ContactMap
                aboutLabel={aboutLabel}
                experts={experts}
                locale={locale}
                offices={offices}
                handleContactUs={this.handleContactUs}
                visitorRegion={visitorRegion}
              />
            </div>
            <div className={`experts-view ${view === CONTACT_TYPES.EXPERT ? 'active' : ''}`}>
              <div className="table-data">
                <div className="table-entry">
                  <div className="table-pin" />
                  <div className="table-details heading">{aboutLabel.about.CENTERS}</div>
                </div>
                {experts.map(eachExpert => (
                  <ContactExpert
                    key={makeid()}
                    aboutLabel={aboutLabel}
                    expert={eachExpert}
                    handleContactUs={this.handleContactUs}
                  />
                ))}
              </div>
            </div>

            <div className="contact-shroud" ref={this.shroud} />

            <ContactFormModal
              hideModal={this.handleHideModal}
              label={label}
              offices={offices}
              selectedOffice={office}
              selectedExpert={expert}
              contactType={contactType}
              showModal={showModal}
              title={title}
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
    cms: PropTypes.shape({
      aboutLabel: PropTypes.object,
      brandNavigation: PropTypes.object,
      experts: PropTypes.array,
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
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      aboutLabel: label(where: { availableIn: $region }) {
        about(locale: $locale)
      }
      experts {
        specialty(locale: $locale)
        name
        title
        location
        countryCode
        telephone
        fax
        mobile
        email
      }
      page(where: { id: $id }) {
        contact: contactSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          title(locale: $locale)
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
