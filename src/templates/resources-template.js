import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import YouTube from 'react-youtube';
import Layout from '../components/layout';
import CategorySelector from '../components/categorySelector';
import ContactForm from '../components/contactForm';
import { countryFlag, makeid, renderLink } from '../utils/functions';
import { FORM_TYPES, PAGE_TYPES, RESOURCE_TYPES } from '../constants';
import '../styles/resources.scss';
import '../styles/contactForm.scss';

const checkFor = (array, property, value) => {
  const size = array.filter(element => element[property] === value).length;
  return size > 0;
};

const collateFromPages = pages => {
  let additions = [];
  pages.forEach(page => {
    if (page.pageType === PAGE_TYPES.PRODUCT) {
      page.productSource.pdfDownloads.forEach(pdf => {
        additions.push(pdf);
      });
      page.productSource.caseStudies.forEach(pdf => {
        additions.push(pdf);
      });
      page.productSource.youTubeVideos.forEach(video => {
        additions.push(video);
      });
    }
    if (page.pageType === PAGE_TYPES.LANDING) {
      if (page.landingSource.landingSections) {
        page.landingSource.landingSections.forEach(section => {
          additions = additions.concat(collateFromPages(section.pages));
        });
      }
      if (page.landingSource.pages) {
        page.landingSource.pages.forEach(childPage => {
          if (childPage.pageType === PAGE_TYPES.PRODUCT) {
            childPage.productSource.pdfDownloads.forEach(pdf => {
              additions.push(pdf);
            });
            childPage.productSource.caseStudies.forEach(pdf => {
              additions.push(pdf);
            });
            childPage.productSource.youTubeVideos.forEach(video => {
              additions.push(video);
            });
          }
        });
      }
    }
  });
  return additions;
};

const excludeList = [RESOURCE_TYPES.OPERATING_MANUAL, RESOURCE_TYPES.SAFETY_DATA_SHEET];

class ResourcesTemplate extends Component {
  constructor(props) {
    super(props);
    const { categories } = props.data.cms.page.resources;
    const { resourcesLabel } = props.data.cms;
    const allCategories = [];
    /* get resource types and remove any ones that are on the exclude list */
    let resourceTypes = Object.keys(RESOURCE_TYPES);
    resourceTypes = resourceTypes.filter(element => !excludeList.includes(element));

    // console.log(categories);

    categories.forEach(category => {
      let resources = [];
      const filteredResources = [];
      const unClassified = [];
      /* collect all documents for each category */

      if (category.page.pageType === PAGE_TYPES.LANDING) {
        /* while searching for resources, we expect the structural limit of the hierarchy to be:

          landingSource
          |
          |-- landingSection(s)
          |   |-- page(s)
          |       |-- productSource
          |       |
          |       |-- landingSource(s)
          |           |-- page(s)
          |           |   |-- productSource
          |           |
          |           |-- landingSection(s)
          |               |-- page(s)
          |                   |-- productSource
          |-- page(s)
              |-- productSource
        */

        category.page.landingSource.landingSections.forEach(section => {
          resources = resources.concat(collateFromPages(section.pages));
        });

        category.page.landingSource.pages.forEach(childPage => {
          if (childPage.pageType === PAGE_TYPES.PRODUCT) {
            childPage.productSource.pdfDownloads.forEach(pdf => {
              resources.push(pdf);
            });
            childPage.productSource.caseStudies.forEach(pdf => {
              resources.push(pdf);
            });
            childPage.productSource.youTubeVideos.forEach(video => {
              resources.push(video);
            });
          }
        });
      }

      if (
        category.page.pageType === PAGE_TYPES.SERVICES ||
        category.page.pageType === PAGE_TYPES.INSTITUTE
      ) {
        if (category.documents.length > 0) {
          category.page.documents.forEach(document => {
            resources.push(document);
          });
        }
      }
      /*  filter documents */
      resourceTypes.forEach(resourceType => {
        const thisType = [];
        resources.forEach(resource => {
          if (
            /* look for document resources first */
            resource.resourceType &&
            resource.resourceType === resourceType &&
            !checkFor(thisType, 'url', resource.url)
          ) {
            thisType.push(resource);
          } else if (
            /* look for video resources next */
            resource.videoType &&
            resource.videoType === resourceType &&
            !checkFor(thisType, 'youTubeId', resource.youTubeId)
          ) {
            thisType.push(resource);
          } else if (
            /* resource type cannot be identified so add it to unClassified array if not already there */
            !resource.resourceType &&
            !resource.videoType &&
            !checkFor(unClassified, 'url', resource.url) &&
            !checkFor(unClassified, 'youTubeId', resource.youTubeId)
          ) {
            unClassified.push(resource);
          }
        });
        if (thisType.length > 0) {
          filteredResources.push({
            title: resourcesLabel.resources[resourceType],
            resourceType,
            documents: thisType,
          });
        }
      });
      const key = makeid();
      allCategories.push({
        id: category.id,
        title: category.name,
        resources: filteredResources,
        unClassified,
        expert: category.expert,
        key,
      });
    });

    /* state.selectedCategory is set to first category by default with code below. If we want to set it to the placeholder text ("Select a Category") then set state.selectedCategory: null */
    this.state = {
      allCategories,
      selectedCategory: allCategories[0] || null,
    };
  }

