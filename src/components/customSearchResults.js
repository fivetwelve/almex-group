import React from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import ReactMarkdown from 'react-markdown';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';

const StateResults = ({ label, locale, location, searchResults }) => {
  // const hasResults = searchResults && searchResults.nbHits !== 0;
  // const nbHits = searchResults && searchResults.nbHits;
  const hits = searchResults && searchResults.hits;
  const query = searchResults && searchResults.query;
  // console.log('searchResults:', searchResults);
  return (
    <div>
      <div className="results">
        {query && (
          <h1>
            {label.RESULTS}: {`"${query}"`}
          </h1>
        )}
        {query &&
          hits.map(
            hit =>
              hit.page && (
                <div className="result" key={hit.objectID}>
                  {hit.page && hit.page.status === 'PUBLISHED' && (
                    <>
                      <div className="title">
                        <Link to={createLink(location, hit.page[`slug${locale}`])}>
                          {hit[`title${locale}`]}
                        </Link>
                      </div>
                      <div className="body">
                        <ReactMarkdown source={hit[`marketing${locale}`]} />
                      </div>
                    </>
                  )}
                </div>
              ),
          )}
        {query && hits.length === 0 && <h2>{label.NO_RESULTS}</h2>}
        {!query && <h1>{label.PLEASE_ENTER}</h1>}
        <hr />
      </div>
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
