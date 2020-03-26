import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import ReactMarkdown from 'react-markdown/with-html';
import { IconContext } from 'react-icons';
import { FaFax, FaMobileAlt, FaPhone } from 'react-icons/fa';
import ContactOffice from './contactOffice';
import { makeid, scrollTo } from '../utils/functions';
import pin from '../../static/img/map-pin.png';

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
      },
      offset: null,
    };
    this.mapRef = React.createRef();
  }

  goToOffice = (lat, lng) => {
    this.mapRef.setCenter({ lat, lng });
    this.mapRef.setZoom(7);
    scrollTo(256);
  };

  hideInfoWindow = () => {
    this.setState({
      infoWindowVisible: false,
    });
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

  updateState = () => {
    if (typeof window !== 'undefined') {
      this.setState({
        offset: new window.google.maps.Size(0, -40),
      });
    }
  };

  render() {
    const { activeOffice, infoWindowVisible, offset, viewport } = this.state;
    const { aboutLabel, handleContactUs, locale, offices, visitorRegion } = this.props;

    return (
      <>
        <div className="almex-locations">
          <a href="#offices">
            <span className="more">{aboutLabel.about.ALMEX_LOCATIONS}</span>
            <span className="more-arrow">&nbsp;&raquo;</span>
          </a>
        </div>
        <div className="map" id="map" style={{ display: 'flex', height: '585px' }}>
          <LoadScript
            googleMapsApiKey="AIzaSyCPjZIbrcLv2B8t92OoiMoPxhnLQ4_kNpY"
            language={locale}
            onLoad={() => this.updateState()}
            // onError={onError}
          >
            <GoogleMap
              id="my-map"
              onLoad={map => {
                this.mapRef = map;
              }}
              mapContainerStyle={{
                flex: 1,
              }}
              options={{
                disableDefaultUI: true,
                scaleControl: true,
                zoomControl: true,
              }}
              {...viewport}
              onZoomChanged={this.updateZoom}
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
                  <div className="infoWindow-content">
                    <div className="infoWindow-name">{activeOffice.name}</div>
                    <div className="infoWindow-details">
                      <ReactMarkdown source={activeOffice.address} />
                      {activeOffice.telephone.length > 0 &&
                        activeOffice.telephone.map(num => (
                          <div key={`tel-${makeid()}`}>
                            <span aria-hidden="true">
                              <IconContext.Provider value={{ className: 'phone' }}>
                                <FaPhone aria-hidden />
                              </IconContext.Provider>
                            </span>{' '}
                            <a href={`tel:${num}`}>{num}</a>
                          </div>
                        ))}
                      {activeOffice.fax.length > 0 &&
                        activeOffice.fax.map(num => (
                          <div key={`fax-${makeid()}`}>
                            <span aria-hidden="true">
                              <IconContext.Provider value={{ className: 'fax' }}>
                                <FaFax aria-hidden />
                              </IconContext.Provider>
                            </span>{' '}
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
                            </span>{' '}
                            <a href={`tel:${num}`}>{num}</a>
                          </div>
                        ))}
                      {activeOffice.tollFree.length > 0 &&
                        activeOffice.tollFree.map(num => (
                          <div key={`free-${makeid()}`}>
                            <span className="contact-person">{aboutLabel.about.TOLLFREE}: </span>
                            {num}
                          </div>
                        ))}
                      {activeOffice.contactPerson && (
                        <div>
                          <span className="contact-person">{aboutLabel.about.CONTACT}: </span>
                          <em>{activeOffice.contactPerson}</em>
                        </div>
                      )}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* <div id="offices" style={{ marginBottom: '120px' }} /> */}
        <div id="offices" />
        <div className="table-data">
          <div className="table-entry">
            <div className="table-pin" />
            <div className="table-details">
              <div className="table-office heading">{aboutLabel.about.HEADING_OFFICE}</div>
              <div className="table-desc heading">{aboutLabel.about.HEADING_DESC}</div>
              <div className="table-countries heading">{aboutLabel.about.HEADING_COUNTRIES}</div>
            </div>
          </div>
          {offices.map(office => (
            <ContactOffice
              goToOffice={this.goToOffice}
              key={makeid()}
              aboutLabel={aboutLabel}
              handleContactUs={handleContactUs}
              office={office}
              visitorRegion={visitorRegion}
            />
          ))}
        </div>
      </>
    );
  }
}

ContactMap.defaultProps = {
  aboutLabel: {},
  handleContactUs: () => {},
  locale: 'EN',
  offices: null,
  visitorRegion: null,
};

ContactMap.propTypes = {
  aboutLabel: PropTypes.shape({
    about: PropTypes.object,
  }),
  handleContactUs: PropTypes.func,
  locale: PropTypes.string,
  offices: PropTypes.arrayOf(
    PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      name: PropTypes.string,
    }),
  ),
  visitorRegion: PropTypes.string,
};

export default ContactMap;
