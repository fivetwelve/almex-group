import React from 'react';
import { fetch } from '../utils/functions';

class RegionLookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
  }

  componentDidMount() {
    this.getRegion();
  }

  getRegion = () => {
    fetch('/.netlify/functions/getRegion', {
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
        // console.log(json.msg);
      })
      .catch(err => {
        this.setState({
          data: null,
          error: err,
        });
        // console.error('Error!');
        // console.log(err);
      });
  };

  render() {
    const { data, error } = this.state;
    return (
      <>
        <div>
          <p>Data</p>
          <p>{data}</p>
          <p>Error</p>
          <p>{error}</p>
        </div>
      </>
    );
  }
}

export default RegionLookup;
