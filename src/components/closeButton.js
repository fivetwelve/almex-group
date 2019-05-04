import React from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';

const CloseButton = props => {
  const { closeMenu, label } = props;
  const handleClick = evt => {
    evt.preventDefault();
    closeMenu('');
  };

  return (
    <button
      type="button"
      aria-expanded="false"
      aria-haspopup="true"
      className="close"
      onClick={evt => {
        handleClick(evt);
      }}
    >
      <span className="sr-only">{label.CLOSE}</span>
      <span aria-hidden="true" className="left-controls-icon">
        <IconContext.Provider value={{ className: 'left-controls-icon' }}>
          <FaTimes aria-hidden />
        </IconContext.Provider>
      </span>
    </button>
  );
};

CloseButton.defaultProps = {
  closeMenu: () => {},
  label: {},
};

CloseButton.propTypes = {
  closeMenu: PropTypes.func,
  label: PropTypes.shape({
    CLOSE: PropTypes.string,
  }),
};

export default CloseButton;
