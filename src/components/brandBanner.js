import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';
import { BRANDS } from '../constants';

const BrandBanner = ({ brands, location }) => (
  <div className="brands-container">
    <div className="brands">
      {brands.map(eachBrand => {
        let productBrand = '';
        switch (eachBrand.brand) {
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
          <div className={`brand ${productBrand}`} key={eachBrand.slug}>
            <Link to={createLink(location, eachBrand.slug)}>
              <span className="sr-only">{eachBrand.title}</span>
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
