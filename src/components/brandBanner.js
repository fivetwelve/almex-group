import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';
import { BRANDS, PAGE_TYPES } from '../constants';

const BrandBanner = ({ brands, location }) => (
  <div className="brands">
    {brands.map(brand => {
      let brandType = '';
      let productBrand = '';
      switch (brand.pageType) {
        case PAGE_TYPES.INSTITUTE:
          brandType = brand.institute;
          break;
        case PAGE_TYPES.LANDING:
          brandType = brand.landing;
          break;
        case PAGE_TYPES.SERVICES:
          brandType = brand.services;
          break;
        default:
          break;
      }
      switch (brandType.brand) {
        case BRANDS.ALMEX_IN_A_BOX:
          productBrand = 'almex-box';
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
        case BRANDS.ALMEX_INSTITUTE:
          productBrand = 'institute';
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
