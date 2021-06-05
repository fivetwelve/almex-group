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
import { makeid, renderLink, getIPapiJson } from '../utils/functions';
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
    // 3rd party api to get country code from visitor's IP address
    const thisRegion =
      (navigator.cookieEnabled && localStorage.getItem('almexVisitorRegion')) || null;
    if (!thisRegion) {
      getIPapiJson()
        .then(json => {
          this.setState({
            visitorRegion: json.message.country_code,
          });
        })
        .catch(() => {
          this.setState({
            visitorRegion: null,
          });
        });
    } else {
      this.setState({
        visitorRegion: thisRegion,
      });
    }
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
    // if (!data.cms.page.contact) {
    //   throw Error(
    //     `Check the connection to contactSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
    //   );
    // }
    const { languages, locale, localeData, region } = pageContext;
    const { label } = localeData;
    const {
      experts,
      page: {
        contact: { bannerImage, title, description, offices },
      },
    } = data.cms;
    const { contactType, expert, office, visitorRegion, showModal, view } = this.state;

    return (
      <Layout
        activeLanguage={locale}
        childrenClass="contact-page"
        languages={languages}
        localeData={localeData}
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
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
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
                      {label.about.SEE_OFFICES}
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
                      {label.about.SEE_EXPERTS}
                    </span>
                  </button>
                </div>

                <div className={`offices-view ${view === CONTACT_TYPES.OFFICE ? 'active' : ''}`}>
                  <ContactMap
                    experts={experts}
                    label={label}
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
                      <div className="table-details heading">{label.about.EXPERTS}</div>
                    </div>
                    {experts.map(eachExpert => (
                      <ContactExpert
                        key={makeid()}
                        label={label}
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
      experts: PropTypes.instanceOf(Array),
      page: PropTypes.instanceOf(Object),
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
  query($id: ID!, $locale: [GraphCMS_Locale!]!, $locales: [GraphCMS_Locale!]!) {
    cms {
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
      page(locales: $locales, where: { id: $id }) {
        contact: contentSource {
          sourceType: __typename
          ... on GraphCMS_ContactSource {
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
              supportedCountryCodes: countryCodes
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
  }
`;

export default ContactTemplate;
