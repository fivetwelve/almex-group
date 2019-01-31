import React from 'react';
import Dump from '../utils/dump';

const Dashboard = props => {
  const { data } = props;
  return (
    <>
      {data && (
        <>
          <Dump src={data} />
        </>
      )}
    </>
  );
};

export default Dashboard;
