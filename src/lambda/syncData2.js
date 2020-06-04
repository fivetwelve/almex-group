import fetch from 'node-fetch';
import algoliasearch from 'algoliasearch';
import 'dotenv/config';
import { PAGE_TYPES, SOURCE_TYPE_NAMES, SOURCE_TYPES } from '../constants';

const {
  ALGOLIA_API_KEY,
  ALGOLIA_INDEX,
  GATSBY_ALGOLIA_APP_ID,
  CMS_NEW_ENDPOINT,
  CMS_NEW_TOKEN,
} = process.env;
const algolia = algoliasearch(GATSBY_ALGOLIA_APP_ID, ALGOLIA_API_KEY);

// const PUBLISH_ABOUT_OBSERVER = 'publishAboutSource';
// const UNPUBLISH_ABOUT_OBSERVER = 'unpublishAboutSource';

// const UNPUBLISH_MULTIPLE_ABOUT_OBSERVER = 'unpublishManyAboutSource';

// const PUBLISH_INSTITUTE_OBSERVER = 'publishInstituteSource';
// const UNPUBLISH_INSTITUTE_OBSERVER = 'unpublishInstituteSource';

// const UNPUBLISH_MULTIPLE_INSTITUTE_OBSERVER = 'unpublishManyInstituteSource';
// const PUBLISH_PAGE_OBSERVER = 'publishPage';
// const UNPUBLISH_PAGE_OBSERVER = 'unpublishPage';
// const UNPUBLISH_MULTIPLE_PAGE_OBSERVER = 'unpublishManyPage';
// const PUBLISH_PRODUCT_OBSERVER = 'publishProductSource';
// const UNPUBLISH_PRODUCT_OBSERVER = 'unpublishProductSource';
// const UNPUBLISH_MULTIPLE_PRODUCT_OBSERVER = 'unpublishManyProductSource';
// const PUBLISH_PROMO_OBSERVER = 'publishPromoSource';
// const UNPUBLISH_PROMO_OBSERVER = 'unpublishPromoSource';
// const UNPUBLISH_MULTIPLE_PROMO_OBSERVER = 'unpublishManyPromoSource';
// const PUBLISH_SERVICES_OBSERVER = 'publishServicesSource';
// const UNPUBLISH_SERVICES_OBSERVER = 'unpublishServicesSource';
// const UNPUBLISH_MULTIPLE_SERVICES_OBSERVER = 'unpublishManyServicesSource';
// const PUBLISH_SIMPLE_OBSERVER = 'publishSimpleSource';
// const UNPUBLISH_SIMPLE_OBSERVER = 'unpublishSimpleSource';
// const UNPUBLISH_MULTIPLE_SIMPLE_OBSERVER = 'unpublishManySimpleSource';

const PUBLISH_EVENT = 'publish';
const UNPUBLISH_EVENT = 'unpublish';
const PAGE = 'Page';

// const CREATE_ABOUT_OBSERVER = 'createAboutSource';
// const UPDATE_ABOUT_OBSERVER = 'updateAboutSource';
// const DELETE_ABOUT_OBSERVER = 'deleteAboutSource';
// const DELETE_MULTIPLE_ABOUT_OBSERVER = 'deleteManyAboutSource';
// const CREATE_INSTITUTE_OBSERVER = 'createInstituteSource';
// const UPDATE_INSTITUTE_OBSERVER = 'updateInstituteSource';
// const DELETE_INSTITUTE_OBSERVER = 'deleteInstituteSource';
// const DELETE_MULTIPLE_INSTITUTE_OBSERVER = 'deleteManyInstituteSource';
// const CREATE_PAGE_OBSERVER = 'createPage';
const UPDATE_PAGE_OBSERVER = 'updatePage';
const DELETE_PAGE_OBSERVER = 'deletePage';
// const DELETE_MULTIPLE_PAGE_OBSERVER = 'deleteManyPage';
// const CREATE_PRODUCT_OBSERVER = 'createProductSource';
// const UPDATE_PRODUCT_OBSERVER = 'updateProductSource';
// const DELETE_PRODUCT_OBSERVER = 'deleteProductSource';
// const DELETE_MULTIPLE_PRODUCT_OBSERVER = 'deleteManyProductSource';
// const CREATE_PROMO_OBSERVER = 'createPromoSource';
// const UPDATE_PROMO_OBSERVER = 'updatePromoSource';
// const DELETE_PROMO_OBSERVER = 'deletePromoSource';
// const DELETE_MULTIPLE_PROMO_OBSERVER = 'deleteManyPromoSource';
// const CREATE_SERVICES_OBSERVER = 'createServicesSource';
// const UPDATE_SERVICES_OBSERVER = 'updateServicesSource';
// const DELETE_SERVICES_OBSERVER = 'deleteServicesSource';
// const DELETE_MULTIPLE_SERVICES_OBSERVER = 'deleteManyServicesSource';
// const CREATE_SIMPLE_OBSERVER = 'createSimpleSource';
// const UPDATE_SIMPLE_OBSERVER = 'updateSimpleSource';
// const DELETE_SIMPLE_OBSERVER = 'deleteSimpleSource';
// const DELETE_MULTIPLE_SIMPLE_OBSERVER = 'deleteManySimpleSource';

