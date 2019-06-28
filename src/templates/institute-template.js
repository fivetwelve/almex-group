import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
// import { Location } from '@reach/router';
import GraphImg from 'graphcms-image';
import Markdown from 'react-remarkable';
import Layout from '../components/layout';
import { makeid } from '../utils/functions';
import '../styles/institute.scss';
import InstituteForm from '../components/instituteForm';

const allowHTML = { html: true };

const InstituteTemplate = ({ data, pageContext }) => {
  const { locale, region } = pageContext;
  const {
    cms: {
      // aboutLabel,
      brandNavigation,
      headerFooter,
      label,
      navigation,
      page: {
        institute: {
          bannerImage,
          contactAndForm,
          description,
          email,
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
      brandNavigation={brandNavigation}
      childrenClass="institute"
      headerFooter={headerFooter}
      label={label}
      navigation={navigation}
      region={region}
      title=""
    >
      {/* <Location>
        {({ location }) => ( */}
      <>
        <div className="institute-container">
          <div className="banner-wrapper">
            <div className="banner-image">
              <GraphImg image={bannerImage} maxWidth={1280} />
            </div>
          </div>
          <div className="main-container">
            <div className="main-content">
              <h1 className="title">{title}</h1>
              <div className="description">
                <Markdown source={description} options={allowHTML} />
              </div>
              <div className="topics-container">
                <div className="topics">
                  <Markdown source={topics} options={allowHTML} />
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
                  <Markdown source={presentation} options={allowHTML} />
                </div>
              </div>
              <div className="instructors-container">
                <div className="instructors">
                  <Markdown source={instructors} options={allowHTML} />
                </div>
                {instructorsImages.length > 0 && (
                  <div className="images">
                    {instructorsImages.map(image => (
                      <GraphImg key={makeid()} image={image} maxWidth={400} />
                    ))}
                  </div>
                )}
              </div>
              {pdfDownloads.length > 0 && <div className="pdfDownloads">test</div>}
            </div>
            <aside className="aside-container">
              {sideContent.map(content => (
                <Markdown key={makeid()} source={content} options={allowHTML} />
              ))}
            </aside>
          </div>
          <hr className="divider" />
          <div className="form-container">
            <Markdown source={contactAndForm} options={allowHTML} />
            <InstituteForm label={label} email={email} />
          </div>
        </div>
      </>
      {/* )}
      </Location> */}
    </Layout>
  );
};

InstituteTemplate.defaultProps = {
  data: {},
  pageContext: {},
};

InstituteTemplate.propTypes = {
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
      page(where: { id: $id }) {
        institute: instituteSource {
          bannerImage {
            handle
            width
            height
          }
          contactAndForm(locale: $locale)
          description(locale: $locale)
          email
          sideContent(locale: $locale)
          pdfDownloads(locale: $locale) {
            url
          }
          pdfTitles(locale: $locale)
          title(locale: $locale)
          topics(locale: $locale)
          presentation(locale: $locale)
          instructors(locale: $locale)
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
`;

export default InstituteTemplate;