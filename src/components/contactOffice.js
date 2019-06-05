import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import Markdown from 'react-remarkable';
import { makeid } from '../utils/functions';
import pin from '../../static/img/map-pin.svg';

const ContactOffice = props => {
  const {
    goToOffice,
    label,
    office: {
      address,
      contactPerson,
      countries,
      description,
      fax,
      latitude,
      longitude,
      mobile,
      name,
      telephone,
      tollFree,
    },
  } = props;
  // console.log(label);

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
          {name}
          <br />
          <Markdown source={address} />
          {telephone.length > 0 &&
            telephone.map(num => (
              <div key={`tel-${makeid()}`}>
                <span aria-hidden="true">
                  <IconContext.Provider value={{ className: 'phone' }}>
                    <FaPhone aria-hidden />
                  </IconContext.Provider>
                </span>
                {num}
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
                </span>
                {num}
              </div>
            ))}
          {tollFree.length > 0 &&
            tollFree.map(num => (
              <div key={`toll-free-${makeid()}`}>
                <span className="toll-free">{label.about.TOLLFREE}</span>: {num}
              </div>
            ))}
          {contactPerson && (
            <div>
              <span className="contact-person">{label.about.CONTACT}</span>: {contactPerson}
            </div>
          )}
        </div>
        <div className="table-desc">{description}</div>
        <div className="table-countries">{countries}</div>
      </div>
    </div>
  );
};

ContactOffice.defaultProps = {
  goToOffice: () => {},
  label: {},
  office: {
    address: '',
    belongsTo: '',
    contactPerson: null,
    countries: '',
    description: '',
    fax: [],
    mobile: [],
    name: '',
    telephone: [],
    tollFree: [],
  },
};

ContactOffice.propTypes = {
  label: PropTypes.shape({
    about: PropTypes.object,
  }),
  goToOffice: PropTypes.func,
  office: PropTypes.shape({
    address: PropTypes.string,
    belongsTo: PropTypes.string,
    contactPerson: PropTypes.string,
    countries: PropTypes.string,
    description: PropTypes.string,
    fax: PropTypes.array,
    mobile: PropTypes.array,
    name: PropTypes.string,
    telephone: PropTypes.array,
    tollFree: PropTypes.array,
  }),
};

export default ContactOffice;
