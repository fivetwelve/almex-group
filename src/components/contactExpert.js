import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import CountryFlag from './countryFlag';
import { makeid } from '../utils/functions';

const ContactExpert = props => {
  const { aboutLabel, expert, handleContactUs } = props;
  const { countryCode, specialty, name, location, telephone, fax, mobile, title } = expert;

  return (
    <div className="table-entry">
      <div className="table-pin" />
      <div className="table-details">
        <div className="expert">
          <p>
            {countryCode && CountryFlag(countryCode)}
            <br />
            {specialty}
          </p>
          {name}, {title}
          <br />
          {location}
          <br />
          {telephone && (
            <div key={`tel-${makeid()}`}>
              <span aria-hidden="true">
                <IconContext.Provider value={{ className: 'phone' }}>
                  <FaPhone aria-hidden />
                </IconContext.Provider>
              </span>{' '}
              <a href={`tel:${telephone}`}>{telephone}</a>
            </div>
          )}
          {fax && (
            <div key={`fax-${makeid()}`}>
              <span aria-hidden="true">
                <IconContext.Provider value={{ className: 'fax' }}>
                  <FaFax aria-hidden />
                </IconContext.Provider>
              </span>{' '}
              {fax}
            </div>
          )}
          {mobile && (
            <div key={`mob-${makeid()}`}>
              <span aria-hidden="true">
                <IconContext.Provider value={{ className: 'mobile' }}>
                  <FaMobileAlt aria-hidden />
                </IconContext.Provider>
              </span>{' '}
              <a href={`tel:${mobile}`}>{mobile}</a>
            </div>
          )}
          <button type="button" onClick={() => handleContactUs(expert, null)}>
            {aboutLabel.about.CONTACT}
          </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

ContactExpert.defaultProps = {
  aboutLabel: {},
  expert: {},
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
};

ContactExpert.propTypes = {
  aboutLabel: PropTypes.shape({
    about: PropTypes.object,
  }),
  expert: PropTypes.shape({
    specialty: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.string,
    fax: PropTypes.string,
    mobile: PropTypes.string,
  }),
  handleContactUs: PropTypes.func,
  office: PropTypes.shape({
    address: PropTypes.string,
    belongsTo: PropTypes.string,
    contactPerson: PropTypes.string,
    countries: PropTypes.string,
    countryCode: PropTypes.string,
    description: PropTypes.string,
    fax: PropTypes.array,
    mobile: PropTypes.array,
    name: PropTypes.string,
    telephone: PropTypes.array,
    tollFree: PropTypes.array,
  }),
};

export default ContactExpert;
