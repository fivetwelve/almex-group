import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import NavigationDropdown from './navigationDropdown';

/* n.b. Parent <nav> element is in NavWrapper so we may use forwardRef in Header component. */
const Navigation = props => {
  /* using Hooks instead of component state */
  const {
    activeLanguage,
    data: { cms },
    label,
    location,
    region,
  } = props;
  const [openSection, handleMenuItem] = useState('');
  const navigation = cms.navigations.filter(nav => nav.availableIn === region)[0];

  return (
    <>
      <div className="mobile-options">test</div>
      <div className="sections">
        {navigation.navigationSections.length > 0 &&
          navigation.navigationSections.map(section => {
            const isOpen = section.type === openSection;
            return (
              <NavigationDropdown
                activeLanguage={activeLanguage}
                handleMenuItem={type => handleMenuItem(type)}
                key={section.type}
                location={location}
                section={section}
                isOpen={isOpen}
                label={label.common}
              />
            );
          })}
      </div>
    </>
  );
};

Navigation.defaultProps = {
  activeLanguage: '',
  data: {},
  label: {},
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
  label: PropTypes.shape({
    header: PropTypes.object,
    footer: PropTypes.object,
    common: PropTypes.object,
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
                events: eventsSource {
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
