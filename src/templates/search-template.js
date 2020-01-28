import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { globalHistory } from '@reach/router';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  connectRefinementList,
  InstantSearch,
  SearchBox,
} from 'react-instantsearch-dom';
import qs from 'qs';
import Layout from '../components/layout';
import CustomSearchResults from '../components/customSearchResults';
import { STATUS } from '../constants';
import '../styles/search.scss';

/* Algolia declarations begin */
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
/* Algolia declarations end */

/* utility functions begin */
const createURL = state => `?${qs.stringify(state)}`;

const urlToSearchState = ({ search }) => qs.parse(search.slice(1));
/* utility functions end */

const SearchTemplate = props => {
  const { data, location, pageContext } = props;
  const { locale, region } = pageContext;
  const {
    cms: { brandNavigation, headerFooter, label, navigation },
  } = data;
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

  const VirtualRefinementList = connectRefinementList(() => null);

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="search-page"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
    >
      <div className="search-container">
        <InstantSearch
          indexName="CMS"
          searchClient={searchClient}
          searchState={searchState}
          createURL={createURL}
        >
          <VirtualRefinementList attribute="page.availableIn" defaultRefinement={[region]} />
          <VirtualRefinementList attribute="page.status" defaultRefinement={[STATUS.PUBLISHED]} />
          <Configure
            attributesToRetrieve={[
              'brand',
              `excerpt${locale}`,
              `keywords${locale}`,
              `title${locale}`,
              'page.status',
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
          <CustomSearchResults label={label.search} locale={locale} location={location} />
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
      brandNavigation: PropTypes.object,
      headerFooter: PropTypes.object,
      label: PropTypes.object,
      navigation: PropTypes.object,
      page: PropTypes.object,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object,
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
