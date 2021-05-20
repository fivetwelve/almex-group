import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { countryFlag, makeid } from '../utils/functions';
import pin from '../../static/img/map-pin.svg';

const ContactOffice = props => {
  const { aboutLabel, goToOffice, handleContactUs, office, visitorRegion } = props;
  const {
    backupOffice,
    address,
    contactPerson,
    countries,
    countryCode,
    description,
    fax,
    latitude,
    longitude,
    mobile,
    name,
    telephone,
    tollFree,
  } = office;

  return (
    <div className="table-entry">
      <div className="table-pin">
        <button
          type="button"
          onClick={() => {
            goToOffice(latitude, longitude);
          }}
        >
          <img src={pin} alt="" />
        </button>
      </div>
      <div className="table-details">
        <div className="table-office">
          {countryCode && countryFlag(countryCode)}
          <br />
          <em>{name}</em>
          <br />
          <ReactMarkdown source={address} />
          {telephone.length > 0 &&
            telephone.map(num => (
              <div key={`tel-${makeid()}`}>
                <span aria-hidden="true">
                  <IconContext.Provider value={{ className: 'phone' }}>
                    <FaPhone aria-hidden />
                  </IconContext.Provider>
                </span>{' '}
                <a href={`tel:${num}`}>{num}</a>
              </div>
            ))}
          {fax.length > 0 &&
            fax.map(num => (
              <div key={`fax-${makeid()}`}>
                <span aria-hidden="true">
                  <IconContext.Provider value={{ className: 'fax' }}>
                    <FaFax aria-hidden />
                  </IconContext.Provider>
                </span>{' '}
                {num}
              </div>
            ))}
          {mobile.length > 0 &&
            mobile.map(num => (
              <div key={`mob-${makeid()}`}>
                <span aria-hidden="true">
                  <IconContext.Provider value={{ className: 'mobile' }}>
                    <FaMobileAlt aria-hidden />
                  </IconContext.Provider>
                </span>{' '}
                <a href={`tel:${num}`}>{num}</a>
              </div>
            ))}
          {tollFree.length > 0 &&
            tollFree.map(num => (
              <div key={`toll-free-${makeid()}`}>
                <span className="toll-free">{aboutLabel.about.TOLLFREE}: </span>
                {num}
              </div>
            ))}
          {contactPerson && (
            <div className="contact-person-container">
              <span className="contact-person">{aboutLabel.about.CONTACT_PERSON}: </span>
              <em>{contactPerson}</em>
            </div>
          )}
        </div>
        <div className="table-desc">
          <p>{description}</p>
          {(visitorRegion === countryCode || backupOffice) && (
            <p>
              <button type="button" onClick={() => handleContactUs(null, office)}>
                {aboutLabel.about.CONTACT_US}
              </button>
            </p>
          )}
        </div>
        <div className="table-countries">{countries}</div>
      </div>
    </div>
  );
};

ContactOffice.defaultProps = {
  aboutLabel: {},
  goToOffice: () => {},
  handleContactUs: () => {},
  office: {
    address: '',
    backupOffice: false,
    belongsTo: '',
    contactPerson: null,
    countries: '',
    countryCode: '',
    description: '',
    fax: [],
    mobile: [],
    name: '',
    telephone: [],
    tollFree: [],
  },
  visitorRegion: null,
};

ContactOffice.propTypes = {
  aboutLabel: PropTypes.shape({
    about: PropTypes.instanceOf(Object),
  }),
  goToOffice: PropTypes.func,
  handleContactUs: PropTypes.func,
  office: PropTypes.shape({
    address: PropTypes.string,
    backupOffice: PropTypes.bool,
    belongsTo: PropTypes.string,
    contactPerson: PropTypes.string,
    countries: PropTypes.string,
    countryCode: PropTypes.string,
    description: PropTypes.string,
    fax: PropTypes.instanceOf(Array),
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    mobile: PropTypes.instanceOf(Array),
    name: PropTypes.string,
    telephone: PropTypes.instanceOf(Array),
    tollFree: PropTypes.instanceOf(Array),
  }),
  visitorRegion: PropTypes.string,
};

export default ContactOffice;
