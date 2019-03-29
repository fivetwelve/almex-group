import React, { Component } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { createLink } from '../utils/functions';
import { allBrands } from '../constants';
// import constants from '../constants';
// import '../styles/brandSelector.scss';

class BrandSelector extends Component {
  constructor(props) {
    super(props);
    this.brandDropdown = React.createRef();
    this.state = {
      clicked: false,
    };
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
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  render() {
    // const { activeLanguage, languages, region } = this.props;
    // const { region } = this.props;
    const { clicked } = this.state;
    const { brandNavigation, label, location } = this.props;
    const brands = brandNavigation.pages;
    // const { allLanguageSlugs, allRegionSlugs } = constants;
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
                  {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
                </IconContext.Provider>
              </span>
            </span>
          </button>
        </div>
        <div className="brand-container" ref={this.brandDropdown}>
          {brands.map(brand => {
            let productBrand = '';
            switch (brand.landing.brand) {
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
                  <span className="sr-only">{brand.landing.title}</span>
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
