import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import YouTube from 'react-youtube';
import Layout from '../components/layout';
import CategorySelector from '../components/categorySelector';
import countryFlag from '../components/countryFlag';
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
            page.productSource.youTubeVideos.forEach(video => {
              resources.push(video);
            });
          });
        });
      }
      if (category.page.pageType === 'SERVICES') {
        thisTitle = category.page.servicesSource.title;
        if (category.page.documents) {
          category.page.documents.forEach(document => {
            resources.push(document);
          });
        }
      }
      // filter documents
      resourcesTypes.forEach(resourceType => {
        const thisType = [];
        resources.forEach(resource => {
          if (
            // look for document resources first
            resource.resourceType &&
            resource.resourceType === resourceType &&
            !checkFor(thisType, 'url', resource.url)
          ) {
            thisType.push(resource);
          } else if (
            // look for video resources next
            resource.videoType &&
            resource.videoType === resourceType &&
            !checkFor(thisType, 'youTubeId', resource.youTubeId)
          ) {
            thisType.push(resource);
          } else if (
            // resource type cannot be identified so add it to unClassified array if not already there
            !resource.resourceType &&
            !resource.videoType &&
            !checkFor(unClassified, 'url', resource.url) &&
            !checkFor(unClassified, 'youTubeId', resource.youTubeId)
          ) {
            unClassified.push(resource);
          }
        });
        if (thisType.length > 0) {
          // only account for groups with 1 or more resources
          filteredResources.push({
            title: resourcesLabel.resources[resourceType],
            resourceType,
            documents: thisType,
          });
        }
      });
      allResources.push({
        title: thisTitle,
        resources: filteredResources,
        unClassified,
        expert: category.expert,
      });
    });

    /* state.selectedCategory is set to first category by default with code below. If we want to set it to the placeholder text ("Select a Category") then set state.selectedCategory: null */
    let categoryName;
    if (categories[0].page.pageType === 'LANDING') {
      categoryName = categories[0].page.landingSource.title;
    } else if (categories[0].page.pageType === 'SERVICES') {
      categoryName = categories[0].page.servicesSource.title;
    }

    this.state = {
      allResources,
      selectedCategory:
        (categoryName && allResources.find(resource => resource.title === categoryName)) || null,
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
        childrenClass="resources-page"
        headerFooter={headerFooter}
        label={label}
        navigation={navigation}
        region={region}
        title={title}
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
                  <div className="selector-container">
                    <CategorySelector
                      category={selectedCategory ? selectedCategory.title : ''}
                      categories={categories}
                      setCategory={categoryName => this.handleSetCategory(categoryName)}
                      label={resourcesLabel.resources}
                    />
                    {selectedCategory && selectedCategory.expert && (
                      <div className="expert">
                        <p>{resourcesLabel.resources.CONTACT_EXPERT}</p>
                        {selectedCategory.expert.countryCode &&
                          countryFlag(selectedCategory.expert.countryCode)}
                        {selectedCategory.expert.name}
                        <br />
                        <Markdown source={selectedCategory.expert.location} options={allowHTML} />
                        {selectedCategory.expert.telephone && (
                          <a href={`tel:${selectedCategory.expert.telephone}`}>
                            {selectedCategory.expert.telephone}
                          </a>
                        )}
                        {selectedCategory.expert.mobile && (
                          <a href={`tel:${selectedCategory.expert.mobile}`}>
                            {selectedCategory.expert.mobile}
                          </a>
                        )}
                        {selectedCategory.expert.email && (
                          <a href={`mailto:${selectedCategory.expert.email}`}>
                            {selectedCategory.expert.email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <hr />
                  {selectedCategory && selectedCategory.resources.length === 0 && (
                    <div className="no-resource">{resourcesLabel.resources.NO_RESOURCE}</div>
                  )}
                  {selectedCategory &&
                    selectedCategory.resources.length > 0 &&
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
                          {(type.resourceType === RESOURCE_TYPES.PROMO_VIDEO ||
                            type.resourceType === RESOURCE_TYPES.TRAINING_VIDEO) && (
                            <div className="resource-videos">
                              {type.documents.map(document => (
                                <div className="resource" key={makeid()}>
                                  {document.title}
                                  <YouTube
                                    videoId={document.youTubeId}
                                    containerClassName="video-container"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                          {type.resourceType !== RESOURCE_TYPES.PROMO_VIDEO &&
                            type.resourceType !== RESOURCE_TYPES.TRAINING_VIDEO && (
                              <div className="resource-documents">
                                {type.documents.map(document => (
                                  <div className="resource" key={makeid()}>
                                    <a
                                      href={document.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {document.documentTitle || document.fileName.split('.pdf')[0]}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
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
          categories(where: { AND: [{ status: PUBLISHED }, { page: { status: PUBLISHED } }] }) {
            isProductCategory
            expert {
              name
              location
              countryCode
              telephone
              fax
              mobile
              email
            }
            page {
              pageType
              landingSource {
                title(locale: $locale)
                landingSections {
                  pages(where: { status: PUBLISHED }) {
                    productSource {
                      youTubeVideos {
                        title(locale: $locale)
                        videoType
                        youTubeId
                      }
                      pdfDownloads(locale: $locale) {
                        documentTitle(locale: $locale)
                        fileName
                        resourceType
                        url
                      }
                    }
                  }
                }
                singlePages: pages(where: { status: PUBLISHED }) {
                  productSource {
                    pdfDownloads(locale: $locale) {
                      url
                      fileName
                      resourceType
                      documentTitle(locale: $locale)
                    }
                  }
                }
              }
              servicesSource {
                title(locale: $locale)
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
          sortOrder(locale: $locale)
        }
      }
    }
  }
`;

export default ResourcesTemplate;
