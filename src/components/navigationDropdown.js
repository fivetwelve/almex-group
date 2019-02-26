import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import shortid from 'shortid';
import { createLinkFromPage, getTitle } from '../utils/functions';

class NavigationDropdown extends React.Component {
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
    const { activeLanguage, location, section } = this.props;
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
            {section[`title${activeLanguage}`]}
            <span className="indicator" />
          </button>
        </div>
        <div className="section-menu-container" ref={this.menu}>
          <div className="title">{section[`title${activeLanguage}`]}</div>
          <div className="menu-container">
            {section.pages.map(page => (
              <div className="category" key={shortid.generate()}>
                <Link to={createLinkFromPage(location, page, activeLanguage)}>
                  {getTitle(page, activeLanguage)}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

NavigationDropdown.defaultProps = {
  // closeOtherMenus: () => {},
  activeLanguage: '',
  location: {},
  section: {},
};

NavigationDropdown.propTypes = {
  // closeOtherMenus: PropTypes.func,
  activeLanguage: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  section: PropTypes.shape({
    ITEMS: PropTypes.array,
    PATH: PropTypes.string,
    TYPE: PropTypes.string,
  }),
};

export default NavigationDropdown;
