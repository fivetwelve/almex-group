import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import ReactMarkdown from 'react-markdown/with-html';
import { createLink, renderLink } from '../utils/functions';
import '../styles/homepageTile.scss';
import fallbackTile from '../../static/img/fallback_500x235.jpg';

const HomepageTile = ({ data, labels, location }) => {
  const { image, title, description, page } = data;
  const imageStyle = {
    backgroundImage: `url(${(image && image.url) || page.tile.url || fallbackTile})`,
  };

  return (
    <div className="homepage-tile">
      <div className="tile-title">
        <h3>{title}</h3>
      </div>
      <Link to={(page && createLink(location, page.slug)) || createLink(location, '')}>
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
      </Link>
      <div className="description">
        <ReactMarkdown
          source={description}
          escapeHtml={false}
          renderers={{
            link: props => renderLink(props, location),
          }}
        />
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
    description: PropTypes.string,
    image: PropTypes.object,
    page: PropTypes.object,
    title: PropTypes.string,
  }),
  labels: PropTypes.shape({
    common: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default HomepageTile;
