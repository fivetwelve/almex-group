import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';
import { allBrands, allPageTypes } from '../constants';

const BrandBanner = ({ brands, location }) => (
  <div className="brands">
    {brands.map(brand => {
      let productBrand = '';
      const brandType = brand.pageType === allPageTypes.LANDING ? brand.landing : brand.services;
      switch (brandType.brand) {
        case allBrands.ALMEX_IN_A_BOX:
          productBrand = 'almex-box';
          break;
        case allBrands.BAT:
          productBrand = 'bat';
          break;
        case allBrands.EMSYS:
          productBrand = 'emsys';
          break;
        case allBrands.FUSION:
          productBrand = 'fusion';
          break;
        case allBrands.VOTECH:
          productBrand = 'votech';
          break;
        case allBrands.ALMEX_INSTITUTE:
          productBrand = 'institute';
          break;
        case allBrands.GLOBAL_SERVICES:
          productBrand = 'knight';
          break;
        default:
          break;
      }
      return (
        <div className={`brand ${productBrand}`} key={brand.slug}>
          <Link to={createLink(location, brand.slug)}>
            <span className="sr-only">{brandType.title}</span>
          </Link>
        </div>
      );
    })}
  </div>
);

BrandBanner.defaultProps = {
  brands: [],
  location: {},
};

BrandBanner.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default BrandBanner;
