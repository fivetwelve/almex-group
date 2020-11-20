import React from 'react';
import PropTypes from 'prop-types';
import GraphImg from 'graphcms-image';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';

function getBanner(location, alternativeBanner) {
  if (alternativeBanner.page) {
    return (
      <Link to={createLink(location, alternativeBanner.page.slug)} target="">
        <div className="alternative-banner-wrapper">
          <GraphImg image={alternativeBanner.image} maxWidth={1280} />
        </div>
      </Link>
    );
  }

  if (alternativeBanner.externalLink) {
    return (
      <a rel="noopener noreferrer" href={alternativeBanner.externalLink} target="_blank">
        <div className="alternative-banner-wrapper">
          <GraphImg image={alternativeBanner.image} maxWidth={1280} />
        </div>
      </a>
    );
  }

  return (
    <div className="alternative-banner-wrapper">
      <GraphImg image={alternativeBanner.image} maxWidth={1280} />
    </div>
  );
}

const AlternativeBanner = ({ location, alternativeBanner }) => (
  <>{getBanner(location, alternativeBanner)}</>
);

AlternativeBanner.defaultProps = {
  location: {},
  alternativeBanner: {},
};

AlternativeBanner.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  alternativeBanner: PropTypes.shape({
    image: PropTypes.shape({
      handle: PropTypes.string,
      height: PropTypes.number,
      width: PropTypes.number,
    }),
    page: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }),
};

export default AlternativeBanner;
