import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import HomePageTile from '../components/homepageTile';
import '../styles/home.scss';

const HomeTemplate = ({
  data: {
    cms: { homepages, labels },
  },
}) => {
  // const HomeTemplate = data => {
  // console.log(data);
  // const { title, description, subtitle } = data;
  let tileNum = 0;
  const homepage = homepages[0];
  const label = labels[0];
  const imageStyle = {
    backgroundImage: `url(${homepage.eventImage.url})`,
  };

  return (
    <>
      <div className="heading1-container">
        <div className="heading1">
          <Markdown source={homepage.heading[0]} options={{ html: true }} />{' '}
        </div>
      </div>
      <div className="tile-container">
        {homepage.homepageTiles.length > 0 &&
          homepage.homepageTiles.map(tile => {
            tileNum += 1;
            return <HomePageTile data={tile} labels={label} key={`tile-${tileNum}`} />;
          })}
      </div>
      <div className="heading2-container">
        <div className="heading2">
          <Markdown source={homepage.heading[1]} options={{ html: true }} />
        </div>
      </div>
      <div className="event-container">
        <div className="event1">
          <div className="content-container">
            <div className="title">
              <Markdown source={homepage.eventTitle[0]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[0]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
        <div className="event2">
          <div className="content-container">
            <div className="title">
              <Markdown source={homepage.eventTitle[1]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[1]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
        <div className="event3" style={imageStyle}>
          <div className="content-container">
            <div className="title">
              <Markdown source={homepage.eventTitle[2]} options={{ html: true }} />
            </div>
            <div className="description">
              <Markdown source={homepage.eventDescription[2]} options={{ html: true }} />
            </div>
            <button type="button" className="event-more">
              {label.common.MORE}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

HomeTemplate.defaultProps = {
  data: {},
};

HomeTemplate.propTypes = {
  data: PropTypes.shape({
    tagLine: PropTypes.string,
  }),
};

export default HomeTemplate;
