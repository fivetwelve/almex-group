import React, { Component } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown } from 'react-icons/fa';
import { createLink } from '../utils/functions';
import { BRANDS, PAGE_TYPES } from '../constants';
// import constants from '../constants';
// import '../styles/brandSelector.scss';

class BrandSelector extends Component {
  constructor(props) {
    super(props);
    this.brandDropdown = React.createRef();
  }

  // handleKeyDown = evt => {
  //   let dropdownSibling = document.activeElement.nextElementSibling;
  //   if (evt.keyCode == 38) {
  //     if (dropdownSibling) {
  //       dropdownSibling.childNodes[0].previousElementSibling.firstElementChild.focus();
  //     } else {
  //       dropdownSibling = document.activeElement.parentElement.previousElementSibling.firstElementChild;
  //       dropdownSibling.focus();
  //     }
  //   }
  //   if (evt.keyCode == 40) {
  //     if (dropdownSibling) {
  //       dropdownSibling.childNodes[0].nextElementSibling.firstElementChild.focus();
  //     } else {
  //       dropdownSibling = document.activeElement.parentElement.nextElementSibling.firstElementChild;
  //       dropdownSibling.focus();
  //     }
  //   }
  //   if (evt.keyCode == 27) {
  //     evt.preventDefault();
  //     document.activeElement.parentElement.parentElement.classList.remove('nav__dropdown--visible');
  //     document.activeElement.parentElement.parentElement.previousElementSibling.setAttribute(
  //       'aria-expanded',
  //       'false'
  //     );
  //     // Bring focus back to top level parent
  //     document.activeElement.parentElement.parentElement.previousElementSibling.focus();
  //   }
  // }

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.classList.toggle('is-open');
    // evt.target.nextElementSibling.classList.toggle('brand-dropdown--visible');
    this.brandDropdown.current.classList.toggle('visible');
    // console.log(this.brandDropdown.current);
  };

  render() {
    // const { activeLanguage, languages, region } = this.props;
    // const { region } = this.props;
    const { brandNavigation, label, location } = this.props;
    const brands = brandNavigation.pages;
    return (
      <>
        <div className="brand-selector">
          <button
            type="button"
            aria-expanded="false"
            aria-haspopup="true"
            className="nav__trigger"
            onClick={evt => {
              this.handleClickDropDown(evt);
            }}
            // onKeyDown={evt => {
            //   this.handleKeyDown(evt);
            // }}
          >
            <span className="dd-text-icon text">
              {label}
              <span aria-hidden="true" className="dd-icon">
                <IconContext.Provider value={{ className: 'brands-icon' }}>
                  <FaAngleDown aria-hidden />
                </IconContext.Provider>
              </span>
            </span>
          </button>
        </div>
        <div className="brand-container" ref={this.brandDropdown}>
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
      </>
    );
  }
}

BrandSelector.defaultProps = {
  // activeLanguage: '',
  // languages: [],
  // region: '',
  brandNavigation: {},
  label: '',
  location: {},
};

BrandSelector.propTypes = {
  // activeLanguage: PropTypes.string,
  // languages: PropTypes.arrayOf(PropTypes.string),
  // region: PropTypes.string,
  brandNavigation: PropTypes.shape({
    pages: PropTypes.array,
  }),
  label: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default BrandSelector;
