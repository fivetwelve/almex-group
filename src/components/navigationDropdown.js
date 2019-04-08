import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import shortid from 'shortid';
import { createLinkFromPage, getTitle } from '../utils/functions';
import CloseButton from './closeButton';

const NavigationDropdown = props => {
  const { activeLanguage, handleMenuItem, isOpen, location, section } = props;

  const handleClick = evt => {
    evt.preventDefault();
    if (!isOpen) {
      handleMenuItem(section.type);
    } else {
      handleMenuItem('');
    }
  };

  return (
    <div className="section-container">
      <div className="section">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className={`section-trigger ${isOpen ? 'is-open' : ''}`}
          onClick={evt => {
            handleClick(evt);
          }}
        >
          {section[`title${activeLanguage}`]}
          <span className="indicator" />
        </button>
      </div>
      <div className={`section-menu-container ${isOpen ? 'visible' : ''}`}>
        <CloseButton closeMenu={handleMenuItem} />
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
};
// }

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
    type: PropTypes.string,
  }),
};

export default NavigationDropdown;
