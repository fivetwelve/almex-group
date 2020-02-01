import React from 'react';
import PropTypes from 'prop-types';
import { connectPagination } from 'react-instantsearch-dom';
import { makeid } from '../utils/functions';

const PAGE_DISPLAY_LIMIT = 6;

const pagesWithNoOverflow = (createURL, currentRefinement, nbPages) =>
  new Array(nbPages).fill(null).map((_, index) => {
    const page = index + 1;

    return (
      <li key={makeid()}>
        {currentRefinement === page ? (
          <span className="no-link">{page}</span>
        ) : (
          <a href={createURL(page)}>{page}</a>
        )}
      </li>
    );
  });

const pagesWithOverflow = (createURL, currentRefinement, nbPages) => {
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
          <span className="no-link">{page}</span>
        ) : (
          <a href={createURL(page)}>{page}</a>
        )}
      </li>
    );
  });
};

const Pagination = ({ currentRefinement, nbPages, createURL }) => {
  return (
    nbPages > 1 && (
      <ul className="pagination">
        {/* prev page arrow */}
        <li className="nav-arrow">
          {currentRefinement > 1 ? (
            <a href={createURL(currentRefinement - 1)}>&lsaquo;</a>
          ) : (
            <span className="no-link">&lsaquo;</span>
          )}
        </li>
        {nbPages <= PAGE_DISPLAY_LIMIT &&
          pagesWithNoOverflow(createURL, currentRefinement, nbPages)}
        {nbPages > PAGE_DISPLAY_LIMIT && pagesWithOverflow(createURL, currentRefinement, nbPages)}
        {/* next page arrow */}
        <li className="nav-arrow">
          {currentRefinement < nbPages ? (
            <a href={createURL(currentRefinement + 1)}>&rsaquo;</a>
          ) : (
            <span className="no-link">&rsaquo;</span>
          )}
        </li>
      </ul>
    )
  );
};

Pagination.defaultProps = {
  // currentRefinement: '';
  nbPages: 0,
};

Pagination.propTypes = {
  nbPages: PropTypes.number,
};

const CustomPagination = connectPagination(Pagination);

export default CustomPagination;