  handleSetCategory = key => {
    const { allCategories } = this.state;
    const category = allCategories.find(resource => resource.key === key);
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
            resources: { bannerImage, contactAndForm, description, email, emailSubject, title },
          },
          resourcesLabel,
        },
      },
      pageContext: { languages, locale, region },
    } = this.props;
    const { allCategories, selectedCategory } = this.state;

    return (
      <Layout
        activeLanguage={locale}
        brandNavigation={brandNavigation}
        childrenClass="resources-page"
        headerFooter={headerFooter}
        label={label}
        languages={languages}
        navigation={navigation}
        region={region}
        title={title}
      >
        <Location>
          {({ location }) => (
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
                      <ReactMarkdown
                        source={description}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props, location),
                        }}
                      />
                      <div className="selector-container">
                        <CategorySelector
                          categories={allCategories}
                          selectedCategory={selectedCategory}
                          setCategory={categoryKey => this.handleSetCategory(categoryKey)}
                          label={resourcesLabel.resources}
                        />
                        {selectedCategory && selectedCategory.expert && (
                          <div className="expert">
                            <p>{resourcesLabel.resources.CONTACT_EXPERT}</p>
                            {selectedCategory.expert.countryCode &&
                              countryFlag(selectedCategory.expert.countryCode)}
                            {selectedCategory.expert.name}
                            <br />
                            <ReactMarkdown
                              source={selectedCategory.expert.location}
                              escapeHtml={false}
                            />
                            {selectedCategory.expert.telephone && (
                              <a
                                href={`tel:${selectedCategory.expert.telephone}`}
                                rel="nofollow noindex"
                              >
                                {selectedCategory.expert.telephone}
                              </a>
                            )}
                            {selectedCategory.expert.mobile && (
                              <a
                                href={`tel:${selectedCategory.expert.mobile}`}
                                rel="nofollow noindex"
                              >
                                {selectedCategory.expert.mobile}
                              </a>
                            )}
                            {selectedCategory.expert.email && (
                              <a
                                href={`mailto:${selectedCategory.expert.email}`}
                                rel="nofollow noindex"
                              >
                                {selectedCategory.expert.email}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      <hr />
                      {/* shown when there are no resources for this category */}
                      {/* {selectedCategory && selectedCategory.resources.length === 0 && (
                        <div className="no-resource">{resourcesLabel.resources.NO_RESOURCE}</div>
                      )} */}
                      {selectedCategory &&
                        selectedCategory.resources.length > 0 &&
                        selectedCategory.resources.map(type => (
                          <div className="resource-type-container" key={makeid()}>
                            <button
                              className="resource-type"
                              onClick={evt => this.handleClickResourceType(evt)}
                              type="button"
                            >
                              {type.title || resourcesLabel.resources.MISC}
                            </button>
                            <div className="category-resources">
                              {/* <div className="resources-heading">
                                <span>{resourcesLabel.resources.NAME}</span>
                              </div> */}
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
                                          rel="noopener noreferrer nofollow noindex"
                                        >
                                          {document.documentTitle ||
                                            document.fileName.split('.pdf')[0]}
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      <hr />
                      {email && (
                        <div className="form-container">
                          <ReactMarkdown
                            source={contactAndForm}
                            escapeHtml={false}
                            renderers={{
                              link: props => renderLink(props, location),
                            }}
                          />
                          <ContactForm
                            label={label}
                            email={email}
                            emailSubject={emailSubject}
                            formType={FORM_TYPES.CONTACT}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Location>
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
    languages: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    $locale: [GraphCMS_Locale!]!
    $locales: [GraphCMS_Locale!]!
    $region: GraphCMS_Region!
  ) {
    cms {
      ...CommonQuery
      resourcesLabel: label(locales: $locale, where: { availableIn: $region }) {
        resources
      }
      page(locales: $locales, where: { id: $id }) {
        resources: resourcesSource {
          bannerImage {
            handle
            width
            height
          }
          description
          title
          categories {
            id
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
                landingSections {
                  pages {
                    id
                    pageType
                    productSource {
                      youTubeVideos {
                        title
                        videoType
                        youTubeId
                      }
                      pdfDownloads {
                        documentTitle
                        fileName
                        resourceType
                        url
                      }
                      caseStudies {
                        documentTitle
                        fileName
                        resourceType
                        url
                      }
                    }
                    landingSource {
                      landingSections {
                        pages {
                          pageType
                          productSource {
                            youTubeVideos {
                              title
                              videoType
                              youTubeId
                            }
                            pdfDownloads {
                              url
                              fileName
                              resourceType
                              documentTitle
                            }
                            caseStudies {
                              url
                              fileName
                              resourceType
                              documentTitle
                            }
                          }
                        }
                      }
                      pages {
                        id
                        pageType
                        productSource {
                          youTubeVideos {
                            title
                            videoType
                            youTubeId
                          }
                          pdfDownloads {
                            url
                            fileName
                            resourceType
                            documentTitle
                          }
                          caseStudies {
                            url
                            fileName
                            resourceType
                            documentTitle
                          }
                        }
                      }
                    }
                  }
                }
                pages {
                  id
                  pageType
                  productSource {
                    youTubeVideos {
                      title
                      videoType
                      youTubeId
                    }
                    pdfDownloads {
                      url
                      fileName
                      resourceType
                      documentTitle
                    }
                    caseStudies {
                      url
                      fileName
                      resourceType
                      documentTitle
                    }
                  }
                }
              }
            }
            name
            documents {
              url
              fileName
              resourceType
              documentTitle
            }
          }
          contactAndForm
          email
          emailSubject
        }
      }
    }
  }
`;

export default ResourcesTemplate;