// const deleteManyObservers = [
//   DELETE_MULTIPLE_ABOUT_OBSERVER,
//   DELETE_MULTIPLE_INSTITUTE_OBSERVER,
//   DELETE_MULTIPLE_PAGE_OBSERVER,
//   DELETE_MULTIPLE_PRODUCT_OBSERVER,
//   DELETE_MULTIPLE_PROMO_OBSERVER,
//   DELETE_MULTIPLE_SERVICES_OBSERVER,
//   DELETE_MULTIPLE_SIMPLE_OBSERVER,
// ];

/* update acceptedPageTypes and associated Observors if/when
   new content source types need to be indexed on Algolia */
const acceptedPageTypes = [
  PAGE_TYPES.ABOUT,
  PAGE_TYPES.INSTITUTE,
  PAGE_TYPES.PRODUCT,
  PAGE_TYPES.PROMO,
  PAGE_TYPES.SERVICES,
  PAGE_TYPES.SIMPLE,
];

const acceptedSources = [
  SOURCE_TYPE_NAMES.ABOUT,
  SOURCE_TYPE_NAMES.PRODUCT,
  SOURCE_TYPE_NAMES.PROMO,
  SOURCE_TYPE_NAMES.SERVICES,
  SOURCE_TYPE_NAMES.SIMPLE,
  SOURCE_TYPE_NAMES.INSTITUTE,
];

// const pageObservers = [CREATE_PAGE_OBSERVER, UPDATE_PAGE_OBSERVER, DELETE_PAGE_OBSERVER];
// const sourceCreationObservers = [
//   CREATE_ABOUT_OBSERVER,
//   CREATE_INSTITUTE_OBSERVER,
//   CREATE_PRODUCT_OBSERVER,
//   CREATE_PROMO_OBSERVER,
//   CREATE_SERVICES_OBSERVER,
//   CREATE_SIMPLE_OBSERVER,
// ];
// const sourceUpdateObservers = [
//   UPDATE_ABOUT_OBSERVER,
//   UPDATE_INSTITUTE_OBSERVER,
//   UPDATE_PRODUCT_OBSERVER,
//   UPDATE_PROMO_OBSERVER,
//   UPDATE_SERVICES_OBSERVER,
//   UPDATE_SIMPLE_OBSERVER,
// ];
// const sourceDeletionObservers = [
//   DELETE_ABOUT_OBSERVER,
//   DELETE_INSTITUTE_OBSERVER,
//   DELETE_PRODUCT_OBSERVER,
//   DELETE_PROMO_OBSERVER,
//   DELETE_SERVICES_OBSERVER,
//   DELETE_SIMPLE_OBSERVER,
// ];

// const allObservers = [
//   ...pageObservers,
//   ...sourceCreationObservers,
//   ...sourceUpdateObservers,
//   ...sourceDeletionObservers,
// ];

/* update this as needed when schema changes or more sources need to sync with Algolia */
const sourcesWithBrand = [
  SOURCE_TYPES.INSTITUTE,
  SOURCE_TYPES.LANDING,
  SOURCE_TYPES.PRODUCT,
  SOURCE_TYPES.PROMO,
  SOURCE_TYPES.SERVICES,
  SOURCE_TYPES.SIMPLE,
];

const contentNames = [
  SOURCE_TYPE_NAMES.ABOUT,
  SOURCE_TYPE_NAMES.INSTITUTE,
  SOURCE_TYPE_NAMES.PRODUCT,
  SOURCE_TYPE_NAMES.PROMO,
  SOURCE_TYPE_NAMES.SERVICES,
  SOURCE_TYPE_NAMES.SIMPLE,
];
const contentSources = [
  SOURCE_TYPES.ABOUT,
  SOURCE_TYPES.INSTITUTE,
  SOURCE_TYPES.PRODUCT,
  SOURCE_TYPES.PROMO,
  SOURCE_TYPES.SERVICES,
  SOURCE_TYPES.SIMPLE,
];

