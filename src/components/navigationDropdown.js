import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import shortid from 'shortid';
import { createLinkFromPage, getTitle } from '../utils/functions';

class NavigationDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.trigger = React.createRef();
  }

  handleClick = evt => {
    const { handleMenuItem, isOpen, section } = this.props;
    evt.preventDefault();
    if (!isOpen) {
      handleMenuItem(section.type);
    } else {
      handleMenuItem('');
    }
  };

  closeMenu = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.menu.current.classList.toggle('visible');
    }
  };

  render() {
    const { activeLanguage, isOpen, location, section } = this.props;
    return (
      <div className="section-container">
        <div className="section">
          <button
            type="button"
            aria-expanded="false"
            aria-haspopup="true"
            className={`section-trigger ${isOpen ? 'is-open' : ''}`}
            onClick={evt => {
              this.handleClick(evt);
            }}
            ref={this.trigger}
          >
            {section[`title${activeLanguage}`]}
            <span className="indicator" />
          </button>
        </div>
        <div className={`section-menu-container ${isOpen ? 'visible' : ''}`}>
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
      </div>
    );
  }
}

NavigationDropdown.defaultProps = {
  handleMenuItem: () => {},
  activeLanguage: '',
  isOpen: false,
  location: {},
  section: {},
};

NavigationDropdown.propTypes = {
  handleMenuItem: PropTypes.func,
  activeLanguage: PropTypes.string,
  isOpen: PropTypes.bool,
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
