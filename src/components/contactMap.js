import React from 'react';
import PropTypes from 'prop-types';
import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import ContactPin from './contactPin';

class ContactMap extends React.Component {
  constructor(props) {
    super(props);
    // Using Lisbon, Portugal for initial coordinates because it nicely centers the map.
    this.state = {
      viewport: {
        latitude: 33.589886,
        longitude: -7.603869,
        zoom: 1.3,
        height: 600,
        width: '100%',
      },
      popupInfo: null,
    };
  }

  goToOffice = (latitude, longitude) => {
    // 33.704291, -84.1868887
    // 43.2189745, -79.6797994;
    const { viewport } = this.state;
    const viewportUpdate = { ...viewport, latitude, longitude, zoom: 8 };
    this.setState({ viewport: viewportUpdate });
  };

  updateViewport = viewportUpdate => {
    // const {width, height, latitude, longitude, zoom} = viewportUpdate;
    this.setState({ viewport: viewportUpdate });
  };

  renderButton = (office, index) => (
    <button
      key={`link-${index}`}
      onClick={() => this.goToOffice(office.latitude, office.longitude)}
      type="button"
      style={{ width: '200px' }}
    >
      {office.name}
    </button>
  );

  renderMarker = (office, index) => (
    <Marker key={`marker-${index}`} longitude={office.longitude} latitude={office.latitude}>
      <ContactPin size={20} onClick={() => this.setState({ popupInfo: office })} />
    </Marker>
  );

  renderPopup = () => {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="bottom"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
          offsetLeft={0}
          offsetTop={-20}
        >
          <div>{popupInfo.name}</div>
        </Popup>
      )
    );
  };

  render() {
    const { viewport } = this.state;

    const { offices } = this.props;

    return (
      <>
        {offices && (
          <div className="map" id="map">
            <ReactMapGL
              id="appMap"
              mapboxApiAccessToken="pk.eyJ1IjoiYWxtZXgiLCJhIjoiY2p3MzNjZjU1MGN6bjRhbzMyaGZmOWd0aiJ9.NpeQ-ufdfR_bxOdn_H5sCg"
              width="100%"
              mapStyle="mapbox://styles/mapbox/streets-v9"
              // mapStyle="mapbox://mapbox.mapbox-streets-v6"
              // onViewportChange={this._onViewportChange}
              // mapStyle="mapbox://styles/mapbox/dark-v9"
              {...viewport}
              onViewportChange={viewportUpdate => this.setState({ viewport: viewportUpdate })}
            >
              {/* <Marker latitude={37.7577} longitude={-122.4376} offsetLeft={20} offsetTop={10}>
                      <div>You are here</div>
                    </Marker> */}
              {/* <Marker
                latitude={43.2189745}
                longitude={-79.6797994}
                offsetLeft={40}
                offsetTop={10}
              /> */}
              {offices.map(this.renderMarker)}
              {this.renderPopup()}

              <div style={{ position: 'absolute', left: 0 }}>
                <NavigationControl
                  onViewportChange={viewportUpdate => this.updateViewport(viewportUpdate)}
                  showCompass={false}
                />
              </div>
              {/* <Popup
                latitude={43.2189745}
                longitude={-79.6797994}
                closeButton
                closeOnClick
                anchor="bottom"
              >
                <div>Shaw Almex Fusion Canada Ltd.</div>
              </Popup>
              <Popup
                latitude={-26.1921843}
                longitude={27.9180396}
                closeButton
                closeOnClick={false}
                anchor="bottom"
              >
                <div style={{ marginTop: '20px' }}>Shaw Almex Africa Pty. Ltd.</div>
              </Popup> */}
            </ReactMapGL>
          </div>
        )}
        {offices.map(this.renderButton)}
        {/* <button
          onClick={() => this.goToOffice(43.2189745, -79.6797994)}
          type="button"
          style={{ width: '120px' }}
        >
          Stoney Creek
        </button>
        <button
          onClick={() => this.goToOffice(-26.1921843, 27.9180396)}
          type="button"
          style={{ width: '120px' }}
        >
          South Africa
        </button> */}
      </>
    );
  }
}

ContactMap.defaultProps = {
  offices: null,
};

ContactMap.propTypes = {
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export default ContactMap;
