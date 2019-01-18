import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
// import constants from '../constants';
// import '../styles/brandSelector.scss';

class BrandSelector extends Component {
  constructor(props) {
    super(props);
    this.myDropDown = React.createRef();
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
    evt.target.classList.toggle('clicked');
    evt.target.nextElementSibling.classList.toggle('lang-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  render() {
    // const { activeLanguage, languages, region } = this.props;
    // const { region } = this.props;
    const { clicked } = this.state;
    // const { langList, regionList } = constants;

    return (
      <Fragment>
        <div className="language brand-selector" ref={this.myDropDown}>
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
            <span className="dd-text-icon">
              Brands
              <span aria-hidden="true" className="dd-icon">
                <IconContext.Provider value={{ className: 'brands-icon' }}>
                  {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
                </IconContext.Provider>
              </span>
            </span>
          </button>
          <ul id="dropdown-1" role="menu" className="lang-dropdown">
            {/* <li className="nav__list" key={language}>
              <a href={`/${regionList[region]}/${langList[language]}`}>
                <span className="nav__link">{language}</span>
              </a>
            </li> */}
            <li className="nav__list">Some Brand here</li>
          </ul>
        </div>
        <div className="brand-container">
          <div className="brand almex">
            <a href="/">Some brand here</a>
          </div>
          <div className="brand rampart">
            <a href="/">Some other brand here</a>
          </div>
          <div className="brand almex">
            <a href="/">Some brand here</a>
          </div>
          <div className="brand rampart">
            <a href="/">Some other brand here</a>
          </div>
          <div className="brand almex">
            <a href="/">Some brand here</a>
          </div>
          <div className="brand almex">
            <a href="/">Some brand here</a>
          </div>
          <div className="brand rampart">
            <a href="/">Some other brand here</a>
          </div>
          <div className="brand almex">
            <a href="/">Some brand here</a>
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
};

BrandSelector.propTypes = {
  // activeLanguage: PropTypes.string,
  // languages: PropTypes.arrayOf(PropTypes.string),
  // region: PropTypes.string,
};

export default BrandSelector;
