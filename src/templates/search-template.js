import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import fetchPonyfill from 'fetch-ponyfill';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, PoweredBy } from 'react-instantsearch-dom';
import Layout from '../components/layout';

// import { Router } from '@reach/router';
// import Dashboard from '../../../components/dashboard';
// import Layout from '../../../components/layout';
// import Profile from '../../../components/profile';
// import Login from '../../../components/login';

/*
  avoid whatwg-fetch, instead use fetch-ponyfill 
  https://github.com/gatsbyjs/gatsby/issues/8612
  github.com/matthew-andrews/isomorphic-fetch/issues/174
*/

// https: // import netlifyIdentity from 'netlify-identity-widget';
// import GoTrue from 'gotrue-js';
// const auth = new GoTrue({
//   APIUrl: 'https://ag-poc.netlify.com/.netlify/identity',

//   audience: '',
//   setCookie: false,
// });
// const netlifyAuth = {
//   isAuthenticated: false,

//   user: null,
//   authenticate(callback) {
//     this.isAuthenticated = true;
//     netlifyIdentity.open();
//     netlifyIdentity.on('login', user => {
//       this.user = user;
//       callback(user);
//     });
//   },
//   signout(callback) {
//     this.isAuthenticated = false;
//     netlifyIdentity.logout();
//     netlifyIdentity.on('logout', () => {
//       this.user = null;
//       callback();
//     });
//   },
// };

// const { fetch } = fetchPonyfill();

// const searchClient = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76');
const searchClient = algoliasearch('6O98P5M1R7', 'a79828d59baa5b69ceab5d128aa2c554');

class SearchTemplate extends React.Component {
  state = {
    searchData: null,
    error: null,
  };
  // componentDidMount() {

  //   // netlifyIdentity.init({
  //   //   container: '#netlify-modal', // defaults to document.body,
  //   // });
  // }
  // state = { redirectToReferrer: false };

  componentDidMount() {
    // this.getData();
    // instantsearch.widgets.poweredBy({
    //   container: '#powered-by',
    // });
  }

  // login = evt => {
  //   evt.preventDefault();
  //   log.warn('hello');
  //   netlifyAuth.authenticate(() => {
  //     this.setState({ redirectToReferrer: true });
  //   });
  // };

  getData = () => {
    fetch('/.netlify/functions/getCustomer', {
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => {
        this.setState({
          searchData: json.msg,
          error: null,
        });
        // }
      })
      .catch(err => {
        this.setState({
          searchData: null,
          error: err,
        });
      });
  };

  render() {
    // console.log(this.props);
    const { error, searchData } = this.state;
    // const { data, location, pageContext } = this.props;
    const { data, pageContext } = this.props;
    const { locale, region } = pageContext;
    const {
      cms: { brandNavigation, headerFooter, label, navigation },
    } = data;

    return (
      // <Layout activeLanguage="EN" childrenClass="search-page" region="NORTH_AMERICA" title="">
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
        <div>
          {error && <p>{error}</p>}
          {searchData && <div>{searchData}</div>}
          <InstantSearch indexName="CMS" searchClient={searchClient}>
            <PoweredBy />
            <SearchBox />
            <h1>Search Results</h1>
            <Hits />
          </InstantSearch>
        </div>
      </Layout>
    );
  }
}

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
