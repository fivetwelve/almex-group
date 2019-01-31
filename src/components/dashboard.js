import React from 'react';
import PropTypes from 'prop-types';
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

Dashboard.defaultProps = {
  data: {},
};

Dashboard.propTypes = {
  data: PropTypes.shape({
    msg: PropTypes.object,
  }),
};

export default Dashboard;
