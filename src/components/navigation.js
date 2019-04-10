import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import NavigationDropdown from './navigationDropdown';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    /* TODO handling logic for current section vs open/close state;
       may not be intuitive if a section is highlighted and user opens a menu
       item then 2 sections become highlighted; a different highlight colour
       would be required */
    /*
      activeSection indicates whether menu item should be highlighted;
      openSection indicates whether actual menu item should be open
    */
    this.state = {
      activeSection: '',
      openSection: '',
    };
  }

  handleMenuItem = type => {
    this.setState({
      openSection: type,
    });
  };

  render() {
    const { activeSection, openSection } = this.state;
    const {
      activeLanguage,
      data: {
        cms: { navigations },
      },
      location,
      region,
    } = this.props;
    const navigation = navigations.filter(nav => nav.availableIn === region)[0];
    return (
      <>
        <nav className="navigation">
          <div className="sections">
            {navigation.navigationSections.length > 0 &&
              navigation.navigationSections.map(section => {
                const isOpen = section.type === openSection;
                return (
                  <NavigationDropdown
                    activeLanguage={activeLanguage}
                    activeSection={activeSection}
                    handleMenuItem={this.handleMenuItem}
                    key={section.type}
                    location={location}
                    section={section}
                    isOpen={isOpen}
                    // ref={`menu${index}`}
                    // ref={this.PRODUCTS}
                  />
                );
              })}
          </div>
        </nav>
      </>
    );
  }
}

Navigation.defaultProps = {
  activeLanguage: '',
  data: {},
  location: {},
  region: '',
};

Navigation.propTypes = {
  activeLanguage: PropTypes.string,
  data: PropTypes.shape({
    cms: PropTypes.shape({
      navigations: PropTypes.array,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  region: PropTypes.string,
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
        cms {
          # navigations(where: { availableIn: NORTH_AMERICA }) {
          navigations {
            availableIn
            navigationSections {
              titleEN: title(locale: EN)
              titleES: title(locale: ES)
              type
              pages {
                id
                pageType
                slugEN: slug(locale: EN)
                slugES: slug(locale: ES)
                about: aboutSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                article: articleSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                industry: industrySource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                landing: landingSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                product: productSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                promo: promoSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                service: serviceSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                usedEquipment: usedEquipmentSource {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
              }
            }
          }
        }
      }
    `}
    render={data => <Navigation data={data} {...props} />}
  />
);
