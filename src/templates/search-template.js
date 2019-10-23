import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch-dom';
import CustomSearchResults from '../components/customSearchResults';
import Layout from '../components/layout';
import '../styles/search.scss';

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
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

const SearchTemplate = props => {
  // console.log(this.props);
  // const { error, searchData, searchQuery } = this.state;
  const { data, location, pageContext } = props;
  const { locale, region } = pageContext;
  const {
    cms: { brandNavigation, headerFooter, label, navigation },
  } = data;

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
        {/* {error && <p>{error}</p>}
        {searchData && <div>{searchData}</div>} */}
        <InstantSearch indexName="CMS" searchClient={searchClient}>
          {/* <SearchBox searchAsYouType={false} onSubmit={evt => this.handleSubmit(evt)} /> */}
          <SearchBox searchAsYouType={false} />
          {/* <Configure query={searchQuery} /> */}
          <PoweredBy />
          <CustomSearchResults locale={locale} location={location} />
          {/* <CustomStateResults /> */}
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
      page: PropTypes.shape({}),
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      prevLocation: PropTypes.string,
    }),
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
