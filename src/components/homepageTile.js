import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Markdown from 'react-remarkable';
import { createLink } from '../utils/functions';
import '../styles/homepageTile.scss';

const HomepageTile = ({ data, labels, location }) => {
  const { image, title, description, page } = data;
  const imageStyle = {
    backgroundImage: `url(${(image && image.url) || page.tile.url})`,
  };

  return (
    <div className="homepage-tile">
      <div className="tile-title">
        <h3>{title}</h3>
      </div>
      <div className="image-container">
        <div className="background" style={imageStyle} />
        <div className="overlay">
          <div className="text-container">
            <span className="overlay-title">{title}</span>
            {/* <div className="overlay-subtitle">
              <span className="indicator">&#9650;</span>
              <span className="subtitle">{subtitle}</span>
            </div> */}
          </div>
        </div>
      </div>
      <div className="description">
        <Markdown source={description} options={{ html: true }} />
        <div className="more-container">
          <Link to={(page && createLink(location, page.slug)) || createLink(location, '')}>
            <span className="more">{labels.common.MORE}</span>
            <span className="more-arrow">&nbsp;&raquo;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

HomepageTile.defaultProps = {
  data: {},
  labels: {},
  location: {},
};

HomepageTile.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    // subtitle: PropTypes.string,
  }),
  labels: PropTypes.shape({
    common: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default HomepageTile;
