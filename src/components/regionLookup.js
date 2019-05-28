import React from 'react';
import { fetch, getRegion } from '../utils/functions';
// import Dump from '../utils/dump';

class RegionLookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      region: null,
    };
  }

  componentDidMount() {
    // 3rd party api to get country code from visitor's IP address
    fetch('https://ipapi.co/json/', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(json => {
        const region = getRegion(json.country);
        this.setState({
          error: null,
          region,
        });
      })
      .catch(err => {
        this.setState({
          region: null,
          error: err,
        });
      });
  }

  render() {
    // const { data, error, region } = this.state;
    const { error, region } = this.state;
    return (
      <>
        <div>
          {/* <Dump src={data} /> */}
          {error && (
            <>
              <p>Error</p>
              <p>{error}</p>
            </>
          )}
          {region && <p>Office Region: {region}</p>}
        </div>
      </>
    );
  }
}

export default RegionLookup;
