import React from 'react';
import PropTypes from 'prop-types';

/* need this in order to target nav DOM element from header */
const NavWrapper = React.forwardRef((props, ref) => {
  const { children } = props;

  return (
    <nav ref={ref} className="navigation">
      {children}
    </nav>
  );
});

NavWrapper.defaultProps = {
  children: {},
};

NavWrapper.propTypes = {
  children: PropTypes.node,
};

export default NavWrapper;
