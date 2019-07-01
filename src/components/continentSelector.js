import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { CONTINENTS } from '../constants';

class ContinentSelector extends Component {
  constructor(props) {
    super(props);
    this.dropdownTrigger = React.createRef();
    this.state = {
      clicked: false,
      /* want to use following sort order rather than just equating to CONTINENTS */
      continents: [
        CONTINENTS.GLOBAL,
        CONTINENTS.AFRICA,
        CONTINENTS.ASIA,
        CONTINENTS.AUSTRALIA,
        CONTINENTS.EUROPE,
        CONTINENTS.NORTH_AMERICA,
        CONTINENTS.SOUTH_AMERICA,
      ],
    };
  }

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.nextElementSibling.classList.toggle('continent-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  handleClickContinent = (evt, continent) => {
    const { setContinent } = this.props;
    evt.preventDefault();
    setContinent(continent);
    this.dropdownTrigger.current.nextElementSibling.classList.toggle('continent-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  render() {
    const { continent, labels } = this.props;
    const { clicked, continents } = this.state;

    return (
      <div className="continent-selector">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className="continent__trigger"
          onClick={evt => {
            this.handleClickDropDown(evt);
          }}
          ref={this.dropdownTrigger}
        >
          <span className="dd-text-icon">
            {labels[continent]}
            <span aria-hidden="true" className="dd-icon">
              <IconContext.Provider value={{ className: 'brands-icon' }}>
                {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
              </IconContext.Provider>
            </span>
          </span>
        </button>
        <ul role="menu" className="continent-dropdown">
          {continents.map(thisContinent => {
            if (thisContinent !== continent) {
              return (
                <li className="continent-list-item" key={thisContinent}>
                  <button
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="false"
                    onClick={evt => {
                      this.handleClickContinent(evt, thisContinent);
                    }}
                  >
                    <span className="continent-link">{labels[thisContinent]}</span>
                  </button>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );
  }
}

ContinentSelector.defaultProps = {
  continent: '',
  labels: {},
  setContinent: () => CONTINENTS.ALL_EVENTS,
};

ContinentSelector.propTypes = {
  continent: PropTypes.string,
  labels: PropTypes.objectOf(PropTypes.string),
  setContinent: PropTypes.func,
};

export default ContinentSelector;
