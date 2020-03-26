import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { createLink } from '../utils/functions';
import fallbackTile from '../../static/img/fallback_500x235.jpg';

const AccessoryAndRelatedTile = ({ location, slug, tile, title }) => (
  <>
    <Link to={createLink(location, slug)}>
      <div className="tile">
        <div className="title">{title}</div>
        <div className="sr-only">{title}</div>
        <div className="image-container">
          <img src={(tile && tile.url) || fallbackTile} alt={title} />
        </div>
      </div>
    </Link>
  </>
);

AccessoryAndRelatedTile.defaultProps = {
  location: {},
  slug: '',
  tile: {},
  title: '',
};

AccessoryAndRelatedTile.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  slug: PropTypes.string,
  tile: PropTypes.shape({
    url: PropTypes.string,
    handle: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  title: PropTypes.string,
};

export default AccessoryAndRelatedTile;
