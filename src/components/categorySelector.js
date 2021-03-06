import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

class CategorySelector extends Component {
  constructor(props) {
    super(props);
    const { categories } = props;
    this.dropdownTrigger = React.createRef();
    this.state = {
      clicked: false,
      categories,
    };
  }

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.nextElementSibling.classList.toggle('category-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  handleClickCategory = (evt, key) => {
    const { setCategory } = this.props;
    evt.preventDefault();
    setCategory(key);
    this.dropdownTrigger.current.nextElementSibling.classList.toggle('category-dropdown--visible');
    this.setState({ clicked: false });
  };

  render() {
    const { clicked, categories } = this.state;
    const { selectedCategory, label } = this.props;
    return (
      <div className="category-selector">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
          className="category__trigger"
          onClick={evt => {
            this.handleClickDropDown(evt);
          }}
          ref={this.dropdownTrigger}
        >
          <span className="dd-text-icon">
            {!selectedCategory ? label.SELECT : selectedCategory.name}
            <span aria-hidden="true" className="dd-icon">
              <IconContext.Provider value={{ className: 'dd-color' }}>
                {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
              </IconContext.Provider>
            </span>
          </span>
        </button>
        <ul role="menu" className="category-dropdown">
          {categories.map(category => {
            if (!selectedCategory || category.id !== selectedCategory.id) {
              return (
                <li className="category-list-item" key={category.id}>
                  <button
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="false"
                    onClick={evt => {
                      this.handleClickCategory(evt, category.id);
                    }}
                  >
                    <span className="category-link">{category.name}</span>
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

CategorySelector.defaultProps = {
  categories: [],
  selectedCategory: null,
  label: {},
  setCategory: () => {},
};

CategorySelector.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isProductCategory: PropTypes.bool,
      page: PropTypes.instanceOf(Object),
      documents: PropTypes.instanceOf(Array),
    }),
  ),
  label: PropTypes.objectOf(PropTypes.string),
  selectedCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  setCategory: PropTypes.func,
};

export default CategorySelector;
