import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import GraphImg from 'graphcms-image';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import { makeid, renderLink } from '../utils/functions';

const TimelineModal = props => {
  const handleHideModal = evt => {
    const { hideThisModal } = props;
    evt.preventDefault();
    hideThisModal();
    if (typeof document !== 'undefined') {
      document.querySelector('html').classList.toggle('hide-overflow');
    }
  };

  const { event, label, showModal } = props;

  return (
    <div className={`timeline-modal ${showModal ? 'in-view' : ''}`}>
      <div className="modal-container">
        <div className="top">
          <div className="close-container">
            <IconContext.Provider value={{ className: 'close-icon' }}>
              <button type="button" className="close-menu" onClick={evt => handleHideModal(evt)}>
                <FaTimes aria-hidden />
                <span className="sr-only">{label.common.CLOSE}</span>
              </button>
            </IconContext.Provider>
          </div>
        </div>
        <div className="content-container">
          <div className="content">
            {event && (
              <>
                <h3>{event.eventTitle}</h3>
                <p className="date">{event.displayDate}</p>
                {event.description.map((desc, idx) => (
                  <React.Fragment key={makeid()}>
                    <div className="description">
                      <ReactMarkdown
                        options={{ html: true }}
                        components={{
                          link: theseProps => renderLink(theseProps),
                        }}
                      >
                        {desc}
                      </ReactMarkdown>
                    </div>
                    {event.images[idx] ? (
                      <figure>
                        <GraphImg
                          // fit="scale"
                          image={event.images[0]}
                          // transform={['resize=height:100']}
                          transform={['fit=scale']}
                          withWebp
                        />
                        {event.captions[idx] && <figcaption>{event.captions[idx]}</figcaption>}
                      </figure>
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

TimelineModal.defaultProps = {
  hideThisModal: () => {},
  event: {},
  label: {},
  showModal: false,
};

TimelineModal.propTypes = {
  hideThisModal: PropTypes.func,
  event: PropTypes.shape({
    displayDate: PropTypes.string,
    eventTitle: PropTypes.string,
    captions: PropTypes.instanceOf(Array),
    description: PropTypes.instanceOf(Array),
    images: PropTypes.instanceOf(Array),
  }),
  label: PropTypes.shape({
    common: PropTypes.instanceOf(Object),
  }),
  showModal: PropTypes.bool,
};

export default TimelineModal;
