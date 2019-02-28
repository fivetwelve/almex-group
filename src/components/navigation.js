import React from 'react';
import PropTypes from 'prop-types';
import { graphql, StaticQuery } from 'gatsby';
import NavigationDropdown from './navigationDropdown';
// import Dump from '../utils/dump';

const Navigation = props => {
  const {
    activeLanguage,
    data: {
      cms: { navigations },
    },
    location,
    region,
  } = props;
  // console.log(`navigations: ${navigations}`);
  const navigation = navigations.filter(nav => nav.availableIn === region)[0];
  return (
    <>
      {/* <Dump src={navigations} /> */}
      <nav className="navigation">
        <div className="sections">
          {navigation.navigationSections.length > 0 &&
            navigation.navigationSections.map(section => (
              <NavigationDropdown
                activeLanguage={activeLanguage}
                closeOtherMenus={type => this.closeOtherMenus(type)}
                key={section.type}
                location={location}
                section={section}
                // ref={this.PRODUCTS}
              />
            ))}
        </div>
      </nav>
    </>
  );
};
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
                article {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                industry {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                landing {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                product {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                promo {
                  titleEN: title(locale: EN)
                  titleES: title(locale: ES)
                }
                service {
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
