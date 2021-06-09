import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import YouTube from 'react-youtube';
import { makeid } from '../utils/functions';
import { RESOURCE_TYPES, DOWNLOAD_URL } from '../constants';
import spinner from '../../static/img/spinner.gif';

/* query */
const GET_CATEGORY = gql`
  query($id: ID, $locale: [Locale!]!) {
    productSources(first: 1000, locales: $locale, where: { category: { id: $id } }) {
      id
      title
      youTubeVideos {
        title
        videoType
        youTubeId
      }
      pdfDownloads {
        id
        documentTitle
        fileName
        resourceType
        url
        availableIn
      }
      caseStudies {
        id
        documentTitle
        fileName
        resourceType
        url
        availableIn
      }
      page: refPage {
        archived
        availableIn
      }
    }
  }
`;

/* utility functions for component */
const checkFor = (array, property, value) => {
  const size = array.filter(element => element[property] === value).length;
  return size > 0;
};

/* exclusions and resourceTypes to filter against */
const exclusions = [RESOURCE_TYPES.OPERATING_MANUAL, RESOURCE_TYPES.SAFETY_DATA_SHEET];
let resourceTypes = Object.keys(RESOURCE_TYPES);
resourceTypes = resourceTypes.filter(element => !exclusions.includes(element));

const Category = props => {
  const { id, locale, region, documents, label } = props;
  const queryParams = {
    id,
    locale: [locale],
  };

  const gatherFromProducts = productSources => {
    const productResources = [];
    productSources.forEach(source => {
      /* ensure product isn't archived and is available for this region */
      if (source.page && !source.page.archived && source.page.availableIn.includes(region)) {
        source.pdfDownloads.forEach(pdf => {
          if (pdf.availableIn.includes(region)) {
            productResources.push(pdf);
          }
        });
        source.caseStudies.forEach(pdf => {
          if (pdf.availableIn.includes(region)) {
            productResources.push(pdf);
          }
        });
        source.youTubeVideos.forEach(video => {
          productResources.push(video);
        });
      }
    });
    return productResources;
  };

  // const gatherFromServices = servicesSources => {
  //   const servicesResources = [];
  //   return servicesResources;
  // };

  const handleClickResourceType = evt => {
    evt.target.classList.toggle('resource-type--visible');
    evt.target.nextElementSibling.classList.toggle('resources--visible');
  };

  const { loading, error, data } = useQuery(GET_CATEGORY, {
    variables: queryParams,
  });

  /* loading state */
  if (loading)
    return (
      <div className="loading">
        <img className="spinner-anim" src={spinner} alt="Loading..." />
      </div>
    );
  /* error state */
  if (error) return <div className="error">{label.common.ERROR}</div>;

  /* data empty or not found state */
  if (!data || (data.productSources && data.productSources.length === 0))
    return <div className="no-resource">{label.resources.NO_RESOURCE}</div>;

  /* data state */
  let resources = [];
  resources = resources.concat(documents);
  resources = resources.concat(gatherFromProducts(data.productSources));

  const filteredResources = [];
  const unClassified = [];
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
        title: label.resources[resourceType],
        resourceType,
        documents: thisType,
      });
    }
  });
  /* add unClassified resources at tail-end */
  if (unClassified.length > 0) {
    filteredResources.push({
      title: label.resources.MISC,
      resourceType: RESOURCE_TYPES.MISC,
      documents: unClassified,
    });
  }

  filteredResources.forEach(resource => {
    /* documents will sort on property if available, otherwise will ignore it */
    resource.documents.sort((a, b) => (a.documentTitle < b.documentTitle ? -1 : 1));
    resource.documents.sort((a, b) => (a.title < b.title ? -1 : 1));
  });

  return (
    <>
      {filteredResources.length > 0 &&
        filteredResources.map(type => (
          <div className="resource-type-container" key={makeid()}>
            <button
              className="resource-type"
              onClick={evt => handleClickResourceType(evt)}
              type="button"
            >
              {type.title || label.resources.MISC}
            </button>
            <div className="category-resources">
              {/* {' '} */}
              <div className="resources-heading">
                {/* <span>{label.resources.NAME}</span>{' '} */}
              </div>
              {(type.resourceType === RESOURCE_TYPES.PROMO_VIDEO ||
                type.resourceType === RESOURCE_TYPES.TRAINING_VIDEO) && (
                <div className="resource-videos">
                  {type.documents.map(document => (
                    <div className="resource" key={makeid()}>
                      {document.title}
                      <YouTube videoId={document.youTubeId} containerClassName="video-container" />
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
                          href={DOWNLOAD_URL + document.id}
                          target="_blank"
                          rel="noopener noreferrer nofollow noindex"
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
    </>
  );
};

Category.defaultProps = {
  id: '',
  locale: '',
  region: '',
  documents: [],
  label: {
    common: {
      ERROR: '',
    },
    resources: {
      MISC: '',
      NO_RESOURCE: '',
    },
  },
};

Category.propTypes = {
  id: PropTypes.string,
  locale: PropTypes.string,
  region: PropTypes.string,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      fileName: PropTypes.string,
      resourceType: PropTypes.string,
      documentTitle: PropTypes.string,
    }),
  ),
  label: PropTypes.shape({
    common: PropTypes.instanceOf(Object),
    resources: PropTypes.instanceOf(Object),
  }),
};

export default Category;
