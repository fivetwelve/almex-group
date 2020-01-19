import React from 'react';
import fetchPonyfill from 'fetch-ponyfill';
import Dashboard from '../../../components/dashboard';

/*
  avoid whatwg-fetch, instead use fetch-ponyfill 
  https://github.com/gatsbyjs/gatsby/issues/8612
  github.com/matthew-andrews/isomorphic-fetch/issues/174
*/

const { fetch } = fetchPonyfill();

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

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
