import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown/with-html';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-fetch';
import { countryFlag, renderLink } from '../utils/functions';
import Layout from '../components/layout';
import Category from '../components/category';
import CategorySelector from '../components/categorySelector';
import ContactForm from '../components/contactForm';
import { FORM_TYPES } from '../constants';
import '../styles/resources.scss';
import '../styles/contactForm.scss';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GATSBY_CMS_ENDPOINT,
    headers: { authorization: `Bearer ${process.env.GATSBY_CMS_TOKEN}` },
  }),
  fetch,
});

class ResourcesTemplate extends Component {
  constructor(props) {
    super(props);
    const { categories } = props.data.cms.page.resources;
    /* get resource types and remove any ones that are on the exclude list */

    /* state.selectedCategory is set to first category by default with code below.
       If we want to set it to the placeholder text ("Select a Category") then
       set state.selectedCategory: null */
    this.state = {
      categories,
      selectedCategory: categories[0] || null,
      selectedCategoryId: categories[0].id || null,
    };
  }

  handleSetCategory = id => {
    const { categories } = this.state;
    const selectedCategory = categories.find(category => category.id === id);
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.resource-type').forEach(node => {
        node.classList.remove('resource-type--visible');
        node.nextElementSibling.classList.remove('resources--visible');
      });
    }
    this.setState({
      selectedCategory,
      selectedCategoryId: id,
    });
  };

  render() {
    const { data, pageContext } = this.props;
    if (!data.cms.page.resources) {
      throw Error(
        `Check the connection to resourcesSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
      );
    }
    const { languages, locale, region } = pageContext;
    const {
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
    } = data;
    const { categories, selectedCategory, selectedCategoryId } = this.state;

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
                          categories={categories}
                          selectedCategory={selectedCategory}
                          setCategory={id => this.handleSetCategory(id)}
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
                      {selectedCategory &&
                        selectedCategory.resources &&
                        selectedCategory.resources.length === 0 && (
                          <div className="no-resource">{resourcesLabel.resources.NO_RESOURCE}</div>
                        )}
                      <ApolloProvider client={client}>
                        <Category
                          id={selectedCategoryId}
                          locale={locale}
                          region={region}
                          label={label}
                          resourcesLabel={resourcesLabel}
                        />
                      </ApolloProvider>

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
    id: PropTypes.string,
    languages: PropTypes.array,
    locale: PropTypes.string,
    locales: PropTypes.array,
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
<<<<<<< HEAD
      # productPages: pages(
      #   first: 1000
      #   where: { AND: [{ availableIn_contains_some: NORTH_AMERICA }, { pageType: PRODUCT }] }
      # ) {
      #   productSource {
      #     youTubeVideos {
      #       title
      #       videoType
      #       youTubeId
      #     }
      #     pdfDownloads {
      #       documentTitle
      #       fileName
      #       resourceType
      #       url
      #     }
      #     caseStudies {
      #       documentTitle
      #       fileName
      #       resourceType
      #       url
      #     }
      #   }
      # }
      # servicePages: pages(
      #   first: 1000
      #   where: { AND: [{ availableIn_contains_some: NORTH_AMERICA }, { pageType: SERVICES }] }
      # ) {
      #   id
      #   title
      # }
=======
>>>>>>> origin/dev
      page(locales: $locale, where: { id: $id }) {
        resources: resourcesSource {
          bannerImage {
            handle
            width
            height
          }
          description
          title
          categories(where: { OR: [{ archived: false }, { archived: null }] }) {
            id
            isProductCategory
            name
            documents {
              url
              fileName
              resourceType
              documentTitle
            }
            expert {
              name
              location
              countryCode
              telephone
              fax
              mobile
              email
            }
<<<<<<< HEAD
            # page {
            #   archived
            #   pageType
            #   landingSource {
            #     landingSections {
            #       pages(where: { OR: [{ archived: false }, { archived: null }] }) {
            #         id
            #         pageType
            #         productSource {
            #           youTubeVideos {
            #             title
            #             videoType
            #             youTubeId
            #           }
            #           pdfDownloads {
            #             documentTitle
            #             fileName
            #             resourceType
            #             url
            #           }
            #           caseStudies {
            #             documentTitle
            #             fileName
            #             resourceType
            #             url
            #           }
            #         }
            #         landingSource {
            #           landingSections {
            #             pages(where: { OR: [{ archived: false }, { archived: null }] }) {
            #               pageType
            #               productSource {
            #                 youTubeVideos {
            #                   title
            #                   videoType
            #                   youTubeId
            #                 }
            #                 pdfDownloads {
            #                   url
            #                   fileName
            #                   resourceType
            #                   documentTitle
            #                 }
            #                 caseStudies {
            #                   url
            #                   fileName
            #                   resourceType
            #                   documentTitle
            #                 }
            #               }
            #             }
            #           }
            #           pages(where: { OR: [{ archived: false }, { archived: null }] }) {
            #             id
            #             pageType
            #             productSource {
            #               youTubeVideos {
            #                 title
            #                 videoType
            #                 youTubeId
            #               }
            #               pdfDownloads {
            #                 url
            #                 fileName
            #                 resourceType
            #                 documentTitle
            #               }
            #               caseStudies {
            #                 url
            #                 fileName
            #                 resourceType
            #                 documentTitle
            #               }
            #             }
            #           }
            #         }
            #       }
            #     }
            #     pages(where: { OR: [{ archived: false }, { archived: null }] }) {
            #       id
            #       pageType
            #       productSource {
            #         youTubeVideos {
            #           title
            #           videoType
            #           youTubeId
            #         }
            #         pdfDownloads {
            #           url
            #           fileName
            #           resourceType
            #           documentTitle
            #         }
            #         caseStudies {
            #           url
            #           fileName
            #           resourceType
            #           documentTitle
            #         }
            #       }
            #     }
            #   }
            # }
=======
>>>>>>> origin/dev
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
