import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import Markdown from 'react-remarkable';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import ContactOffice from './contactOffice';
import { makeid, scrollTo } from '../utils/functions';
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
    scrollTo(120);
  };

  updateViewport = viewportUpdate => {
    // const {width, height, latitude, longitude, zoom} = viewportUpdate;
    this.setState({ viewport: viewportUpdate });
  };

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
    const { label, locale, offices } = this.props;

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
                          <div key={`tel-${makeid()}`}>
                            <span aria-hidden="true">
                              <IconContext.Provider value={{ className: 'phone' }}>
                                <FaPhone aria-hidden />
                              </IconContext.Provider>
                            </span>
                            {num}
                          </div>
                        ))}
                      {activeOffice.fax.length > 0 &&
                        activeOffice.fax.map(num => (
                          <div key={`fax-${makeid()}`}>
                            <span aria-hidden="true">
                              <IconContext.Provider value={{ className: 'fax' }}>
                                <FaFax aria-hidden />
                              </IconContext.Provider>
                            </span>
                            {num}
                          </div>
                        ))}
                      {activeOffice.mobile.length > 0 &&
                        activeOffice.mobile.map(num => (
                          <div key={`mob-${makeid()}`}>
                            <span aria-hidden="true">
                              <IconContext.Provider value={{ className: 'mobile' }}>
                                <FaMobileAlt aria-hidden />
                              </IconContext.Provider>
                            </span>
                            {num}
                          </div>
                        ))}
                      {activeOffice.tollFree.length > 0 &&
                        activeOffice.tollFree.map(num => (
                          <div key={`free-${makeid()}`}>
                            <span className="contact-person">{label.about.TOLLFREE}: </span>
                            {num}
                          </div>
                        ))}
                      {activeOffice.contactPerson && (
                        <div>
                          <span className="contact-person">{label.about.CONTACT}: </span>
                          {activeOffice.contactPerson}
                        </div>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
        <div id="offices" style={{ marginBottom: '120px' }} />
        <div className="table-data">
          <div className="table-entry">
            <div className="table-pin" />
            <div className="table-details">
              <div className="table-office">{label.about.HEADING_OFFICE}</div>
              <div className="table-desc">{label.about.HEADING_DESC}</div>
              <div className="table-countries">{label.about.HEADING_COUNTRIES}</div>
            </div>
          </div>
          {offices.map(office => (
            <ContactOffice
              goToOffice={this.goToOffice}
              key={makeid()}
              label={label}
              office={office}
            />
          ))}
        </div>
      </>
    );
  }
}

ContactMap.defaultProps = {
  label: {},
  locale: 'EN',
  offices: null,
};

ContactMap.propTypes = {
  label: PropTypes.shape({
    about: PropTypes.object,
  }),
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
