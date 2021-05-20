import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import { IconContext } from 'react-icons';
import { FaBuilding, FaUser } from 'react-icons/fa';

import Layout from '../components/layout';
import ContactExpert from '../components/contactExpert';
import ContactMap from '../components/contactMap';
import ContactFormModal from '../components/contactFormModal';
import { makeid, mapToOffice, renderLink, getIPapiJson } from '../utils/functions';
import { CONTACT_TYPES } from '../constants';

import '../styles/contact.scss';

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
    getIPapiJson()
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
    const { data, pageContext } = this.props;
    if (!data.cms.page.contact) {
      throw Error(
        `Check the connection to contactSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
      );
    }
    const { languages, locale, region } = pageContext;
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
    const { contactType, expert, office, visitorRegion, showModal, view } = this.state;

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="contact-page"
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
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props, location),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="view-toggle-container">
                  <button
                    type="button"
                    onClick={this.handleViewToggle}
                    disabled={view === CONTACT_TYPES.OFFICE}
                    className={view === CONTACT_TYPES.OFFICE ? 'active' : ''}
                  >
                    <span
                      aria-hidden="true"
                      className={view === CONTACT_TYPES.OFFICE ? 'icon highlight' : 'icon'}
                    >
                      <IconContext.Provider value={{ className: 'tab-icon' }}>
                        <FaBuilding aria-hidden />
                      </IconContext.Provider>
                    </span>
                    <span className={view === CONTACT_TYPES.OFFICE ? 'highlight' : ''}>
                      {aboutLabel.about.SEE_OFFICES}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={this.handleViewToggle}
                    disabled={view !== CONTACT_TYPES.OFFICE}
                    className={view !== CONTACT_TYPES.OFFICE ? 'active' : ''}
                  >
                    <span
                      aria-hidden="true"
                      className={view !== CONTACT_TYPES.OFFICE ? 'icon highlight' : 'icon'}
                    >
                      <IconContext.Provider value={{ className: 'tab-icon' }}>
                        <FaUser aria-hidden />
                      </IconContext.Provider>
                    </span>
                    <span className={view !== CONTACT_TYPES.OFFICE ? 'highlight' : ''}>
                      {aboutLabel.about.SEE_EXPERTS}
                    </span>
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
                      <div className="table-details heading">{aboutLabel.about.EXPERTS}</div>
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
          )}
        </Location>
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
      aboutLabel: PropTypes.instanceOf(Object),
      brandNavigation: PropTypes.instanceOf(Object),
      experts: PropTypes.instanceOf(Array),
      headerFooter: PropTypes.instanceOf(Object),
      label: PropTypes.instanceOf(Object),
      navigation: PropTypes.instanceOf(Object),
      page: PropTypes.instanceOf(Object),
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    locales: PropTypes.instanceOf(Array),
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
      aboutLabel: label(locales: $locale, where: { availableIn: $region }) {
        about
      }
      experts(locales: $locale) {
        specialty
        name
        title
        location
        countryCode
        telephone
        fax
        mobile
        email
      }
      page(locales: $locale, where: { id: $id }) {
        contact: contactSource {
          bannerImage {
            handle
            width
            height
          }
          description
          title
          offices {
            address
            backupOffice
            belongsTo
            contactPerson
            countries
            # 2-letter format of this office's country
            countryCode
            # Not a typo, same list of supported countries in 2-letter format
            countryCodes
            description
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
