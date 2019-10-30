import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { globalHistory } from '@reach/router';
import algoliasearch from 'algoliasearch/lite';
import qs from 'qs';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch-dom';
import CustomSearchResults from '../components/customSearchResults';
import Layout from '../components/layout';
import { makeid } from '../utils/functions';
import '../styles/search.scss';

const algoliaClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
);
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

// const history = createHistory(window);
// console.log('history');
// console.log(history);

/* utility functions */
const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = searchState => (searchState ? createURL(searchState) : '');

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));

const SearchTemplate = props => {
  const { data, location, pageContext } = props;
  const { locale, region } = pageContext;
  const {
    cms: { brandNavigation, headerFooter, label, navigation },
  } = data;
  const [searchState, setSearchState] = useState(urlToSearchState(location));

  useEffect(() => {
    return globalHistory.listen(({ action }) => {
      if (action === 'POP') {
        setSearchState(urlToSearchState(globalHistory.location));
      }
    });
  }, []);

  const onSearchStateChange = updatedSearchState => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ key: makeid() }, '', searchStateToUrl(updatedSearchState));
    }
    // history.location.pushState({ key: makeid() }, '', searchStateToUrl(updatedSearchState));
    setSearchState(updatedSearchState);
  };

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="search"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      <div className="search-container">
        <InstantSearch
          indexName="CMS"
          searchClient={searchClient}
          searchState={searchState}
          onSearchStateChange={onSearchStateChange}
          createURL={createURL}
        >
          {/* <SearchBox searchAsYouType={false} onSubmit={evt => this.handleSubmit(evt)} /> */}
          <SearchBox searchAsYouType={false} />
          <PoweredBy />
          <CustomSearchResults locale={locale} location={location} />
        </InstantSearch>
      </div>
    </Layout>
  );
};

SearchTemplate.defaultProps = {
  data: {},
  location: {
    state: {},
  },
  pageContext: {},
};

SearchTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    // state: PropTypes.shape({
    //   prevLocation: PropTypes.string,
    // }),
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      label(where: { availableIn: $region }) {
        search(locale: $locale)
      }
    }
  }
`;

export default SearchTemplate;
