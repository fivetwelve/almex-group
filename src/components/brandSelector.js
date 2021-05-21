import React, { useState } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown } from 'react-icons/fa';
import CloseButton from './closeButton';
import { createLink } from '../utils/functions';
import checkKeyPress from '../utils/checkKeyPress';
import { BRANDS } from '../constants';

const BrandSelector = props => {
  const [openMenu, handleMenuState] = useState(false);
  const { brandNavigation, label, location } = props;
  const brands = brandNavigation.pages;

  const handleClickDropDown = evt => {
    evt.preventDefault();
    handleMenuState(!openMenu);
  };

  checkKeyPress('Escape', () => {
    handleMenuState(false);
  });

  const renderBrands = (brand, loc) => {
    let productBrand = '';
    switch (brand.brand) {
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
      case BRANDS.LIGHTWEIGHT:
        productBrand = 'lightweight';
        break;
      case BRANDS.VOTECH:
        productBrand = 'votech';
        break;
      default:
        break;
    }
    return (
      <div className={`brand ${productBrand}`} key={brand.slug}>
        <Link to={createLink(loc, brand.slug)}>
          <span className="sr-only">{brand.title}</span>
        </Link>
      </div>
    );
  };

  return (
    <>
      <div className="brand-selector">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className={`nav__trigger ${openMenu && 'is-open'}`}
          onClick={evt => {
            handleClickDropDown(evt);
          }}
        >
          <span className="dd-text-icon text">
            {label.header.BRANDS}
            <span aria-hidden="true" className="dd-icon">
              <IconContext.Provider value={{ className: 'chevron' }}>
                <FaAngleDown aria-hidden />
              </IconContext.Provider>
            </span>
          </span>
        </button>
      </div>
      <div className={`brand-container ${openMenu && 'visible'}`}>
        <CloseButton closeMenu={handleMenuState} label={label.common} />
        {brands.map(brand => renderBrands(brand, location))}
      </div>
    </>
  );
};

BrandSelector.defaultProps = {
  brandNavigation: {},
  label: {},
  location: {},
};

BrandSelector.propTypes = {
  brandNavigation: PropTypes.shape({
    pages: PropTypes.instanceOf(Array),
  }),
  label: PropTypes.shape({
    common: PropTypes.instanceOf(Object),
    header: PropTypes.instanceOf(Object),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default BrandSelector;