const statusAndMessage = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});

/* retrieve supplemental data from GraphCMS */
const getQueryData = async (isSource, id, sourceType = '', hasBrand) => {
  const brand = hasBrand ? 'brand' : '';
  let queryData;
  if (isSource) {
    queryData = {
      query: `query {${sourceType} (where: {id: \"${id}\"}) {${brand} keywordsEN: keywords(locale: EN) keywordsES: keywords(locale: ES) titleEN: title(locale: EN) titleES: title(locale: ES)}}`,
    };
  } else {
    queryData = {
      // query: `query {page (where: {id: \"${id}\"}) {id availableIn excerptEN: excerpt(locale: EN) excerptES: excerpt(locale: ES) slugEN: slug(locale: EN) slugES: slug(locale: ES) status}}`,
      query: `query { page(where: {id: \"${id}\"}) { id availableIn pageType localizations(includeCurrent: true) { locale excerpt slug } ${sourceType} { id ${brand} localizations(includeCurrent: true) { locale keywords title }}}}`,
    };
  }

  // console.log(queryData);
  try {
    const response = await fetch(CMS_NEW_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CMS_NEW_TOKEN}`,
      },
      method: 'POST',
      body: JSON.stringify(queryData),
    });
    const data = await response.json();
    console.log('data-----');
    console.log(data);
    if (data.errors) {
      throw data.errors[0];
    }
    return data;
  } catch (err) {
    // console.log(err);
    return { errors: [err] };
  }
};
/* end of retrieve supplemental data */

/* sync supplemental data from GraphCMS */
const syncToAlgolia = async incomingRecord => {
  // console.log('---sync to Algolia');
  try {
    const index = algolia.initIndex(ALGOLIA_INDEX);
    const record = await index.saveObject(incomingRecord);
    return statusAndMessage(200, record);
  } catch (err) {
    return statusAndMessage(500, err.message);
  }
};

const removeFromAlgolia = async (isSource, id) => {
  // console.log('---remove from Algolia');
  /* n.b. in Algolia page.id must be a facetFilter, otherwise deletion using it would not work */
  let resp;
  const index = algolia.initIndex(ALGOLIA_INDEX);
  try {
    if (isSource) {
      resp = await index.deleteObject(id);
    } else {
      resp = await index.deleteBy({
        facetFilters: [`page.id:${id}`],
      });
    }
    return statusAndMessage(200, resp);
  } catch (err) {
    return statusAndMessage(500, err.message);
  }
};
/* end of create/update/delete */

/* ------------------------------------------------------------ */
exports.handler = async (event, context) => {
  if (!event.body || event.body === '') {
    return statusAndMessage(400, 'No data provided.');
  }

  const response = JSON.parse(event.body);
  const { operation, data } = response;

  if (operation === UNPUBLISH_EVENT) {
    /* determine whether it's page, otherwise it's content source */
    if (data.__typename === PAGE) {
      return removeFromAlgolia(false, data.id);
    } else {
      return removeFromAlgolia(true, data.id);
    }
  } else if (operation === PUBLISH_EVENT) {
    const { PUBLISHED } = data;
    /* sync only entries that don't have 'archived' property or 'archived' is set to false */
    // if (!PUBLISHED.archived) {
    if (PUBLISHED.__typename === PAGE) {
      const { id, pageType } = PUBLISHED;
      /* check if this page classifies for syncing with Algolia */
      if (!acceptedPageTypes.includes(pageType)) {
        return statusAndMessage(422, 'Not eligible for sync.');
      }

      let recordID, queryData, recordData;
      const keywords = {};
      const titles = {};
      const excerpts = {};
      const slugs = {};
      const contentSourceType = SOURCE_TYPES[pageType];
      const hasBrand = sourcesWithBrand.includes(contentSourceType);
      /* gql call to get complete page and source data for sync */
      queryData = await getQueryData(false, id, contentSourceType, hasBrand);
      if (queryData.errors) {
        return statusAndMessage(424, queryData.errors[0].message.toString());
      }
      if (!queryData.data.page[contentSourceType]) {
        return statusAndMessage(424, 'Queried data not available.');
      }
      /* format response to sync with Algolia */
      const {
        data: { page },
      } = queryData;
      page.localizations.forEach(localization => {
        excerpts[`excerpts${localization.locale}`] = localization.excerpt;
        slugs[`slug${localization.locale}`] = localization.slug;
      });
      page[contentSourceType].localizations.forEach(localization => {
        keywords[`keywords${localization.locale}`] = localization.keywords;
        titles[`title${localization.locale}`] = localization.title;
      });
      recordData = {
        ...titles,
        brand: page[contentSourceType].brand,
        ...keywords,
        page: {
          id: page.id,
          availableIn: page.availableIn,
          pageType: page.pageType,
          ...slugs,
          ...excerpts,
        },
        objectID: page[contentSourceType].id,
      };
      return syncToAlgolia(recordData);
    } else if (acceptedSources.includes(PUBLISHED.__typename)) {
      console.log(PUBLISHED.__typename);
      return statusAndMessage(200, 'ok');
    }
    // }
  } else {
    return statusAndMessage(500, 'Unknown operation type or incompatible c.');
  }
  console.log('end');

  /*--------------------------------*/

  /* reject if incoming mutation is not meant to be synced */
  // if (!allObservers.includes(fieldName)) {
  //   return statusAndMessage(422, 'Not eligible for sync.');
  // }

  // let recordID, queryData, recordUpdate;

  /* check if it's a page object that we're receiving */
  // const sourceType = responseData.pageType;
  // if (pageObservers.includes(fieldName)) {
  //   const pageID = responseData.id;
  //   /* check if this page classifies for syncing with Algolia */
  //   if (!acceptedPageTypes.includes(sourceType)) {
  //     return statusAndMessage(422, 'Not eligible for sync.');
  //   }
  //   /* if this is a page deletion, proceed */
  //   if (fieldName === DELETE_PAGE_OBSERVER) {
  //     return removeFromAlgolia(false, pageID);
  //   }

  //   /* proceed with page addition/update */
  //   const contentSourceType = SOURCE_TYPES[PAGE_TYPES[sourceType]];
  //   const hasBrand = sourcesWithBrand.includes(sourceType);
  //   const contentSourceRef = responseData[contentSourceType];
  //   /* check that the appropriate content source was linked */
  //   if (contentSourceRef) {
  //     recordID = contentSourceRef.id;
  //   } else {
  //     if (fieldName === UPDATE_PAGE_OBSERVER) {
  //       /* page update has no source so attempt to remove from Algolia */
  //       return removeFromAlgolia(false, pageID);
  //     } else {
  //       /* page creation has no source so return error */
  //       return statusAndMessage(422, 'Requires content source; not synced.');
  //     }
  //   }

  //   queryData = await getQueryData(true, recordID, contentSourceType, hasBrand);
  //   if (queryData.errors) {
  //     return statusAndMessage(424, queryData.errors[0].message.toString());
  //   }

  //   /* query executes without error; this checks for null result, returning 424 if there is */
  //   if (!queryData.data[contentSourceType]) {
  //     return statusAndMessage(424, 'Queried data not available.');
  //   }

  //   /* should be okay now to prep record to be added/updated */
  //   recordUpdate = {
  //     objectID: recordID,
  //     ...queryData.data[contentSourceType],
  //     page: {
  //       id: pageID,
  //       availableIn: responseData.availableIn,
  //       excerptEN: responseData.excerptEN,
  //       excerptES: responseData.excerptES,
  //       slugEN: responseData.slugEN,
  //       slugES: responseData.slugES,
  //       status: responseData.status,
  //     },
  //   };
  //   return syncToAlgolia(recordUpdate);
  // } else {
  //   /* it's a compatible source object then */
  //   recordID = responseData.id;
  //   /* if deletion or update without linked page, remove from Algolia */
  //   if (
  //     sourceDeletionObservers.includes(fieldName) ||
  //     (sourceUpdateObservers.includes(fieldName) && !responseData.page)
  //   ) {
  //     return removeFromAlgolia(true, recordID);
  //   }

  //   /* if addition without linked page, return error */
  //   if (sourceCreationObservers.includes(fieldName) && !responseData.page) {
  //     return statusAndMessage(422, 'Requires linked page; not synced.');
  //   }

  //   /* proceed to handle addition or update with linked page */
  //   const pageID = responseData.page.id;

  //   /* page exists, retrieve its data from GraphCMS */
  //   queryData = await getQueryData(false, pageID);
  //   if (queryData.errors) {
  //     return statusAndMessage(424, page.errors[0].message.toString());
  //   }
  //   if (!queryData.data.page) {
  //     return statusAndMessage(424, 'Queried data not available.');
  //   }

  //   recordUpdate = {
  //     brand: responseData.brand || null,
  //     keywordsEN: responseData.keywordsEN,
  //     keywordsES: responseData.keywordsES,
  //     titleEN: responseData.titleEN,
  //     titleES: responseData.titleES,
  //     objectID: recordID,
  //     page: queryData.data.page,
  //   };
  //   return syncToAlgolia(recordUpdate);
  // }
};
