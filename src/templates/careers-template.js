import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import '../styles/careers.scss';
import { makeid, renderLink } from '../utils/functions';

const CareersTemplate = ({ data, pageContext }) => {
  if (!data.cms.page.careers) {
    throw Error(
      `Check the connection to careersSource; missing localization or publish status may also cause errors. Page ID ${pageContext.id}`,
    );
  }
  const { languages, locale, region } = pageContext;
  const {
    cms: {
      aboutLabel,
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        careers: {
          bannerImage,
          careerPostings,
          description,
          instructions,
          noPostingsInstructions,
          title,
        },
      },
    },
  } = data;

  return (
    <Layout
      activeLanguage={locale}
      brandNavigation={brandNavigation}
      childrenClass="careers-page"
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
            <div className="careers-container">
              {bannerImage && (
                <div className="banner-wrapper">
                  <div className="banner-image">
                    <GraphImg image={bannerImage} maxWidth={1280} />
                  </div>
                </div>
              )}
              <div className="intro-container">
                <div className="intro-content">
                  <h1 className="title">{title}</h1>
                  <div className="description">
                    <ReactMarkdown
                      source={description}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
                    {careerPostings.length > 0 &&
                      `${aboutLabel.about.POSTING_AVAILABLE} ${careerPostings.length}`}
                  </div>
                </div>
              </div>
              <hr className="divider" />
              <div className="postings-container">
                {careerPostings.length <= 0 && (
                  <div className="heading">
                    <ReactMarkdown
                      source={noPostingsInstructions}
                      escapeHtml={false}
                      renderers={{
                        link: props => renderLink(props, location),
                      }}
                    />
                  </div>
                )}
                {careerPostings.length > 0 && (
                  <>
                    <div className="heading">
                      <ReactMarkdown
                        source={instructions}
                        escapeHtml={false}
                        renderers={{
                          link: props => renderLink(props, location),
                        }}
                      />
                    </div>
                    <div className="postings">
                      <table>
                        <thead>
                          <tr>
                            <th>
                              <span>{aboutLabel.about.POSTING_TITLE}</span>
                            </th>
                            <th>
                              <span>{aboutLabel.about.POSTING_STATUS}</span>
                            </th>
                            <th>
                              <span>{aboutLabel.about.POSTING_SEND}</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {careerPostings.map(posting => (
                            <tr key={makeid()}>
                              <td>
                                <div className="position">{posting.position}</div>
                                <div className="companyAndLocation">
                                  <ReactMarkdown
                                    source={posting.companyAndLocation}
                                    escapeHtml={false}
                                    renderers={{
                                      link: props => renderLink(props, location),
                                    }}
                                  />
                                </div>
                                <div className="description">
                                  {aboutLabel.about.POSTING_DESCRIPTION}
                                </div>
                                <div>
                                  <ReactMarkdown
                                    source={posting.description}
                                    escapeHtml={false}
                                    renderers={{
                                      link: props => renderLink(props, location),
                                    }}
                                  />
                                  <div className="mobile">
                                    <p>
                                      <b>{aboutLabel.about.POSTING_STATUS}</b>:{' '}
                                      {aboutLabel.about[posting.postingStatus]}
                                    </p>
                                    <ReactMarkdown
                                      source={posting.instructions}
                                      escapeHtml={false}
                                      renderers={{
                                        link: props => renderLink(props, location),
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td>{aboutLabel.about[posting.postingStatus]}</td>
                              <td>
                                <ReactMarkdown
                                  source={posting.instructions}
                                  escapeHtml={false}
                                  renderers={{
                                    link: props => renderLink(props, location),
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <hr className="divider" />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </Location>
    </Layout>
  );
};

CareersTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

CareersTemplate.propTypes = {
  data: PropTypes.shape({
    cms: PropTypes.shape({
      aboutLabel: PropTypes.instanceOf(Object),
      brandNavigation: PropTypes.instanceOf(Object),
      headerFooter: PropTypes.instanceOf(Object),
      label: PropTypes.instanceOf(Object),
      navigation: PropTypes.instanceOf(Object),
      page: PropTypes.instanceOf(Object),
    }),
  }),
  pageContext: PropTypes.shape({
    id: PropTypes.string,
    languages: PropTypes.instanceOf(Array),
    locale: PropTypes.string,
    locales: PropTypes.instanceOf(Array),
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
      aboutLabel: label(locales: $locale, where: { availableIn: $region }) {
        about
      }
      page(locales: $locale, where: { id: $id }) {
        careers: careersSource {
          bannerImage {
            handle
            width
            height
          }
          description
          instructions
          noPostingsInstructions
          title
          careerPostings {
            postingStatus
            position
            companyAndLocation
            description
            instructions
          }
        }
      }
    }
  }
`;

export default CareersTemplate;
