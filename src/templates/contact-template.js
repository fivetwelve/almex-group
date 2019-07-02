import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import ContactMap from '../components/contactMap';
import ContactFormModal from '../components/contactFormModal';
import { fetch, mapToOffice } from '../utils/functions';

import '../styles/contact.scss';

const allowHTML = { html: true };

class ContactTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.shroud = React.createRef();
    this.state = {
      office: '',
      showModal: false,
      visitorRegion: null,
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

  handleContactUs = officeIndex => {
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
    const { office, visitorRegion, showModal } = this.state;
    const { data, pageContext } = this.props;
    const { locale, region } = pageContext;
    const {
      cms: {
        aboutLabel,
        brandNavigation,
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

            <div className="almex-locations">
              <a href="#offices">
                <span className="more">{aboutLabel.about.ALMEX_LOCATIONS}</span>
                <span className="more-arrow">&nbsp;&raquo;</span>
              </a>
            </div>
            <ContactMap
              aboutLabel={aboutLabel}
              locale={locale}
              offices={offices}
              handleContactUs={this.handleContactUs}
              visitorRegion={visitorRegion}
            />
            <div className="contact-shroud" ref={this.shroud} />
            <ContactFormModal
              hideModal={this.handleHideModal}
              label={label}
              offices={offices}
              selectedOffice={office}
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
    id: PropTypes.string,
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
