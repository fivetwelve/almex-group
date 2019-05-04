import React from 'react';

/* need this in order to target nav DOM element from header */
const NavWrapper = React.forwardRef((props, ref) => (
  <nav {...props} ref={ref} className="navigation" />
));

export default NavWrapper;
