import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import Markdown from 'react-remarkable';
import { makeid } from '../utils/functions';
import pin from '../../static/img/map-pin.svg';
import flagAU from '../../static/img/flag-AU.png';
import flagBR from '../../static/img/flag-BR.png';
import flagCA from '../../static/img/flag-CA.png';
import flagCL from '../../static/img/flag-CL.png';
import flagCN from '../../static/img/flag-CN.png';
import flagID from '../../static/img/flag-ID.png';
import flagIN from '../../static/img/flag-IN.png';
import flagMX from '../../static/img/flag-MX.png';
import flagNL from '../../static/img/flag-NL.png';
import flagPE from '../../static/img/flag-PE.png';
import flagUS from '../../static/img/flag-US.png';
import flagZA from '../../static/img/flag-ZA.png';

const showFlag = countryAbbrev => {
  let imgSrc = null;
  switch (countryAbbrev) {
    case 'AU':
      imgSrc = flagAU;
      break;
    case 'BR':
      imgSrc = flagBR;
      break;
    case 'CA':
      imgSrc = flagCA;
      break;
    case 'CL':
      imgSrc = flagCL;
      break;
    case 'CN':
      imgSrc = flagCN;
      break;
    case 'ID':
      imgSrc = flagID;
      break;
    case 'IN':
      imgSrc = flagIN;
      break;
    case 'MX':
      imgSrc = flagMX;
      break;
    case 'NL':
      imgSrc = flagNL;
      break;
    case 'PE':
      imgSrc = flagPE;
      break;
    case 'US':
      imgSrc = flagUS;
      break;
    case 'ZA':
      imgSrc = flagZA;
      break;
    default:
      break;
  }
  if (imgSrc) {
    return (
      <>
        <img className="flag" src={imgSrc} alt="" />
        <br />
      </>
    );
  }
  return false;
};

const ContactOffice = props => {
  const {
    goToOffice,
    label,
    office: {
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
          {countryCode && showFlag(countryCode)}
          <em>{name}</em>
          <br />
          <Markdown source={address} />
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
                <span className="toll-free">{label.about.TOLLFREE}: </span>
                {num}
              </div>
            ))}
          {contactPerson && (
            <div>
              <span className="contact-person">{label.about.CONTACT}: </span>
              <em>{contactPerson}</em>
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
    countryCode: '',
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
    countryCode: PropTypes.string,
    description: PropTypes.string,
    fax: PropTypes.array,
    mobile: PropTypes.array,
    name: PropTypes.string,
    telephone: PropTypes.array,
    tollFree: PropTypes.array,
  }),
};

export default ContactOffice;
