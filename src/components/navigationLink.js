import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { createLinkFromPage, makeid } from '../utils/functions';

const NavigationLink = props => {
  const { activeLanguage, location, section } = props;

  return (
    <div className="section-container" key={makeid()}>
      <div className="section">
        <div className="section-link">
          <Link to={createLinkFromPage(location, section.pages[0], activeLanguage)}>
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
          </Link>
        </div>
      </div>
    </div>
  );
};

NavigationLink.defaultProps = {
  activeLanguage: '',
  location: {},
  section: {},
};

NavigationLink.propTypes = {
  activeLanguage: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  section: PropTypes.shape({
    pages: PropTypes.instanceOf(Array),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default NavigationLink;
