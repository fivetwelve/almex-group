import React from 'react';
// import { Router } from '@reach/router';
import { fetch } from 'whatwg-fetch';
// import netlifyIdentity from 'netlify-identity-widget';

// import GoTrue from 'gotrue-js';
import Dashboard from '../../../components/dashboard';
import Layout from '../../../components/layout';
// import Profile from '../../../components/profile';
// import Login from '../../../components/login';

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
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
      <Layout
        activeLanguage="EN"
        activeSection=""
        childrenClass="dashboard-page"
        region="NORTH_AMERICA"
        title=""
      >
        {error && <p>{error}</p>}
        <Dashboard data={data} />
        {/* <button onClick={evt => this.login(evt)} type="button">
          Log in
        </button> */}
      </Layout>
    );
  }
}

export default DashboardPage;
