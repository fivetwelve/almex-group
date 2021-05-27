// import fetch from 'node-fetch';
import fetch from 'isomorphic-fetch';
import algoliasearch from 'algoliasearch';
import 'dotenv/config';
import { PAGE_TYPES, SOURCE_TYPE_NAMES, SOURCE_TYPES } from '../constants';

const {
  ALGOLIA_API_KEY,
  GATSBY_ALGOLIA_INDEX,
  GATSBY_ALGOLIA_APP_ID,
  GATSBY_CMS_ENDPOINT,
  GATSBY_CMS_TOKEN,
} = process.env;
const algolia = algoliasearch(GATSBY_ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const PUBLISH_EVENT = 'publish';
const UNPUBLISH_EVENT = 'unpublish';
const PAGE = 'Page';

/* update acceptedPageTypes and acceptedSources when additional
  types of content sources are to be added to the Algolia index */
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
const sourcesWithBrand = [
  SOURCE_TYPES.INSTITUTE,
  SOURCE_TYPES.LANDING,
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
      query: `{ ${sourceType}(where: {id: \"${id}\"}) { id ${brand} localizations(includeCurrent: true) { locale keywords title } page { id availableIn localizations(includeCurrent: true) { locale excerpt slug } } } }`,
    };
  } else {
    queryData = {
      query: `query { page(where: {id: \"${id}\"}) { id availableIn pageType localizations(includeCurrent: true) { locale excerpt slug } ${sourceType} { id ${brand} localizations(includeCurrent: true) { locale keywords title }}}}`,
    };
  }

  try {
    const response = await fetch(GATSBY_CMS_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GATSBY_CMS_TOKEN}`,
      },
      method: 'POST',
      body: JSON.stringify(queryData),
    });
    const data = await response.json();
    // console.log('data-----');
    // console.log(data);
    if (data.errors) {
      throw data.errors[0];
    }
    return data;
  } catch (err) {
    return { errors: [err] };
  }
};
/* end of retrieve supplemental data */

/* sync supplemental data from GraphCMS */
const syncToAlgolia = async incomingRecord => {
  // console.log('---sync to Algolia');
  try {
    const index = algolia.initIndex(GATSBY_ALGOLIA_INDEX);
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
  const index = algolia.initIndex(GATSBY_ALGOLIA_INDEX);
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
  // console.log('----operation');
  // console.log(operation);
  // console.log('----data');
  // console.log(data);

  if (operation === UNPUBLISH_EVENT) {
    /* determine whether it's page, otherwise it's content source */
    if (data.__typename === PAGE) {
      return removeFromAlgolia(false, data.id);
    } else {
      return removeFromAlgolia(true, data.id);
    }
  } else if (operation === PUBLISH_EVENT) {
    const { id, __typename, ...published } = data;
    /* sync only entries that don't have 'archived' property or 'archived' is set to false */
    if (!published.archived) {
      const keywords = {};
      const titles = {};
      const excerpts = {};
      const slugs = {};
      let hasBrand, queryData, recordData, contentSourceType;

      if (__typename === PAGE && acceptedPageTypes.includes(published.pageType)) {
        /* scenario 1: Page is published */
        contentSourceType = SOURCE_TYPES[published.pageType];
        hasBrand = sourcesWithBrand.includes(contentSourceType);
        queryData = await getQueryData(false, id, contentSourceType, hasBrand);
        if (queryData.errors) {
          return statusAndMessage(424, queryData.errors[0].message.toString());
        }
        // console.log(queryData.data);
        if (queryData.data.page[contentSourceType]) {
          /* associated content source exists so create record to sync to Algolia */
          const {
            data: { page },
          } = queryData;
          page.localizations.forEach(localization => {
            excerpts[`excerpt${localization.locale}`] = localization.excerpt || null;
            slugs[`slug${localization.locale}`] = localization.slug;
          });
          page[contentSourceType].localizations.forEach(localization => {
            keywords[`keywords${localization.locale}`] = localization.keywords || null;
            titles[`title${localization.locale}`] = localization.title;
          });
          recordData = {
            ...titles,
            brand: page[contentSourceType].brand || null,
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
        } else {
          /* associated content source has not been published so reject */
          return statusAndMessage(424, 'Queried data not available.');
        }
      } else if (acceptedSources.includes(__typename)) {
        /* scenario 2: Content Source is published */
        contentSourceType = __typename.substring(0, 1).toLowerCase() + __typename.substring(1);
        hasBrand = sourcesWithBrand.includes(contentSourceType);

        queryData = await getQueryData(true, id, contentSourceType, hasBrand);
        if (queryData.errors) {
          return statusAndMessage(424, queryData.errors[0].message.toString());
        }
        // console.log(queryData.data);
        if (queryData.data[contentSourceType].page) {
          /* associated page exists so create record to sync to Algolia */
          const { data } = queryData;
          const contentSource = data[contentSourceType];
          // console.log('contentSource------');
          // console.log(contentSource);
          contentSource.page.localizations.forEach(localization => {
            excerpts[`excerpt${localization.locale}`] = localization.excerpt || null;
            slugs[`slug${localization.locale}`] = localization.slug;
          });
          contentSource.localizations.forEach(localization => {
            keywords[`keywords${localization.locale}`] = localization.keywords || null;
            titles[`title${localization.locale}`] = localization.title;
          });
          recordData = {
            ...titles,
            brand: contentSource.brand || null,
            ...keywords,
            page: {
              id: contentSource.page.id,
              availableIn: contentSource.page.availableIn,
              pageType: contentSource.page.pageType,
              ...slugs,
              ...excerpts,
            },
            objectID: contentSource.id,
          };
          return syncToAlgolia(recordData);
        } else {
          /* associated page has not been published */
          return statusAndMessage(424, 'Queried data not available.');
        }
      } else {
        return statusAndMessage(422, 'Not eligible for sync.');
      }
    }
  } else {
    return statusAndMessage(500, 'Unknown operation type.');
  }
};
