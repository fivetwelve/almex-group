import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Markdown from 'react-remarkable';
import '../styles/homepageTile.scss';

const HomepageTile = ({ data, labels }) => {
  const { image, title, description, subtitle } = data;
  const imageStyle = {
    backgroundImage: `url(${image.url})`,
  };

  return (
    <>
      <div className="tile">
        <div className="tile-title">
          <h3>{title}</h3>
        </div>
        <div className="image-container">
          <div className="background" style={imageStyle} />
          <div className="overlay">
            <div className="text-container">
              <span className="overlay-title">{title}</span>
              <div className="overlay-subtitle">
                <span className="indicator">&#9650;</span>
                <span className="subtitle">{subtitle}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="description">
          <Markdown source={description} options={{ html: true }} />
          <span className="more-container">
            <Link to="/northamerica/en/heavyweight-pro">
              <span className="more">{labels.common.MORE}</span>
              <span className="more-arrow">&nbsp;&raquo;</span>
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};

HomepageTile.defaultProps = {
  data: {},
  labels: {},
};

HomepageTile.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    subtitle: PropTypes.string,
  }),
  labels: PropTypes.shape({
    common: PropTypes.object,
  }),
};

export default HomepageTile;
