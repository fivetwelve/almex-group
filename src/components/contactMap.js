import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import Markdown from 'react-remarkable';
import { makeid } from '../utils/functions';
// import {Size} from '@react-google-maps/api/src/components/
// import ContactPin from './contactPin';
import pin from '../../static/img/map-pin.svg';

class ContactMap extends React.Component {
  constructor(props) {
    super(props);
    // Using Lisbon, Portugal for initial coordinates because it centers the map nicely.
    this.state = {
      activeOffice: null,
      infoWindowVisible: false,
      viewport: {
        center: {
          lat: 33.589886,
          lng: -7.603869,
        },
        zoom: 2.2,
        // height: 600,
        // width: '100%',
      },
      offset: null,
      // offset: new window.google.maps.Size(0, 20),
      // popupInfo: null,
    };
  }

  goToOffice = (lat, lng) => {
    const { viewport } = this.state;
    const viewportUpdate = { ...viewport, center: { lat, lng }, zoom: 7 };
    this.setState({ viewport: viewportUpdate });
  };

  updateViewport = viewportUpdate => {
    // const {width, height, latitude, longitude, zoom} = viewportUpdate;
    this.setState({ viewport: viewportUpdate });
  };

  renderButton = (office, index) => (
    <div>
      <button
        key={`link-${index}`}
        onClick={() => this.goToOffice(office.latitude, office.longitude)}
        type="button"
        style={{ width: '200px' }}
      >
        {office.name}
      </button>
    </div>
  );

  renderMarker = (office, index) => (
    <Marker
      key={`marker-${index}`}
      // onLoad={marker => {
      //   console.log('marker: ', marker);
      // }}
      position={{ lat: office.latitude, lng: office.longitude }}
      title={office.name}
      onClick={() => this.showInfoWindow(office)}
      icon={pin}
    />
  );

  showInfoWindow = office => {
    this.setState({
      activeOffice: office,
      infoWindowVisible: true,
    });
  };

  hideInfoWindow = () => {
    this.setState({
      infoWindowVisible: false,
    });
  };

  updateState = () => {
    if (typeof window !== 'undefined') {
      this.setState({
        offset: new window.google.maps.Size(0, -40),
      });
    }
  };

  render() {
    const { activeOffice, infoWindowVisible, offset, viewport } = this.state;
    const { locale, offices } = this.props;

    return (
      <>
        <div className="map" id="map" style={{ display: 'flex', height: '585px' }}>
          <LoadScript
            googleMapsApiKey="AIzaSyCPjZIbrcLv2B8t92OoiMoPxhnLQ4_kNpY"
            language={locale}
            // region={'EN'}
            // version={'weekly'}
            // onLoad={onLoad}
            onLoad={() => this.updateState()}
            // onError={onError}
            // loadingElement={Loading}
            // libraries={googleMapsLibraries}
            // preventGoogleFontsLoading
          >
            <GoogleMap
              id="my-map"
              mapContainerStyle={{
                flex: 1,
              }}
              options={{
                disableDefaultUI: true,
                scaleControl: true,
                zoomControl: true,
              }}
              {...viewport}
            >
              {offices.map(this.renderMarker)}
              {infoWindowVisible && (
                <InfoWindow
                  onCloseClick={() => this.hideInfoWindow()}
                  // onLoad={infoWindow => {
                  //   console.log('infoWindow: ', infoWindow);
                  // }}
                  position={{ lat: activeOffice.latitude, lng: activeOffice.longitude }}
                  options={{ pixelOffset: offset }}
                >
                  <div
                    style={{
                      background: `white`,
                      padding: 15,
                    }}
                  >
                    <div className="infoWindow-name">{activeOffice.name}</div>
                    <div className="infoWindow-details">
                      <Markdown source={activeOffice.address} />
                      {activeOffice.telephone.length > 0 &&
                        activeOffice.telephone.map(num => (
                          <div key={`tel-${makeid()}`}>tel: {num}</div>
                        ))}
                      {activeOffice.tollFree.length > 0 &&
                        activeOffice.tollFree.map(num => (
                          <div key={`free-${makeid()}`}>toll-free: {num}</div>
                        ))}
                      {activeOffice.fax.length > 0 &&
                        activeOffice.fax.map(num => <div key={`fax-${makeid()}`}>fax: {num}</div>)}
                      {activeOffice.mobile.length > 0 &&
                        activeOffice.mobile.map(num => (
                          <div key={`mob-${makeid()}`}>mobile: {num}</div>
                        ))}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
        <div>Temporary navigation to locations:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>{offices.map(this.renderButton)}</div>
      </>
    );
  }
}

ContactMap.defaultProps = {
  locale: 'EN',
  offices: null,
};

ContactMap.propTypes = {
  locale: PropTypes.string,
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
};

export default ContactMap;
