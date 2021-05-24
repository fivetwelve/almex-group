import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
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
        `Check the connection to resourcesSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
      );
    }
    const { languages, locale, localeData, region } = pageContext;
    const { label } = localeData;
    const {
      cms: {
        page: {
          resources: { bannerImage, contactAndForm, description, email, emailSubject, title },
        },
      },
    } = data;
    const { categories, selectedCategory, selectedCategoryId } = this.state;

    return (
      <Layout
        activeLanguage={locale}
        // brandNavigation={brandNavigation}
        childrenClass="resources-page"
        // headerFooter={headerFooter}
        // label={label}
        languages={languages}
        localeData={localeData}
        // navigation={navigation}
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
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {description}
                      </ReactMarkdown>
                      <div className="selector-container">
                        <CategorySelector
                          categories={categories}
                          selectedCategory={selectedCategory}
                          setCategory={id => this.handleSetCategory(id)}
                          label={label.resources}
                        />
                        {selectedCategory && selectedCategory.expert && (
                          <div className="expert">
                            <p>{label.resources.CONTACT_EXPERT}</p>
                            {selectedCategory.expert.countryCode &&
                              countryFlag(selectedCategory.expert.countryCode)}
                            {selectedCategory.expert.name}
                            <br />
                            <ReactMarkdown>{selectedCategory.expert.location}</ReactMarkdown>
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
                          <div className="no-resource">{label.resources.NO_RESOURCE}</div>
                        )}
                      <ApolloProvider client={client}>
                        <Category
                          id={selectedCategoryId}
                          locale={locale}
                          region={region}
                          label={label}
                        />
                      </ApolloProvider>

                      <hr />
                      {email && (
                        <div className="form-container">
                          <ReactMarkdown
                            components={{
                              link: props => renderLink(props, location),
                            }}
                          >
                            {contactAndForm}
                          </ReactMarkdown>
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
    cms: PropTypes.instanceOf(Object),
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    localeData: PropTypes.instanceOf(Object),
    locales: PropTypes.instanceOf(Array),
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query(
    $id: ID!
    # $locale: [GraphCMS_Locale!]!
    # $region: GraphCMS_Region!
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      # resourcesLabel: label(locales: $locale, where: { availableIn: $region }) {
      #   resources
      # }
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
            name
            documents {
              id
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
