import React from 'react';
import PropTypes from 'prop-types';
import { allBrands } from '../constants';

const ProductBrand = ({ brand }) => {
  let productBrand = '';

  switch (brand) {
    case allBrands.ALMEX_IN_A_BOX:
      productBrand = 'almex-box';
      break;
    case allBrands.BAT:
      productBrand = 'bat';
      break;
    case allBrands.FUSION:
      productBrand = 'fusion';
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
