import React from 'react';
import PropTypes from 'prop-types';
import { connectStateResults } from 'react-instantsearch-dom';
import Markdown from 'react-remarkable';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';

const StateResults = ({ searchResults, locale, location }) => {
  // const hasResults = searchResults && searchResults.nbHits !== 0;
  // const nbHits = searchResults && searchResults.nbHits;
  const hits = searchResults && searchResults.hits;
  const query = searchResults && searchResults.query;
  // console.log(searchResults);

  return (
    <div>
      <div className="results">
        {query && <h1>Search Results</h1>}
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
                        <Markdown source={hit[`marketing${locale}`]} />
                      </div>
                    </>
                  )}
                </div>
              ),
          )}
        <hr />
      </div>
    </div>
  );
};

StateResults.defaultProps = {
  locale: '',
  location: {},
  searchResults: {},
};

StateResults.propTypes = {
  locale: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
  }),
  searchResults: PropTypes.shape({
    query: PropTypes.string,
  }),
};

const CustomSearchResults = connectStateResults(StateResults);

export default CustomSearchResults;
