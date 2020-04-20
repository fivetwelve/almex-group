import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { connectStateResults } from 'react-instantsearch-dom';
import ReactMarkdown from 'react-markdown/with-html';
import { createLink } from '../utils/functions';

const StateResults = ({ label, locale, location, searchResults }) => {
  const hits = searchResults && searchResults.hits;
  const query = searchResults && searchResults.query;

  return (
    <div className="results">
      {/* {query && (
        <h1>
          {label.RESULTS}: {`"${query}"`}
        </h1>
      )}
      {!query && <h1>{label.PLEASE_ENTER}</h1>}
      <hr /> */}
      {query &&
        hits.length > 0 &&
        hits.map(hit => (
          <div className="result" key={hit.objectID}>
            <>
              <div className="title">
                <Link to={createLink(location, hit.page[`slug${locale}`])}>
                  {hit[`title${locale}`]}
                </Link>
              </div>
              <div className="body">
                <ReactMarkdown source={hit.page[`excerpt${locale}`]} />
              </div>
            </>
          </div>
        ))}
      {query && hits.length === 0 && <h2>{label.NO_RESULTS}</h2>}
    </div>
  );
};

StateResults.defaultProps = {
  label: {},
  locale: '',
  location: {},
  searchResults: {},
};

StateResults.propTypes = {
  label: PropTypes.shape({
    NO_RESULTS: PropTypes.string,
    PLEASE_ENTER: PropTypes.string,
    RESULTS: PropTypes.string,
  }),
  locale: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  searchResults: PropTypes.shape({
    query: PropTypes.string,
    hits: PropTypes.array,
  }),
};

const CustomSearchResults = connectStateResults(StateResults);

export default CustomSearchResults;
