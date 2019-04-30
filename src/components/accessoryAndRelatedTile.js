import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';

const AccessoryAndRelatedTile = ({ image, location, slug, title }) => (
  <>
    <div className="tile">
      <div className="title">{title}</div>
      <Link to={createLink(location, slug)}>
        <div className="sr-only">{title}</div>
        <div className="image-container">
          {image ? (
            <img src={image.url} alt="" />
          ) : (
            <img src="https://placehold.it/275x275" alt="" />
          )}
        </div>
      </Link>
    </div>
  </>
);

AccessoryAndRelatedTile.defaultProps = {
  image: {},
  location: {},
  slug: '',
  title: '',
};

AccessoryAndRelatedTile.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  slug: PropTypes.string,
  title: PropTypes.string,
};

export default AccessoryAndRelatedTile;
