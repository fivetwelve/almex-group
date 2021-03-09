import React from 'react';
import PropTypes from 'prop-types';
import Timeline from './timeline';
import TimelineModal from './timelineModal';

class TimelineManager extends React.Component {
  constructor(props) {
    super(props);
    this.shroud = React.createRef();
    this.state = {
      selectedEvent: null,
      showModal: false,
    };
  }

  handleSelectEvent = event => {
    this.setState({
      selectedEvent: event,
      showModal: true,
    });
    this.shroud.current.classList.add('in-view');
  };

  handleHideModal = () => {
    this.setState({
      showModal: false,
    });
    this.shroud.current.classList.remove('in-view');
  };

  render() {
    const { events, label } = this.props;
    const { selectedEvent, showModal } = this.state;
    return (
      <>
        <Timeline events={events} selectEvent={this.handleSelectEvent} />
        <div className="timeline-shroud" ref={this.shroud} />
        <TimelineModal
          event={selectedEvent}
          hideThisModal={this.handleHideModal}
          label={label}
          showModal={showModal}
        />
      </>
    );
  }
}

TimelineManager.defaultProps = {
  events: [],
  label: {},
};

TimelineManager.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.shape({
    common: PropTypes.instanceOf(Object),
  }),
};

export default TimelineManager;
