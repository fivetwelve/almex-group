import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalHistory } from '@reach/router';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  connectRefinementList,
  InstantSearch,
  SearchBox,
  // PoweredBy,
} from 'react-instantsearch-dom';
import qs from 'qs';
import Layout from '../components/layout';
import CustomSearchResults from '../components/customSearchResults';
import { scrollTo } from '../utils/functions';
// import { STATUS } from '../constants';
import '../styles/search.scss';
import CustomPagination from '../components/customPagination';

/* Algolia declarations begin */
const algoliaClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
);
const algoliaIndex = process.env.GATSBY_ALGOLIA_INDEX;

const searchClient = {
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      });
    }
    return algoliaClient.search(requests);
  },
};
/* Algolia declarations end */

/* utility functions begin */
// const createURL = state => `?${qs.stringify(state)}`;
/* Not using createURL to avoid unnecessary reloading of page UI;
   instead using window.history.pushState and setSearchState to update URL
   and query results for better responsiveness */

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));

const updateURL = (query, page) => {
  if (typeof window !== 'undefined') {
    const loc = window.location;
    const url = `${loc.origin}${loc.pathname}?${qs.stringify({ query, page })}`;
    window.history.pushState({ url }, null, url);
  }
};
/* utility functions end */

const SearchTemplate = props => {
  const {
    // data,
    location,
    pageContext: { languages, locale, localeData, region },
  } = props;
  // const { brandNavigation, headerFooter, label, navigation } = localeData;
  const { label } = localeData;
  const [searchState, setSearchState] = useState(urlToSearchState(location));

  /* use this to 'reload' page query from header */
  if (location.search !== '' && urlToSearchState(location).query !== searchState.query) {
    setSearchState(urlToSearchState(location));
  }

  useEffect(() => {
    return globalHistory.listen(({ action }) => {
      if (action === 'POP') {
        setSearchState(urlToSearchState(globalHistory.location));
      }
    });
  }, []);

  const goToPage = (evt, page) => {
    evt.preventDefault();
    const currentSearchState = Object.assign(urlToSearchState(globalHistory.location), { page });
    setSearchState(currentSearchState);
    updateURL(currentSearchState.query, page);
    scrollTo(0);
  };

  const VirtualRefinementList = connectRefinementList(() => null);
  return (
    <Layout
      activeLanguage={locale}
      childrenClass="search-page"
      languages={languages}
      localeData={localeData}
      region={region}
    >
      <div className="search-container">
        <InstantSearch
          indexName={algoliaIndex}
          searchClient={searchClient}
          searchState={searchState}
        >
          <VirtualRefinementList attribute="page.availableIn" defaultRefinement={[region]} />
          {/* <VirtualRefinementList attribute="page.status" defaultRefinement={[STATUS.PUBLISHED]} /> */}
          <Configure
            attributesToRetrieve={[
              'brand',
              `excerpt${locale}`,
              `keywords${locale}`,
              `title${locale}`,
              'page.availableIn',
              `page.excerpt${locale}`,
              `page.slug${locale}`,
            ]}
            restrictSearchableAttributes={['brand', `keywords${locale}`, `title${locale}`]}
          />
          <div className="search-top" hidden>
            <SearchBox searchAsYouType={false} />
          </div>
          {/* <PoweredBy /> */}

          <div className="heading">
            {searchState.query && (
              <h1>
                {label && label.search.RESULTS}: {`"${searchState.query}"`}
              </h1>
            )}
            {!searchState.query && <h1>{label && label.search.PLEASE_ENTER}</h1>}
          </div>
          <CustomPagination defaultRefinement={0} goToPage={goToPage} query={searchState.query} />
          <hr />

          <CustomSearchResults label={label && label.search} locale={locale} location={location} />
          <hr />
          <CustomPagination defaultRefinement={0} goToPage={goToPage} query={searchState.query} />
        </InstantSearch>
      </div>
    </Layout>
  );
};

SearchTemplate.defaultProps = {
  data: {},
  location: {
    pathname: '',
    search: '',
    state: {},
  },
  pageContext: {},
};

SearchTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      page: PropTypes.instanceOf(Object),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.instanceOf(Object),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export default SearchTemplate;
