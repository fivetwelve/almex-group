import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { makeid, renderLink } from '../utils/functions';

const EventsResults = ({ events, labels }) => (
  <>
    {events.map(event => (
      <React.Fragment key={makeid()}>
        <div className="title">{event.title}</div>
        <div className="result">
          <div className="thumbnail">
            {event.thumbnail ? (
              <img src={event.thumbnail.url} alt="" />
            ) : (
              <img src="https://placehold.it/200x200" alt="" />
            )}
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
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        link: props => renderLink(props),
                      }}
                    >
                      {event.location}
                    </ReactMarkdown>
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
                <a href={event.website} target="_blank" rel="noopener noreferrer nofollow noindex">
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

EventsResults.defaultProps = {
  events: [],
  labels: {},
};

EventsResults.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  labels: PropTypes.objectOf(PropTypes.string),
};

export default EventsResults;
