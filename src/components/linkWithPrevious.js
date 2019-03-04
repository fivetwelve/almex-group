import React from 'react';
import PropTypes from 'prop-types';
import { Location } from '@reach/router';
import { Link } from 'gatsby';

const LinkWithPrevious = ({ children, state, ...rest }) => (
  <Location>
    {({ location }) => (
      /* make sure user's state is not overwritten */
      <Link {...rest} state={{ prevLocation: location.pathname, ...state }}>
        {children}
      </Link>
    )}
  </Location>
);

LinkWithPrevious.defaultProps = {
  children: {},
  state: {},
};

LinkWithPrevious.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  state: PropTypes.shape({
    prevLocation: PropTypes.string,
  }),
};

// eslint-disable-next-line import/prefer-default-export
export default LinkWithPrevious;
