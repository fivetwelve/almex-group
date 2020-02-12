import fetch from 'node-fetch';
import algoliasearch from 'algoliasearch';
import 'dotenv/config';
import { PAGE_TYPES, SOURCE_TYPES } from '../constants';

const { ALGOLIA_API_KEY, GATSBY_ALGOLIA_APP_ID, CMS_ENDPOINT, CMS_TOKEN } = process.env;
const algolia = algoliasearch(GATSBY_ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const INDEX_NAME = 'CMS';

const CREATE_ABOUT_OBSERVER = 'createAboutSource';
const UPDATE_ABOUT_OBSERVER = 'updateAboutSource';
const DELETE_ABOUT_OBSERVER = 'deleteAboutSource';
const DELETE_MULTIPLE_ABOUT_OBSERVER = 'deleteManyAboutSource';
const CREATE_PAGE_OBSERVER = 'createPage';
const UPDATE_PAGE_OBSERVER = 'updatePage';
const DELETE_PAGE_OBSERVER = 'deletePage';
const DELETE_MULTIPLE_PAGE_OBSERVER = 'deleteManyPage';
const CREATE_PRODUCT_OBSERVER = 'createProductSource';
const UPDATE_PRODUCT_OBSERVER = 'updateProductSource';
const DELETE_PRODUCT_OBSERVER = 'deleteProductSource';
const DELETE_MULTIPLE_PRODUCT_OBSERVER = 'deleteManyProductSource';
const CREATE_PROMO_OBSERVER = 'createPromoSource';
const UPDATE_PROMO_OBSERVER = 'updatePromoSource';
const DELETE_PROMO_OBSERVER = 'deletePromoSource';
const DELETE_MULTIPLE_PROMO_OBSERVER = 'deleteManyPromoSource';
const CREATE_SERVICES_OBSERVER = 'createServicesSource';
const UPDATE_SERVICES_OBSERVER = 'updateServicesSource';
const DELETE_SERVICES_OBSERVER = 'deleteServicesSource';
const DELETE_MULTIPLE_SERVICES_OBSERVER = 'deleteManyServicesSource';
const CREATE_SIMPLE_OBSERVER = 'createSimpleSource';
const UPDATE_SIMPLE_OBSERVER = 'updateSimpleSource';
const DELETE_SIMPLE_OBSERVER = 'deleteSimpleSource';
const DELETE_MULTIPLE_SIMPLE_OBSERVER = 'deleteManySimpleSource';

const deleteManyObservers = [
  DELETE_MULTIPLE_ABOUT_OBSERVER,
  DELETE_MULTIPLE_PAGE_OBSERVER,
  DELETE_MULTIPLE_PRODUCT_OBSERVER,
  DELETE_MULTIPLE_PROMO_OBSERVER,
  DELETE_MULTIPLE_SERVICES_OBSERVER,
  DELETE_MULTIPLE_SIMPLE_OBSERVER,
];

/* update acceptedPageTypes and associated Observors if/when
   new content source types need to be indexed on Algolia */
const acceptedPageTypes = [
  PAGE_TYPES.ABOUT,
  PAGE_TYPES.PRODUCT,
  PAGE_TYPES.PROMO,
  PAGE_TYPES.SERVICES,
  PAGE_TYPES.SIMPLE,
];

const pageObservers = [CREATE_PAGE_OBSERVER, UPDATE_PAGE_OBSERVER, DELETE_PAGE_OBSERVER];
const sourceCreationObservers = [
  CREATE_ABOUT_OBSERVER,
  CREATE_PRODUCT_OBSERVER,
  CREATE_PROMO_OBSERVER,
  CREATE_SERVICES_OBSERVER,
  CREATE_SIMPLE_OBSERVER,
];
const sourceUpdateObservers = [
  UPDATE_ABOUT_OBSERVER,
  UPDATE_PRODUCT_OBSERVER,
  UPDATE_PROMO_OBSERVER,
  UPDATE_SERVICES_OBSERVER,
  UPDATE_SIMPLE_OBSERVER,
];
const sourceDeletionObservers = [
  DELETE_ABOUT_OBSERVER,
  DELETE_PRODUCT_OBSERVER,
  DELETE_PROMO_OBSERVER,
  DELETE_SERVICES_OBSERVER,
  DELETE_SIMPLE_OBSERVER,
];

const allObservers = [
  ...pageObservers,
  ...sourceCreationObservers,
  ...sourceUpdateObservers,
  ...sourceDeletionObservers,
];

const statusAndMessage = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});

