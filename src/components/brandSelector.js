import React, { Component, Fragment } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
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
    const { label } = this.props;
    // const { langList, regionList } = constants;

    return (
      <Fragment>
        <div className="language brand-selector">
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
          <ul id="dropdown-1" role="menu" className="lang-dropdown">
            {/* <li className="nav__list" key={language}>
              <Link href={`/${regionList[region]}/${langList[language]}`}>
                <span className="nav__link">{language}</span>
              </Link>
            </li> */}
            <li className="nav__list">Some Brand here</li>
          </ul>
        </div>
        <div className="brand-container" ref={this.brandDropdown}>
          <div className="brand almex-box">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Almex</span>
            </Link>
          </div>
          <div className="brand fusion">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Fusion Systems</span>
            </Link>
          </div>
          <div className="brand emsys">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Emsys</span>
            </Link>
          </div>
          <div className="brand bat">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">BAT</span>
            </Link>
          </div>
          <div className="brand cobra">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Cobra</span>
            </Link>
          </div>
          <div className="brand votech">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">votech</span>
            </Link>
          </div>
          <div className="brand institute">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Almex Institute</span>
            </Link>
          </div>
          <div className="brand knight">
            <Link to="/northamerica/en/heavyweight/">
              <span className="sr-only">Almex Global Services</span>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

BrandSelector.defaultProps = {
  // activeLanguage: '',
  // languages: [],
  // region: '',
  label: '',
};

BrandSelector.propTypes = {
  // activeLanguage: PropTypes.string,
  // languages: PropTypes.arrayOf(PropTypes.string),
  // region: PropTypes.string,
  label: PropTypes.string,
};

export default BrandSelector;
