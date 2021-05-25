import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Layout from '../components/layout';
import InstituteForm from '../components/instituteForm';
import { makeid, renderLink } from '../utils/functions';
import '../styles/institute.scss';

import logo from '../../static/img/logo-institute.svg';

const InstituteTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.institute) {
  //   throw Error(
  //     `Check the connection to instituteSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const { label } = localeData;
  const {
    cms: {
      page: {
        institute: {
          bannerImage,
          contactAndForm,
          description,
          email,
          emailSubject,
          instructors,
          instructorsImages,
          pdfDownloads,
          presentation,
          presentationImages,
          sideContent,
          title,
          topics,
          topicsImages,
        },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      childrenClass="institute-page"
      languages={languages}
      localeData={localeData}
      region={region}
      title={title}
    >
      <Location>
        {({ location }) => (
          <>
            <div className="institute-container">
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
                  <div className="description">
                    <div className="institute-logo-mobile">
                      <img src={logo} alt="Almex Institute logo" />
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[gfm]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                  </div>
                  <div className="topics-container">
                    <div className="topics">
                      <ReactMarkdown
                        remarkPlugins={[gfm]}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {topics}
                      </ReactMarkdown>
                    </div>
                    {topicsImages.length > 0 && (
                      <div className="images">
                        {topicsImages.map(image => (
                          <GraphImg key={makeid()} image={image} maxWidth={400} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="presentation-container">
                    {presentationImages.length > 0 && (
                      <div className="images">
                        {presentationImages.map(image => (
                          <GraphImg key={makeid()} image={image} maxWidth={400} />
                        ))}
                      </div>
                    )}
                    <div className="presentation">
                      <ReactMarkdown
                        remarkPlugins={[gfm]}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {presentation}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="instructors-container">
                    <div className="instructors">
                      <ReactMarkdown
                        remarkPlugins={[gfm]}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {instructors}
                      </ReactMarkdown>
                    </div>
                    {instructorsImages.length > 0 && (
                      <div className="images">
                        {instructorsImages.map(image => (
                          <GraphImg key={makeid()} image={image} maxWidth={400} />
                        ))}
                      </div>
                    )}
                  </div>
                  {pdfDownloads.length > 0 && (
                    <div className="downloads">
                      {pdfDownloads.map(download => (
                        <div key={makeid()} className="pdf">
                          <div className="pdf-icon" />
                          <a
                            href={download.url}
                            rel="noopener noreferrer nofollow noindex"
                            target="_blank"
                          >
                            {download.documentTitle || download.fileName.split('.pdf')[0]}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <aside className="aside-container">
                  <div className="institute-logo">
                    <img src={logo} alt="Almex Institute logo" />
                  </div>
                  {sideContent.map(content => (
                    <div className="aside-block" key={makeid()}>
                      <ReactMarkdown
                        key={makeid()}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>
                  ))}
                </aside>
              </div>
              <hr className="divider" />
              {email && (
                <div className="form-container">
                  <ReactMarkdown
                    components={{
                      link: props => renderLink(props, location),
                    }}
                  >
                    {contactAndForm}
                  </ReactMarkdown>
                  <InstituteForm label={label} email={email} emailSubject={emailSubject} />
                </div>
              )}
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

InstituteTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

InstituteTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      label: PropTypes.instanceOf(Object),
      page: PropTypes.instanceOf(Object),
    }),
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
    $locales: [GraphCMS_Locale!]!
  ) {
    cms {
      page(locales: $locales, where: { id: $id }) {
        institute: contentSource {
          ... on GraphCMS_InstituteSource {
            bannerImage {
              handle
              width
              height
            }
            contactAndForm
            description
            email
            emailSubject
            sideContent
            pdfDownloads {
              documentTitle
              fileName
              url
            }
            title
            topics
            presentation
            instructors
            topicsImages {
              handle
              width
              height
            }
            presentationImages {
              handle
              width
              height
            }
            instructorsImages {
              handle
              width
              height
            }
          }
        }
      }
    }
  }
`;

export default InstituteTemplate;