const getQueryData = async (isSource, id, sourceType = '') => {
  let queryData;
  if (isSource) {
    queryData = {
      query: `query {${sourceType} (where: {id: \"${id}\"}) {brand keywordsEN: keywords(locale: EN) keywordsES: keywords(locale: ES) titleEN: title(locale: EN) titleES: title(locale: ES)}}`,
    };
  } else {
    queryData = {
      query: `query {page (where: {id: \"${id}\"}) {id availableIn excerptEN: excerpt(locale: EN) excerptES: excerpt(locale: ES) slugEN: slug(locale: EN) slugES: slug(locale: ES) status}}`,
    };
  }

  try {
    const response = await fetch(CMS_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: CMS_TOKEN,
      },
      method: 'POST',
      body: JSON.stringify(queryData),
    });
    if (!response.ok) {
      /* DON'T USE res.status >= 200 && res.status < 300 */
      throw error;
    }
    const data = await response.json();
    if (data.errors) {
      throw data.errors[0];
    }
    return data;
  } catch (err) {
    return { errors: [err] };
  }
};

/* create/update/delete from Algolia */
const syncToAlgolia = async incomingRecord => {
  try {
    const index = algolia.initIndex(INDEX_NAME);
    const record = await index.saveObject(incomingRecord);
    return statusAndMessage(200, record);
  } catch (err) {
    return statusAndMessage(500, err.message);
  }
};

const removeFromAlgolia = async (isSource, id) => {
  /* n.b. in Algolia page.id must be a facetFilter, otherwise deletion using it would not work */
  let resp;
  try {
    const index = algolia.initIndex(INDEX_NAME);
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
  const {
    info: {
      args: { data },
      fieldName,
      responseData,
    },
  } = response;

  /* reject if incoming mutation is not meant to be synced */
  if (!allObservers.includes(fieldName)) {
    return statusAndMessage(422, 'Not eligible for sync.');
  }

  let recordID, queryData, recordUpdate;

  /* check if it's a page object that we're receiving */
  const sourceType = responseData.pageType;
  if (pageObservers.includes(fieldName)) {
    const pageID = responseData.id;
    /* check if this page classifies for syncing with Algolia */
    if (!acceptedPageTypes.includes(sourceType)) {
      return statusAndMessage(422, 'Not eligible for sync.');
    }
    /* if this is a page deletion, proceed */
    if (fieldName === DELETE_PAGE_OBSERVER) {
      return removeFromAlgolia(false, pageID);
    }

    /* proceed with page addition/update */
    const contentSourceType = SOURCE_TYPES[PAGE_TYPES[sourceType]];
    const contentSourceRef = responseData[contentSourceType];
    /* check that the appropriate content source was linked */
    if (contentSourceRef) {
      recordID = contentSourceRef.id;
    } else {
      if (fieldName === UPDATE_PAGE_OBSERVER) {
        /* page update has no source so attempt to remove from Algolia */
        return removeFromAlgolia(false, pageID);
      } else {
        /* page creation has no source so return error */
        return statusAndMessage(422, 'Requires content source; not synced.');
      }
    }

    queryData = await getQueryData(true, recordID, contentSourceType);
    if (queryData.errors) {
      return statusAndMessage(424, queryData.errors[0].message.toString());
    }

    /* query executes without error; this checks for null result, returning 424 if there is */
    if (!queryData.data[contentSourceType]) {
      return statusAndMessage(424, 'Queried data not available.');
    }

    /* should be okay now to prep record to be added/updated */
    recordUpdate = {
      objectID: recordID,
      ...queryData.data[contentSourceType],
      page: {
        id: pageID,
        availableIn: responseData.availableIn,
        excerptEN: responseData.excerptEN,
        excerptES: responseData.excerptES,
        slugEN: responseData.slugEN,
        slugES: responseData.slugES,
        status: responseData.status,
      },
    };
    return syncToAlgolia(recordUpdate);
  } else {
    /* it's a compatible source object then */
    recordID = responseData.id;
    /* if deletion or update without linked page, remove from Algolia */
    if (
      sourceDeletionObservers.includes(fieldName) ||
      (sourceUpdateObservers.includes(fieldName) && !responseData.page)
    ) {
      return removeFromAlgolia(true, recordID);
    }

    /* if addition without linked page, return error */
    if (sourceCreationObservers.includes(fieldName) && !responseData.page) {
      return statusAndMessage(422, 'Requires linked page; not synced.');
    }

    /* proceed to handle addition or update with linked page */
    const pageID = responseData.page.id;

    /* page exists, retrieve its data from GraphCMS */
    queryData = await getQueryData(false, pageID);
    if (queryData.errors) {
      return statusAndMessage(424, page.errors[0].message.toString());
    }
    if (!queryData.data.page) {
      return statusAndMessage(424, 'Queried data not available.');
    }

    recordUpdate = {
      brand: responseData.brand,
      keywordsEN: responseData.keywordsEN,
      keywordsES: responseData.keywordsES,
      titleEN: responseData.titleEN,
      titleES: responseData.titleES,
      objectID: recordID,
      page: queryData.data.page,
    };
    return syncToAlgolia(recordUpdate);
  }
};
