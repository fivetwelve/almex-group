import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import Layout from '../components/layout';
import '../styles/careers.scss';
import { makeid, renderLink } from '../utils/functions';

const CareersTemplate = ({ data, pageContext }) => {
  // if (!data.cms.page.careers) {
  //   throw Error(
  //     `Check the connection to careersSource; missing localizations or query timeouts may also cause errors. Page ID ${pageContext.id}`,
  //   );
  // }
  const { languages, locale, localeData, region } = pageContext;
  const { label } = localeData;
  const {
    cms: {
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
      childrenClass="careers-page"
      languages={languages}
      localeData={localeData}
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
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[gfm]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {description}
                    </ReactMarkdown>
                    {careerPostings.length > 0 &&
                      `${label.about.POSTING_AVAILABLE} ${careerPostings.length}`}
                  </div>
                </div>
              </div>
              <hr className="divider" />
              <div className="postings-container">
                {careerPostings.length <= 0 && (
                  <div className="heading">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        link: props => renderLink(props, location),
                      }}
                    >
                      {noPostingsInstructions}
                    </ReactMarkdown>
                  </div>
                )}
                {careerPostings.length > 0 && (
                  <>
                    <div className="heading">
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[gfm]}
                        components={{
                          link: props => renderLink(props, location),
                        }}
                      >
                        {instructions}
                      </ReactMarkdown>
                    </div>
                    <div className="postings">
                      <table>
                        <thead>
                          <tr>
                            <th>
                              <span>{label.about.POSTING_TITLE}</span>
                            </th>
                            <th>
                              <span>{label.about.POSTING_STATUS}</span>
                            </th>
                            <th>
                              <span>{label.about.POSTING_SEND}</span>
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
                                    components={{
                                      link: props => renderLink(props, location),
                                    }}
                                  >
                                    {posting.companyAndLocation}
                                  </ReactMarkdown>
                                </div>
                                <div className="description">{label.about.POSTING_DESCRIPTION}</div>
                                <div>
                                  <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[gfm]}
                                    components={{
                                      link: props => renderLink(props, location),
                                    }}
                                  >
                                    {posting.description}
                                  </ReactMarkdown>
                                  <div className="mobile">
                                    <p>
                                      <b>{label.about.POSTING_STATUS}</b>:{' '}
                                      {label.about[posting.postingStatus]}
                                    </p>
                                    <ReactMarkdown
                                      rehypePlugins={[rehypeRaw]}
                                      remarkPlugins={[gfm]}
                                      components={{
                                        link: props => renderLink(props, location),
                                      }}
                                    >
                                      {posting.instructions}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </td>
                              <td>{label.about[posting.postingStatus]}</td>
                              <td>
                                <ReactMarkdown
                                  rehypePlugins={[rehypeRaw]}
                                  remarkPlugins={[gfm]}
                                  components={{
                                    link: props => renderLink(props, location),
                                  }}
                                >
                                  {posting.instructions}
                                </ReactMarkdown>
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
  query($id: ID!, $locales: [GraphCMS_Locale!]!) {
    cms {
      page(locales: $locales, where: { id: $id }) {
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
