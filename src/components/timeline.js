import React from 'react';
import PropTypes from 'prop-types';
import { Waypoint } from 'react-waypoint';
import { window } from 'browser-monads';
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
  };

  render() {
    const { events } = this.props;
    return (
      <div className="timeline">
        <ul>
          {events.map((event, idx) => (
            <Waypoint
              scrollableAncestor={window}
              onEnter={props => this.handleEnterWaypoint(props, idx)}
              key={makeid()}
            >
              {/* <li key={makeid()} id=""><a href="#event">{event.eventTitle}</a></li> */}
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
                    {event.displayDate}
                    <br />
                    {event.eventTitle}
                  </button>
                ) : (
                  <div className="content">
                    {event.displayDate}
                    <br />
                    {event.eventTitle}
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
