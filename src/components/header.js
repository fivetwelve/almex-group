import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaBars, FaSearch } from 'react-icons/fa';
import * as log from 'loglevel';
import BrandSelector from './brandSelector';
import LanguageSelector from './languageSelector';
import NavigationDropdown from './navigationDropdown';
import '../styles/header.scss';
import '../styles/headerOptions.scss';
import hLogo from '../../static/logo-almex-hori.svg';
import vLogo from '../../static/logo-almex-vert.svg';
// import Dump from '../utils/dump';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.myRef = {};
    const { headerFooters } = this.props;
    const nav = headerFooters[0].navigation;
    for (let i = 0; i < nav.length; i += 1) {
      const navType = nav[i].TYPE;
      this.myRef[navType] = React.createRef();
    }
  }

  componentDidUpdate() {
    // console.log(this.myRef);
  }

  closeOtherMenus = type => {
    // console.log(`type: ${type}`);
    // const { headerFooters } = this.props;
    // const nav = headerFooters[0].navigation;
    log.info(type);
    // console.log('myref:', this.myRef['PRODUCTS']);
    // for (let i = 0; i < nav.length; i += 1) {
    //   const navType = nav[i].TYPE;
    //   console.log('nav:', this.myRef[navType]);
    //   // console.log(`navType: ${navType}`);
    //   // console.log(this.PRODUCTS.current);
    //   if (type !== navType) {
    //     this.myRef[navType].current.toggleMenu();
    //   }
    // }
  };

  render() {
    const {
      activeLanguage,
      activeSection,
      headerFooters,
      labels,
      location,
      navigations,
      region,
    } = this.props;

    const label = labels[0];
    const headerFooter = headerFooters[0];
    const navigation = navigations[0];
    return (
      <div className="header">
        <div className="contents">
          <span className="logo">
            <img src={vLogo} width="50px" alt="Almex Group" className="vertical" />
            <img src={hLogo} width="225px" alt="Almex Group" className="horizontal" />
          </span>
          <div className="active-section-mobile">{labels[0].header[activeSection]}</div>
          <IconContext.Provider value={{ className: 'menu-icon' }}>
            <button type="button" className="mobile-menu">
              <FaBars aria-hidden />
              <span className="sr-only">Open menu</span>
            </button>
          </IconContext.Provider>
          <div className="options-container">
            <div className="options">
              <div className="search">
                <input placeholder="e.g. rubber tank lining, etc..." />
                {/* {label.header.SEARCH} */}
                <IconContext.Provider value={{ className: 'search-icon' }}>
                  {/* <button type="button" className="mobile-menu"> */}
                  <FaSearch aria-hidden />
                  {/* </button> */}
                </IconContext.Provider>
              </div>
              <BrandSelector label={label.header.BRANDS} />
              <LanguageSelector
                activeLanguage={activeLanguage}
                languages={headerFooter.language}
                region={region}
              />
              <div className="login">{label.header.LOGIN}</div>
            </div>
            <div className="tagline-container">
              <span className="tagline">{headerFooter.simpleTagline}</span>
            </div>
          </div>
        </div>
        <nav className="navigation">
          <div className="sections">
            {navigation.navigationSections.length > 0 &&
              navigation.navigationSections.map(section => (
                <NavigationDropdown
                  activeLanguage={activeLanguage}
                  closeOtherMenus={type => this.closeOtherMenus(type)}
                  key={section.type}
                  location={location}
                  section={section}
                  ref={this.PRODUCTS}
                />
              ))}
          </div>
        </nav>
      </div>
    );
  }
}

// const Header = ({ activeLanguage, activeSection, headerFooters, labels, region }) => {
//   const label = labels[0];
//   const headerFooter = headerFooters[0];

//   return (
//     <>
// <div className="header">
//   <div className="contents">
//     <span className="logo">
//       <img src={vLogo} width="50px" alt="Almex Group" className="vertical" />
//       <img src={hLogo} width="225px" alt="Almex Group" className="horizontal" />
//     </span>
//     <div className="active-section-mobile">{labels[0].header[activeSection]}</div>
//     <IconContext.Provider value={{ className: 'menu-icon' }}>
//       <button type="button" className="mobile-menu">
//         <FaBars aria-hidden />
//         <span className="sr-only">Open menu</span>
//       </button>
//     </IconContext.Provider>
//     <div className="options-container">
//       <div className="options">
//         <div className="search">
//           {label.header.SEARCH}
//           <IconContext.Provider value={{ className: 'search-icon' }}>
//             <button type="button" className="mobile-menu">
//               <FaSearch aria-hidden />
//             </button>
//           </IconContext.Provider>
//         </div>
//         <BrandSelector />
//         <LanguageSelector
//           activeLanguage={activeLanguage}
//           languages={headerFooter.language}
//           region={region}
//         />
//         <div className="login">{label.header.LOGIN}</div>
//       </div>
//       <div className="tagline-container">
//         <span className="tagline">{headerFooter.simpleTagline}</span>
//       </div>
//     </div>
//   </div>
//   <nav className="navigation">
//     <div className="sections">
//       {headerFooter.navigation.length > 0 &&
//         headerFooter.navigation.map(section => (
//           <NavigationDropdown key={section.TYPE} header={label.header} section={section} />
//         ))}
//     </div>
//   </nav>
// </div>
//     </>
//   );
// };

Header.defaultProps = {
  activeLanguage: '',
  activeSection: '',
  headerFooters: [],
  labels: [],
  location: {},
  navigations: [],
  region: '',
};

Header.propTypes = {
  activeLanguage: PropTypes.string,
  activeSection: PropTypes.string,
  headerFooters: PropTypes.instanceOf(Array),
  labels: PropTypes.instanceOf(Array),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  navigations: PropTypes.instanceOf(Array),
  region: PropTypes.string,
};

export default Header;
