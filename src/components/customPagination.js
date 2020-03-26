import React from 'react';
import PropTypes from 'prop-types';
import { connectPagination } from 'react-instantsearch-dom';
import { makeid } from '../utils/functions';

const PAGE_DISPLAY_LIMIT = 6;

const pagesWithNoOverflow = (currentRefinement, goToPage, nbPages) =>
  new Array(nbPages).fill(null).map((_, index) => {
    const page = index + 1;

    return (
      <li key={makeid()}>
        {currentRefinement === page ? (
          <div className="no-link">{page}</div>
        ) : (
          // <a href={createURL(page)}>{page}</a>
          <button className="page" type="button" onClick={evt => goToPage(evt, page)}>
            {page}
          </button>
        )}
      </li>
    );
  });

const pagesWithOverflow = (currentRefinement, goToPage, nbPages) => {
  /* n.b. currentRefinement is the page # */
  const distanceFromEnd = nbPages - currentRefinement;
  const startIndex =
    distanceFromEnd >= PAGE_DISPLAY_LIMIT ? currentRefinement - 1 : nbPages - PAGE_DISPLAY_LIMIT;
  const endIndex = startIndex + PAGE_DISPLAY_LIMIT;

  return new Array(nbPages).fill(null, startIndex, endIndex).map((_, index) => {
    const page = index + 1;
    return (
      <li key={makeid()}>
        {currentRefinement === page ? (
          <div className="no-link">{page}</div>
        ) : (
          <button className="page" type="button" onClick={evt => goToPage(evt, page)}>
            {page}
          </button>
        )}
      </li>
    );
  });
};

const Pagination = ({ currentRefinement, goToPage, nbPages, query }) => {
  return (
    nbPages > 1 && (
      <ul className="pagination">
        {/* prev page arrow */}
        <li className="arrow">
          {currentRefinement > 1 ? (
            <button
              className="page"
              type="button"
              onClick={evt => goToPage(evt, currentRefinement - 1)}
            >
              <div className="l-arrow">&#x25B8;</div>
            </button>
          ) : (
            <div className="no-link">
              <span className="l-arrow">&#x25B8;</span>
            </div>
          )}
        </li>
        {nbPages <= PAGE_DISPLAY_LIMIT &&
          pagesWithNoOverflow(currentRefinement, goToPage, nbPages, query)}
        {nbPages > PAGE_DISPLAY_LIMIT &&
          pagesWithOverflow(currentRefinement, goToPage, nbPages, query)}
        {/* next page arrow */}
        <li className="arrow">
          {currentRefinement < nbPages ? (
            <button
              className="page r-arrow"
              type="button"
              onClick={evt => goToPage(evt, currentRefinement + 1)}
            >
              <div className="r-arrow">&#x25B8;</div>
            </button>
          ) : (
            <div className="no-link">
              <span className="r-arrow">&#x25B8;</span>
            </div>
          )}
        </li>
      </ul>
    )
  );
};

Pagination.defaultProps = {
  currentRefinement: 0,
  goToPage: () => null,
  nbPages: 0,
  query: '',
};

Pagination.propTypes = {
  currentRefinement: PropTypes.number,
  goToPage: PropTypes.func,
  nbPages: PropTypes.number,
  query: PropTypes.string,
};

const CustomPagination = connectPagination(Pagination);

export default CustomPagination;
