import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-remarkable';
import GraphImg from 'graphcms-image';
// import { document } from 'browser-monads';
import { IconContext } from 'react-icons';
import { FaTimes } from 'react-icons/fa';
import { makeid } from '../utils/functions';

const TimelineModal = props => {
  const handleHideModal = evt => {
    const { hideThisModal } = props;
    evt.preventDefault();
    hideThisModal();
    // document.querySelector('html').classList.toggle('hide-overflow');
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
                {event.description.map((desc, idx) => (
                  <React.Fragment key={makeid()}>
                    <Markdown source={desc} options={{ html: true }} />
                    {event.images[idx] ? (
                      <GraphImg
                        // fit="scale"
                        image={event.images[0]}
                        // transform={['resize=height:100']}
                        transform={['fit=scale']}
                        withWebp
                      />
                    ) : (
                      ''
                    )}
                  </React.Fragment>
                ))}
              </>

              // <>
              //   <h3>{event.eventTitle}</h3>
              //   <p>
              //     Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut
              //     fermentum massa justo sit amet risus. Donec sed odio dui. Cras mattis consectetur
              //     purus sit amet fermentum. Nulla vitae elit libero, a pharetra augue. Maecenas
              //     faucibus mollis interdum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus
              //     dolor auctor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
              //   </p>
              //   <p>
              //     Etiam porta sem malesuada magna mollis euismod. Nullam quis risus eget urna mollis
              //     ornare vel eu leo. Nulla vitae elit libero, a pharetra augue. Donec sed odio dui.
              //     Etiam porta sem malesuada magna mollis euismod.
              //   </p>
              //   <p>
              //     Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut
              //     fermentum massa justo sit amet risus. Sed posuere consectetur est at lobortis.
              //     Maecenas sed diam eget risus varius blandit sit amet non magna. Curabitur blandit
              //     tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris
              //     condimentum nibh, ut fermentum massa justo sit amet risus. Curabitur blandit
              //     tempus porttitor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula,
              //     eget lacinia odio sem nec elit.
              //   </p>
              //   <p>
              //     Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio
              //     sem nec elit. Nulla vitae elit libero, a pharetra augue. Nulla vitae elit libero,
              //     a pharetra augue. Cum sociis natoque penatibus et magnis dis parturient montes,
              //     nascetur ridiculus mus.
              //   </p>
              // </>
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
    eventTitle: PropTypes.string,
    description: PropTypes.array,
  }),
  label: PropTypes.shape({
    common: PropTypes.object,
  }),
  showModal: PropTypes.bool,
};

export default TimelineModal;
