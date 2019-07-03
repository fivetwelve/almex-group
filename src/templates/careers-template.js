import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import '../styles/careers.scss';
import { makeid } from '../utils/functions';

const allowHTML = { html: true };

const CareersTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
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
      childrenClass="careers"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
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
                <Markdown source={description} options={allowHTML} />
              </div>
            </div>
          </div>
          <hr className="divider" />
          <div className="postings-container">
            {careerPostings.length <= 0 && (
              <div className="heading">
                <Markdown source={noPostingsInstructions} options={allowHTML} />
              </div>
            )}
            {careerPostings.length > 0 && (
              <>
                <div className="heading">
                  <Markdown source={instructions} options={allowHTML} />
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
                              {<Markdown source={posting.companyAndLocation} options={allowHTML} />}
                            </div>
                            <div className="description">
                              {aboutLabel.about.POSTING_DESCRIPTION}
                            </div>
                            <div>
                              {<Markdown source={posting.description} options={allowHTML} />}
                              <div className="mobile">
                                <p>
                                  <b>{aboutLabel.about.POSTING_STATUS}</b>:{' '}
                                  {aboutLabel.about[posting.postingStatus]}
                                </p>
                                <p>
                                  <Markdown source={posting.instructions} options={allowHTML} />
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>{aboutLabel.about[posting.postingStatus]}</td>
                          <td>
                            <Markdown source={posting.instructions} options={allowHTML} />
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
      {/* )}
      </Location> */}
    </Layout>
  );
};

CareersTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

CareersTemplate.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    landingSections: PropTypes.array,
    locale: PropTypes.string,
    region: PropTypes.string,
  }),
};

export const query = graphql`
  query($id: ID!, $locale: GraphCMS_Locale!, $region: GraphCMS_Region!) {
    cms {
      ...CommonQuery
      aboutLabel: label(where: { availableIn: $region }) {
        about(locale: $locale)
      }
      page(where: { id: $id }) {
        careers: careersSource {
          bannerImage {
            handle
            width
            height
          }
          description(locale: $locale)
          instructions(locale: $locale)
          noPostingsInstructions(locale: $locale)
          title(locale: $locale)
          careerPostings {
            postingStatus
            position(locale: $locale)
            companyAndLocation(locale: $locale)
            description(locale: $locale)
            instructions(locale: $locale)
          }
        }
      }
    }
  }
`;

export default CareersTemplate;
