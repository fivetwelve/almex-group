import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import { countryFlag, makeid } from '../utils/functions';

const ContactExpert = props => {
  const { expert, handleContactUs, label } = props;
  const { countryCode, specialty, name, location, telephone, fax, mobile, title } = expert;

  return (
    <div className="table-entry">
      <div className="table-pin" />
      <div className="table-details">
        <div className="expert">
          <p>
            {countryCode && countryFlag(countryCode)}
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
            {label.about.CONTACT}
          </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

ContactExpert.defaultProps = {
  label: {},
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
  label: PropTypes.shape({
    about: PropTypes.instanceOf(Object),
  }),
  expert: PropTypes.shape({
    specialty: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    telephone: PropTypes.string,
    fax: PropTypes.string,
    mobile: PropTypes.string,
    countryCode: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
  }),
  handleContactUs: PropTypes.func,
  office: PropTypes.shape({
    address: PropTypes.string,
    belongsTo: PropTypes.string,
    contactPerson: PropTypes.string,
    countries: PropTypes.string,
    countryCode: PropTypes.string,
    description: PropTypes.string,
    fax: PropTypes.instanceOf(Array),
    mobile: PropTypes.instanceOf(Array),
    name: PropTypes.string,
    telephone: PropTypes.instanceOf(Array),
    tollFree: PropTypes.instanceOf(Array),
  }),
};

export default ContactExpert;
