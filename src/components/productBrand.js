import React from 'react';
import PropTypes from 'prop-types';
import { BRANDS } from '../constants';

const ProductBrand = ({ brand }) => {
  let productBrand = '';

  switch (brand) {
    case BRANDS.ALMEX_IN_A_BOX:
      productBrand = 'almex-box';
      break;
    case BRANDS.ALMEX_INSTITUTE:
      productBrand = 'institute';
      break;
    case BRANDS.BAT:
      productBrand = 'bat';
      break;
    case BRANDS.CMI:
      productBrand = 'cmi';
      break;
    case BRANDS.EMSYS:
      productBrand = 'emsys';
      break;
    case BRANDS.FUSION:
      productBrand = 'fusion';
      break;
    case BRANDS.GLOBAL_SERVICES:
      productBrand = 'knight';
      break;
    case BRANDS.RAMPART:
      productBrand = 'rampart';
      break;
    case BRANDS.VOTECH:
      productBrand = 'votech';
      break;
    default:
      break;
  }

  return (
    <div className={`brand ${productBrand}`}>
      <span className="sr-only">{brand}</span>
    </div>
  );
};

ProductBrand.defaultProps = {
  brand: '',
};

ProductBrand.propTypes = {
  brand: PropTypes.string,
};

export default ProductBrand;
