import React from 'react';
import PropTypes from 'prop-types';
import LinkWithPrevious from './linkWithPrevious';
import { createLink } from '../utils/functions';
import '../styles/landingTile.scss';

const LandingTile = ({ data, location, themeColour }) => {
  const { slug, subtitle, tileImage, title } = data;
  const imageStyle = {
    backgroundImage: `url(${tileImage.url})`,
  };

  return (
    <div className="landing-tile">
      <div className="tile-title">
        <h3>{title}</h3>
      </div>
      <LinkWithPrevious to={createLink(location, slug)}>
        <div className="image-container">
          <div className="background" style={imageStyle} />
          <div className={`overlay ${themeColour}`}>
            <div className="text-container">
              <span className="overlay-title">{title}</span>
              {subtitle && (
                <div className="overlay-subtitle">
                  <span className="indicator">&#9650;</span>
                  <span className="subtitle">{subtitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </LinkWithPrevious>
    </div>
  );
};

LandingTile.defaultProps = {
  data: {},
  location: {},
  themeColour: '',
};

LandingTile.propTypes = {
  data: PropTypes.shape({
    slug: PropTypes.string,
    subtitle: PropTypes.string,
    tileImage: PropTypes.object,
    title: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathName: PropTypes.string,
  }),
  themeColour: PropTypes.string,
};

export default LandingTile;
