import React from 'react';
import PropTypes from 'prop-types';
// import Markdown from 'react-remarkable';
import { productType } from '../types';
import Dump from '../utils/dump';

// const allowHTML = { html: true };

const LandingTemplate = ({ data, pageContext }) => (
  <div>
    <h2>{pageContext.title}</h2>
    <Dump data={data} />
  </div>
);

LandingTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

LandingTemplate.propTypes = {
  data: productType,
  pageContext: PropTypes.shape({
    pageSlug: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default LandingTemplate;
