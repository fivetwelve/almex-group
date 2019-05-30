import React from 'react';
// import PropTypes from 'prop-types';
// import ReactMapGL, { Marker, NavigationControl, Popup } from 'react-map-gl';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
// import MapboxMap from 'react-mapbox-wrapper';
// import ContactPin from './contactPin';

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
      // popupInfo: null,
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

  // renderMarker = (office, index) => (
  //   <Marker key={`marker-${index}`} longitude={office.longitude} latitude={office.latitude}>
  //     <ContactPin size={20} onClick={() => this.setState({ popupInfo: office })} />
  //   </Marker>
  // );

  // renderPopup = () => {
  //   const { popupInfo } = this.state;

  //   return (
  //     popupInfo && (
  //       <Popup
  //         tipSize={5}
  //         anchor="bottom"
  //         longitude={popupInfo.longitude}
  //         latitude={popupInfo.latitude}
  //         closeOnClick={false}
  //         onClose={() => this.setState({ popupInfo: null })}
  //         offsetLeft={0}
  //         offsetTop={-20}
  //       >
  //         <div>{popupInfo.name}</div>
  //       </Popup>
  //     )
  //   );
  // };

  render() {
    // const { viewport } = this.state;

    // const { offices } = this.props;

    return (
      <>
        <div className="map" id="map" style={{ display: 'flex', height: 'calc(100vh - 50px)' }}>
          {/* <LoadScript
              id="script-loader"
              googleMapsApiKey="AIzaSyCPjZIbrcLv2B8t92OoiMoPxhnLQ4_kNpY"
            > */}

          <LoadScript
            googleMapsApiKey="AIzaSyCPjZIbrcLv2B8t92OoiMoPxhnLQ4_kNpY"
            // language={language}
            // region={'EN'}
            // version={'weekly'}
            // onLoad={onLoad}
            // onError={onError}
            // loadingElement={Loading}
            // libraries={googleMapsLibraries}
            // preventGoogleFontsLoading
          >
            <GoogleMap
              id="my-map"
              zoom={13}
              mapContainerStyle={{
                flex: 1,
              }}
              center={{
                lat: 43.855472,
                lng: 18.410574,
              }}
            />
          </LoadScript>
          {/* <div style={{ height: 400, width: 400 }}>
            <MapboxMap
              accessToken="pk.eyJ1IjoiYWxtZXgiLCJhIjoiY2p3MzNjZjU1MGN6bjRhbzMyaGZmOWd0aiJ9.NpeQ-ufdfR_bxOdn_H5sCg"
              coordinates={{ lat: 48.872198, lng: 2.3366308 }}
            />
          </div> */}
        </div>
        {/* {offices.map(this.renderButton)} */}
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
  // offices: null,
};

ContactMap.propTypes = {
  // offices: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     latitude: PropTypes.number,
  //     longitude: PropTypes.number,
  //     name: PropTypes.string,
  //   }),
  // ),
};

export default ContactMap;
