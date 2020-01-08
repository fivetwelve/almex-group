import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import { makeid } from '../utils/functions';

const TrainingEventsResults = ({ events, labels }) => (
  <>
    {events.map(event => (
      <React.Fragment key={makeid()}>
        <div className="title">{event.title}</div>
        <div className="result">
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
  </>
);

TrainingEventsResults.defaultProps = {
  events: [],
  labels: {},
};

TrainingEventsResults.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  labels: PropTypes.objectOf(PropTypes.string),
};

export default TrainingEventsResults;
