import React from 'react';
import fetchPonyfill from 'fetch-ponyfill';
// import { Router } from '@reach/router';
import Dashboard from '../../../components/dashboard';
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

const { fetch } = fetchPonyfill();

class DashboardPage extends React.Component {
  state = {
    data: null,
    error: null,
  };
  // componentDidMount() {

  //   // netlifyIdentity.init({
  //   //   container: '#netlify-modal', // defaults to document.body,
  //   // });
  // }
  // state = { redirectToReferrer: false };

  componentDidMount() {
    this.getData();
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
          data: json.msg,
          error: null,
        });
        // }
      })
      .catch(err => {
        this.setState({
          data: null,
          error: err,
        });
      });
  };

  render() {
    // const user = auth.currentUser();
    // user
    //   .logout()
    //   .then(response => console.log("User logged out");)
    //   .catch(error => {
    //     console.log("Failed to logout user: %o", error);
    //     throw error;
    //   });
    // const { redirectToReferrer } = this.state;

    // if (redirectToReferrer)
    //   return (
    //     <button onClick={this.login} type="button">
    //       Log in
    //     </button>
    //   );
    const { error, data } = this.state;
    return (
      // <Layout
      //   activeLanguage="EN"
      //   childrenClass="dashboard-page"
      //   region="NORTH_AMERICA"
      //   title=""
      // >
      <div>
        <h1>Dashboard Container</h1>
        {error && <p>{error}</p>}
        {/* {data} */}
        <Dashboard data={data} />
        {/* <button onClick={evt => this.login(evt)} type="button">
          Log in
        </button> */}
      </div>
      // </Layout>
    );
  }
}

export default DashboardPage;
