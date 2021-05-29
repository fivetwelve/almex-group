import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';
import { BRANDS } from '../constants';

const BrandBanner = ({ brands, location }) => (
  <div className="brands-container">
    <div className="brands">
      {brands.map(brand => {
        // let brandType = '';
        let productBrand = '';
        // console.log(brand);
        // switch (brand.sourceType) {
        //   case SOURCE_TYPE_SIMPLE_NAMES.INSTITUTE:
        //     brandType = brand.institute;
        //     break;
        //   case SOURCE_TYPE_SIMPLE_NAMES.LANDING:
        //     brandType = brand.landing;
        //     break;
        //   case SOURCE_TYPE_SIMPLE_NAMES.SERVICES:
        //     brandType = brand.services;
        //     break;
        //   default:
        //     break;
        // }
        switch (brand.brand) {
          case BRANDS.ALMEX_IN_A_BOX:
            productBrand = 'almex-box';
            break;
          case BRANDS.BAT:
            productBrand = 'bat';
            break;
          case BRANDS.LIGHTWEIGHT:
            productBrand = 'lightweight';
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
          case BRANDS.VOTECH:
            productBrand = 'votech';
            break;
          default:
            break;
        }
        return (
          <div className={`brand ${productBrand}`} key={brand.slug}>
            <Link to={createLink(location, brand.slug)}>
              <span className="sr-only">{brand.title}</span>
            </Link>
          </div>
        );
      })}
    </div>
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
