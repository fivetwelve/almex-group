import React from 'react';
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

const countryFlag = countryCode => {
  // countryCode is 2 characters, following https://www.iban.com/country-codes
  let imgSrc = null;
  switch (countryCode) {
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
      </>
    );
  }
  return null;
};

export default countryFlag;
