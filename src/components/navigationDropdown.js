import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { createLinkFromPage, getTitle, makeid } from '../utils/functions';
import CloseButton from './closeButton';

const NavigationDropdown = props => {
  const { activeLanguage, handleMenuItem, isOpen, label, location, section } = props;
  // console.log(section);

  const handleClick = evt => {
    evt.preventDefault();
    if (!isOpen) {
      handleMenuItem(section.type);
    } else {
      handleMenuItem('');
    }
  };

  // Determine title and assign it to a new property;
  // also avoids future redundant getTitle calls.
  // Use getTitle here because we want the menu to use the source
  // title and not page title which could vary for mktg purposes.
  section.pages.forEach(page => {
    Object.defineProperty(page, 'title', {
      value: getTitle(page),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  // sort pages alphabetically
  section.pages.sort((a, b) => {
    // TODO: need to ensure activeLanguage param is valid value for localeCompare
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    // -1 sort string ascending
    //  1 sort string descending;
    //  0 no sorting
    return titleA.localeCompare(titleB, activeLanguage);
  });

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
          {section.title}
          <span className="chevron">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="chevron-double-right"
              className="svg-inline--fa fa-chevron-double-right fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M477.5 273L283.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9l154-154.7-154-154.7c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0L477.5 239c9.3 9.4 9.3 24.6 0 34zm-192-34L91.1 44.7c-9.4-9.4-24.6-9.4-33.9 0L34.5 67.4c-9.4 9.4-9.4 24.5 0 33.9l154 154.7-154 154.7c-9.3 9.4-9.3 24.5 0 33.9l22.7 22.7c9.4 9.4 24.6 9.4 33.9 0L285.5 273c9.3-9.4 9.3-24.6 0-34z"
              />
            </svg>
          </span>
          <span className="indicator" />
        </button>
      </div>
      <div className={`section-menu-container ${isOpen ? 'visible' : ''}`}>
        <CloseButton closeMenu={handleMenuItem} label={label} />
        <div className="title">{section.title}</div>
        <div className="menu-container">
          {section.pages.map(page => (
            <div className="category" key={makeid()}>
              <Link to={createLinkFromPage(location, page, activeLanguage)}>
                <span className="link-text">{page.title}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

NavigationDropdown.defaultProps = {
  handleMenuItem: () => {},
  activeLanguage: '',
  isOpen: false,
  label: {},
  location: {},
  section: {},
};

NavigationDropdown.propTypes = {
  handleMenuItem: PropTypes.func,
  activeLanguage: PropTypes.string,
  isOpen: PropTypes.bool,
  label: PropTypes.shape({
    CLOSE: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  section: PropTypes.shape({
    type: PropTypes.string,
  }),
};

export default NavigationDropdown;
