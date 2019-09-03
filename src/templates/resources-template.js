import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import CategorySelector from '../components/categorySelector';
import { RESOURCE_TYPES } from '../constants';
import '../styles/resources.scss';
import { makeid } from '../utils/functions';

const allowHTML = { html: true };

class ResourcesTemplate extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { categories } = props.data.cms.page.resources;
    const { resourcesLabel } = props.data.cms;
    const allResources = [];
    const resourcesTypes = [
      RESOURCE_TYPES.BROCHURE,
      RESOURCE_TYPES.CATALOG,
      RESOURCE_TYPES.OPERATING_MANUAL,
      RESOURCE_TYPES.PRESS_RELEASE,
      RESOURCE_TYPES.PRODUCT_SHEET,
      RESOURCE_TYPES.PROMO_VIDEO,
      RESOURCE_TYPES.SAFETY_ALERT_CERTIFICATION,
      RESOURCE_TYPES.SAFETY_DATA_SHEET,
      RESOURCE_TYPES.TEST_RESULT,
      RESOURCE_TYPES.TRAINING_MANUAL,
      RESOURCE_TYPES.TRAINING_VIDEO,
    ];
    categories.forEach(category => {
      const resources = [];
      const sortedResources = [];
      const unClassified = [];
      let thisTitle = '';
      let documentNum = 0;
      // collect all documents for this category
      if (category.page.pageType === 'LANDING') {
        thisTitle = category.page.landingSource.title;
        category.page.landingSource.landingSections.forEach(section => {
          section.pages.forEach(page => {
            page.productSource.pdfDownloads.forEach(pdf => {
              documentNum += 1;
              resources.push(pdf);
            });
          });
        });
      }
      // sort documents
      resourcesTypes.forEach(resourceType => {
        const thisType = [];
        resources.forEach(resource => {
          if (resource.resourceType === resourceType) {
            thisType.push(resource);
          } else if (!resource.resourceType && !unClassified.includes(resource)) {
            // resourceType not been set and not already added to unClassified array
            unClassified.push(resource);
          }
        });
        if (thisType.length > 0) {
          // we don't want groups with 0 resources
          sortedResources.push({
            title: resourcesLabel.resources[resourceType],
            documents: thisType,
          });
        }
      });
      allResources.push({
        title: thisTitle,
        resources: sortedResources,
        unClassified,
      });
      console.log(`${thisTitle}: ${documentNum}`);
    });
    console.log(allResources);
    this.state = {
      allResources,
      selectedCategory: null,
    };
  }

  /* using Hooks instead of component state */
  // const [selectedCategory, setCategory] = useState({});

  // console.log('documents:');
  // console.log(documents);
  // console.log('allResources:');
  // console.log(this.state.allResources);

  // setCategory = continent => {
  //   const { allEvents, selectedDay } = this.state;
  //   const events = allEvents.filter(event => {
  //     if (!selectedDay) {
  //       return null;
  //     }
  //     if (selectedDay && continent === CONTINENTS.GLOBAL) {
  //       return DateUtils.isDayInRange(selectedDay, {
  //         from: new Date(event.startDate),
  //         to: new Date(event.endDate),
  //       })
  //         ? event
  //         : null;
  //     }
  //     return event.continent === continent &&
  //       DateUtils.isDayInRange(selectedDay, {
  //         from: new Date(event.startDate),
  //         to: new Date(event.endDate),
  //       })
  //       ? event
  //       : null;
  //   });
  //   this.setState({
  //     continent,
  //     events,
  //   });
  // };
  // setCategory = category => {};

  handleSetCategory = categoryName => {
    const { allResources } = this.state;
    const category = allResources.find(resource => resource.title === categoryName);
    this.setState({
      selectedCategory: category,
    });
  };

  render() {
    const {
      data: {
        cms: {
          brandNavigation,
          headerFooter,
          label,
          navigation,
          page: {
            resources: { bannerImage, categories, description, title },
          },
          resourcesLabel,
        },
      },
      pageContext: { locale, region },
    } = this.props;
    const { selectedCategory } = this.state;

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="resources"
        headerFooter={headerFooter}
        label={label}
        navigation={navigation}
        region={region}
        title=""
      >
        {/* <Location>
        {({ location }) => ( */}
        <>
          <div className="resources-container">
            {bannerImage && (
              <div className="banner-wrapper">
                <div className="banner-image">
                  <GraphImg image={bannerImage} maxWidth={1280} />
                </div>
              </div>
            )}
            <div className="main-container">
              <div className="main-content">
                <h1 className="title">{title}</h1>
                <div className="content">
                  <Markdown source={description} options={allowHTML} />
                </div>
              </div>
            </div>
            <div>Category: {selectedCategory && selectedCategory.title}</div>
            {/* {console.log(
            allResources.find(element => {
              if (element.title === selectedCategory) {
                return element;
              }
              return null;
            }),
          )} */}
            <CategorySelector
              category={selectedCategory ? selectedCategory.title : ''}
              categories={categories}
              setCategory={categoryName => this.handleSetCategory(categoryName)}
              label={resourcesLabel.resources}
            />
            {/* <div className="resource-container"></div> */}
            {console.log(selectedCategory)}
            {selectedCategory &&
              selectedCategory.resources.map(type => (
                <div key={type.title}>
                  {type.title}
                  {type.documents.map(document => (
                    <div key={makeid()}>
                      <a href={document.url}>{document.documentTitle || document.fileName}</a>
                    </div>
                  ))}
                  {/* {type.documents.map(
                    document =>
                      // <div key={makeid()}>
                      // <a href={document.url}>{document.title}</a>
                      document.title,
                    // </div>
                  )} */}
                </div>
              ))}
          </div>
        </>
        {/* )}
      </Location> */}
      </Layout>
    );
  }
}

ResourcesTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

ResourcesTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.object,
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      resourcesLabel: label(where: { availableIn: $region }) {
        resources(locale: $locale)
      }
      page(where: { id: $id }) {
        resources: resourcesSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          title(locale: $locale)
          categories {
            isProductCategory
            page {
              pageType
              landingSource {
                title(locale: $locale)
                landingSections {
                  pages {
                    productSource {
                      pdfDownloads(locale: EN) {
                        url
                        fileName
                        resourceType
                        documentTitle(locale: EN)
                      }
                    }
                  }
                }
                orphans: pages {
                  productSource {
                    pdfDownloads(locale: EN) {
                      url
                      fileName
                      resourceType
                      documentTitle(locale: EN)
                    }
                  }
                }
              }
              # aboutSource
              # careersSource
              # contactSource
              # downloadsSource
              # eventsSource
              # historySource
              # instituteSource
              # newsSource
              # servicesSource
              # simpleContentSource
              # usedEquipmentSource
            }
            documents {
              url
              fileName
              resourceType
              documentTitle(locale: EN)
            }
          }
        }
      }
    }
  }
`;

export default ResourcesTemplate;
