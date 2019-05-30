import React from 'react';
import PropTypes from 'prop-types';
import { Waypoint } from 'react-waypoint';
import GraphImg from 'graphcms-image';
// import { document, window } from 'browser-monads';
import { makeid } from '../utils/functions';

class Timeline extends React.Component {
  constructor(props) {
    super(props);
    const { events } = this.props;

    events.forEach((event, idx) => {
      this[`eventBlock${idx}`] = React.createRef();
    });

    this.state = {
      start: new Date(),
      threshold: 150,
    };
  }

  shouldComponentUpdate() {
    // This prevents Waypoints from re-rendering when TimelineManager's showModal state changes
    return false;
  }

  handleEnterWaypoint = (props, idx) => {
    const { start, threshold } = this.state;
    const now = new Date();
    if (!this[`eventBlock${idx}`].current.classList.contains('in-view')) {
      const delayNum = idx * 100;
      let delay = `${delayNum}ms`;
      const num = now - start;

      if (num > threshold) {
        delay = '0ms';
      }
      this[`eventBlock${idx}`].current.style.transitionDelay = delay;
      this[`eventBlock${idx}`].current.classList.toggle('in-view');
    }
  };

  handleSelectEvent = (evt, idx) => {
    evt.preventDefault();
    const { events, selectEvent } = this.props;
    selectEvent(events[idx]);
    // document.querySelector('html').classList.toggle('hide-overflow');
  };

  render() {
    const { events } = this.props;
    return (
      <div className="timeline">
        <ul>
          {events.map((event, idx) => (
            <Waypoint
              // scrollableAncestor={window}
              onEnter={props => this.handleEnterWaypoint(props, idx)}
              key={makeid()}
            >
              <li
                className={`event-item ${event.almexEvent ? 'almex' : ''}`}
                title={event.eventTitle}
                ref={this[`eventBlock${idx}`]}
              >
                {event.almexEvent ? (
                  <button
                    className="content"
                    onClick={evt => this.handleSelectEvent(evt, idx)}
                    type="button"
                  >
                    <div className="details">
                      {event.displayDate}
                      <br />
                      {event.eventTitle}
                    </div>
                    {event.images.length > 0 && (
                      <div className="thumbnail">
                        <GraphImg
                          fit="scale"
                          image={event.images[0]}
                          transform={['resize=height:100']}
                          withWebp
                        />
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="content">
                    <div className="details">
                      {event.displayDate}
                      <br />
                      {event.eventTitle}
                    </div>
                  </div>
                )}
              </li>
            </Waypoint>
          ))}
        </ul>
      </div>
    );
  }
}

Timeline.defaultProps = {
  events: [],
  label: {},
  selectEvent: () => {},
};

Timeline.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.shape({
    common: PropTypes.object,
  }),
  selectEvent: PropTypes.func,
};

export default Timeline;
