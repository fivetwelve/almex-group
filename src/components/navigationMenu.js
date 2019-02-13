import React from 'react';
import PropTypes from 'prop-types';

class NavigationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.trigger = React.createRef();
    this.menu = React.createRef();
  }

  handleClickDropDown = evt => {
    // const { closeOtherMenus, section } = this.props;
    evt.preventDefault();
    evt.target.classList.toggle('is-open');
    this.menu.current.classList.toggle('visible');
    // closeOtherMenus(section.TYPE);
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  };

  closeMenu = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.menu.current.classList.toggle('visible');
    }
  };

  render() {
    const { header, section } = this.props;

    return (
      <div className="section-container">
        <div className="section">
          <button
            type="button"
            aria-expanded="false"
            aria-haspopup="true"
            className="section-trigger"
            onClick={evt => {
              this.handleClickDropDown(evt);
            }}
            ref={this.trigger}
          >
            {header[section.TYPE]}
            <span className="indicator" />
          </button>
        </div>
        {/* {section.TYPE === 'PRODUCTS' && ( */}
        <div className="section-menu-container" ref={this.menu}>
          <div className="title">{header[section.TYPE]}</div>
          <div className="menu-container">
            <div className="category">
              <a href="/">Belt Accessories</a>
            </div>
            <div className="category">
              <a href="/">Belt Monitoring</a>
            </div>
            <div className="category">
              <a href="/">Belt Repair and Maintenance</a>
            </div>
            <div className="category">
              <a href="/">Belt Repair Power Tools</a>
            </div>
            <div className="category">
              <a href="/">Control Systems</a>
            </div>
            <div className="category">
              <a href="/">Dust Suppression</a>
            </div>
            <div className="category">
              <a href="/">Fluid and Pressure Pumps</a>
            </div>
            <div className="category">
              <a href="/">HeavyWeight Presses</a>
            </div>
            <div className="category">
              <a href="/">Idlers and Rollers</a>
            </div>
            <div className="category">
              <a href="/">Industrial</a>
            </div>
            <div className="category">
              <a href="/">Lightweight</a>
            </div>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

NavigationMenu.defaultProps = {
  // closeOtherMenus: () => {},
  header: {},
  section: {},
};

NavigationMenu.propTypes = {
  // closeOtherMenus: PropTypes.func,
  header: PropTypes.shape({
    ABOUT: PropTypes.string,
    BRANDS: PropTypes.string,
    INDUSTRIES: PropTypes.string,
    LOGIN: PropTypes.string,
    MORE: PropTypes.string,
    PRODUCTS: PropTypes.string,
    SEARCH: PropTypes.string,
    SERVICES: PropTypes.string,
    SUPPORT: PropTypes.string,
  }),
  section: PropTypes.shape({
    ITEMS: PropTypes.array,
    PATH: PropTypes.string,
    TYPE: PropTypes.string,
  }),
};

export default NavigationMenu;
