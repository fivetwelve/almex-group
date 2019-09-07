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
      /* want to use following sort order rather than just equating to CONTINENTS */
      categories: this.getCategoryTitles(categories),
    };
  }

  getCategoryTitles = categories => {
    // console.log(categories);
    const titleArray = [];
    categories.forEach(category => {
      // console.log(category);
      if (category.page.pageType === 'LANDING') {
        titleArray.push(category.page.landingSource.title);
      }
    });
    // console.log(titleArray);
    return titleArray;
  };

  handleClickDropDown = evt => {
    evt.preventDefault();
    evt.target.nextElementSibling.classList.toggle('category-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  handleClickCategory = (evt, category) => {
    const { setCategory } = this.props;
    evt.preventDefault();
    setCategory(category);
    this.dropdownTrigger.current.nextElementSibling.classList.toggle('category-dropdown--visible');
    this.setState(prevState => {
      const clickBool = prevState.clicked;
      return { clicked: !clickBool };
    });
  };

  render() {
    const { clicked, categories } = this.state;
    const { category, label } = this.props;

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
            {category === '' ? label.SELECT : category}
            <span aria-hidden="true" className="dd-icon">
              <IconContext.Provider value={{ className: 'dd-color' }}>
                {(clicked && <FaAngleUp aria-hidden />) || <FaAngleDown aria-hidden />}
              </IconContext.Provider>
            </span>
          </span>
        </button>
        <ul role="menu" className="category-dropdown">
          {categories.map(eachCategory => {
            if (eachCategory !== category) {
              return (
                <li className="category-list-item" key={eachCategory}>
                  <button
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="false"
                    onClick={evt => {
                      this.handleClickCategory(evt, eachCategory);
                    }}
                  >
                    <span className="category-link">{eachCategory}</span>
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
  category: '',
  categories: [],
  label: {},
  // setCategory: () => CONTINENTS.ALL_EVENTS,
  setCategory: () => {},
};

CategorySelector.propTypes = {
  category: PropTypes.string,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      isProductCategory: PropTypes.bool,
      page: PropTypes.object,
      documents: PropTypes.array,
    }),
  ),
  label: PropTypes.objectOf(PropTypes.string),
  setCategory: PropTypes.func,
};

export default CategorySelector;
