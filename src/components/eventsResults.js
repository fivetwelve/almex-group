import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import { formatDate } from 'react-day-picker/moment';
import { makeid } from '../utils/functions';

const EventsResults = ({ calendarLocale, events, labels, selectedDay }) => {
  const thisDate = formatDate(new Date(selectedDay), 'LL', calendarLocale);

  return (
    <div className="events-results">
      <div className="heading">
        {thisDate} {labels.EVENTS}
      </div>
      {events.map(event => (
        <React.Fragment key={makeid()}>
          <div className="title">{event.title}</div>
          <div className="result">
            <div className="thumbnail">
              <img src="http://placehold.it/200x200" alt="" />
            </div>
            <div className="details">
              <table>
                <tbody>
                  <tr>
                    <td className="label">{labels.DATE}</td>
                    <td className="date">
                      {event.endDate === event.startDate
                        ? event.startDate
                        : `${event.startDate} - ${event.endDate}`}
                    </td>
                  </tr>
                  <tr>
                    <td className="label">{labels.LOCATION}</td>
                    <td className="location">
                      <Markdown source={event.location} />
                    </td>
                  </tr>
                  <tr>
                    <td className="description" colSpan="2">
                      {event.description}
                    </td>
                  </tr>
                </tbody>
              </table>
              {event.website && (
                <div className="website">
                  <a href={event.website} target="_blank" rel="noopener noreferrer">
                    <span className="visit">{labels.WEBSITE}</span>
                    <span className="visit-arrow">&nbsp;&raquo;</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

EventsResults.defaultProps = {
  calendarLocale: 'en',
  events: [],
  labels: {},
  selectedDay: '',
};

EventsResults.propTypes = {
  calendarLocale: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  labels: PropTypes.objectOf(PropTypes.string),
  selectedDay: PropTypes.string,
};

export default EventsResults;
