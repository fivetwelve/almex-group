import React from 'react';
import PropType from 'prop-types';
import '../styles/header.scss';
import Dump from '../utils/dump';

const Header = props => {
  const { activeTab } = props;
  const status = `${activeTab} is the active tab`;
  return (
    <div className="header1">
      {status}
      <Dump data={activeTab} />
    </div>
  );
};

Header.defaultProps = {
  activeTab: {},
};

Header.propTypes = {
  activeTab: PropType.string,
};

export default Header;
