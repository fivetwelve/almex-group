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

const checkFor = (array, property, value) => {
  const size = array.filter(element => element[property] === value).length;
  return size > 0;
};

class ResourcesTemplate extends Component {
  constructor(props) {
    super(props);
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
      const filteredResources = [];
      const unClassified = [];
      let thisTitle = '';
      // collect all documents for this category
      if (category.page.pageType === 'LANDING') {
        thisTitle = category.page.landingSource.title;
        category.page.landingSource.landingSections.forEach(section => {
          section.pages.forEach(page => {
            page.productSource.pdfDownloads.forEach(pdf => {
              resources.push(pdf);
            });
          });
        });
      }
      // filter documents
      resourcesTypes.forEach(resourceType => {
        const thisType = [];
        resources.forEach(resource => {
          if (resource.resourceType === resourceType && !checkFor(thisType, 'url', resource.url)) {
            thisType.push(resource);
          } else if (!resource.resourceType && !checkFor(unClassified, 'url', resource.url)) {
            // resourceType not been set and not already added to unClassified array
            unClassified.push(resource);
          }
        });

        if (thisType.length > 0) {
          // we don't want groups with 0 resources
          filteredResources.push({
            title: resourcesLabel.resources[resourceType],
            documents: thisType,
          });
        }
      });
      allResources.push({
        title: thisTitle,
        resources: filteredResources,
        unClassified,
      });
    });
    this.state = {
      allResources,
      selectedCategory: null,
    };
  }

  handleSetCategory = categoryName => {
    const { allResources } = this.state;
    const category = allResources.find(resource => resource.title === categoryName);
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.resource-type').forEach(node => {
        node.classList.remove('resource-type--visible');
        node.nextElementSibling.classList.remove('resources--visible');
      });
    }
    this.setState({
      selectedCategory: category,
    });
  };

  handleClickResourceType = evt => {
    evt.target.classList.toggle('resource-type--visible');
    evt.target.nextElementSibling.classList.toggle('resources--visible');
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
                  <CategorySelector
                    category={selectedCategory ? selectedCategory.title : ''}
                    categories={categories}
                    setCategory={categoryName => this.handleSetCategory(categoryName)}
                    label={resourcesLabel.resources}
                  />
                  <hr />
                  {selectedCategory &&
                    selectedCategory.resources.map(type => (
                      <div className="resource-type-container" key={type.title}>
                        <button
                          className="resource-type"
                          onClick={evt => this.handleClickResourceType(evt)}
                          type="button"
                        >
                          {type.title}
                        </button>
                        <div className="category-resources">
                          <div className="resources-heading">
                            <span>{resourcesLabel.resources.NAME}</span>
                          </div>
                          {type.documents.map(document => (
                            <div className="resource" key={makeid()}>
                              <a href={document.url} target="_blank" rel="noopener noreferrer">
                                {document.documentTitle || document.fileName}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
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
