import fetch from 'cross-fetch';
import algoliasearch from 'algoliasearch';
import 'dotenv/config';
import { SOURCE_TYPE_SIMPLE_NAMES } from '../constants';

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

/* update acceptedSources when additional types of content sources
   are to be added to the Algolia index */
/* before accepting a new source, ensure that its Model in the CMS
   has a Keywords property */
const acceptedSources = [
  SOURCE_TYPE_SIMPLE_NAMES.ABOUT,
  SOURCE_TYPE_SIMPLE_NAMES.PRODUCT,
  SOURCE_TYPE_SIMPLE_NAMES.PROMO,
  SOURCE_TYPE_SIMPLE_NAMES.SERVICES,
  SOURCE_TYPE_SIMPLE_NAMES.SIMPLE,
  SOURCE_TYPE_SIMPLE_NAMES.INSTITUTE,
];
const sourcesWithBrand = [
  SOURCE_TYPE_SIMPLE_NAMES.INSTITUTE,
  SOURCE_TYPE_SIMPLE_NAMES.LANDING,
  SOURCE_TYPE_SIMPLE_NAMES.PRODUCT,
  SOURCE_TYPE_SIMPLE_NAMES.PROMO,
  SOURCE_TYPE_SIMPLE_NAMES.SERVICES,
  SOURCE_TYPE_SIMPLE_NAMES.SIMPLE,
];

const statusAndMessage = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});

const getSourceType = contentSource => {
  return contentSource.charAt(0).toLowerCase() + contentSource.slice(1);
};

/* retrieve related data from GraphCMS */
const getQueryData = async (isSource, id, hasBrand, sourceType = '') => {
  const brand = hasBrand ? 'brand' : '';
  let queryData;
  if (isSource) {
    /* retrieving associated contentSource data */
    queryData = {
      query: `{ contentSource:${sourceType}(where: {id: \"${id}\"}) { id ${brand} localizations(includeCurrent: true) { locale keywords title }}}`,
    };
  } else {
    /* retrieving associated page data */
    queryData = {
      query: `query { page(where: {id: \"${id}\"}) { id availableIn localizations(includeCurrent: true) { locale excerpt slug }}}`,
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
  try {
    const index = algolia.initIndex(GATSBY_ALGOLIA_INDEX);
    const record = await index.saveObject(incomingRecord);
    return statusAndMessage(200, record);
  } catch (err) {
    return statusAndMessage(500, err.message);
  }
};

const removeFromAlgolia = async id => {
  /* n.b. in Algolia to delete by page.id we must use a facetFilter, otherwise it would not work */
  /* update: now using contentSource so we have access to the object ID without the previous hassle */
  const index = algolia.initIndex(GATSBY_ALGOLIA_INDEX);
  try {
    const resp = await index.deleteObject(id);
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
      return removeFromAlgolia(data.contentSource.id);
    } else if (acceptedSources.includes(__typename)) {
      return removeFromAlgolia(data.id);
    } else {
      return statusAndMessage(422, 'Not eligible for sync.');
    }
  } else if (operation === PUBLISH_EVENT) {
    const keywords = {};
    const titles = {};
    const excerpts = {};
    const slugs = {};
    let hasBrand, queryData, recordData;

    if (data.__typename === PAGE) {
      /* page was published */
      const { id, __typename, contentSource, ...page } = data;
      if (contentSource && acceptedSources.includes(contentSource.__typename)) {
        /* page is published and its associated content source is linked so let's
            retrieve content source data */
        hasBrand = sourcesWithBrand.includes(contentSource);
        /* get associated contentSource data */
        queryData = await getQueryData(
          true,
          contentSource.id,
          hasBrand,
          getSourceType(contentSource.__typename),
        );
        if (queryData.errors) {
          // console.log(queryData.errors[0]);
          return statusAndMessage(424, queryData.errors[0].message.toString());
        } else {
          /* sync all the data back to Algolia */
          const contentSourceData = queryData.data.contentSource;
          page.localizations.forEach(localization => {
            excerpts[`excerpt${localization.locale}`] = localization.excerpt || null;
            slugs[`slug${localization.locale}`] = localization.slug;
          });
          contentSourceData.localizations.forEach(localization => {
            keywords[`keywords${localization.locale}`] = localization.keywords || null;
            titles[`title${localization.locale}`] = localization.title;
          });
          recordData = {
            brand: contentSourceData.brand || null,
            objectID: contentSource.id,
            ...keywords,
            ...titles,
            page: {
              availableIn: page.availableIn,
              id,
              ...excerpts,
              ...slugs,
            },
          };
          return syncToAlgolia(recordData);
        }
      }
    } else if (acceptedSources.includes(data.__typename)) {
      /* contentSource was published */
      const { id, __typename, refPage, ...contentSource } = data;
      if (refPage) {
        /* suitable content source is published and has a refPage so let's retrieve
           the associated page data */
        hasBrand = sourcesWithBrand.includes(__typename);
        /* get associated page data */
        queryData = await getQueryData(false, refPage.id, hasBrand);
        if (queryData.errors) {
          // console.log(queryData.errors[0]);
          return statusAndMessage(424, queryData.errors[0].message.toString());
        } else {
          const { page } = queryData.data;
          page.localizations.forEach(localization => {
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
              id: refPage.id,
              availableIn: page.availableIn,
              ...slugs,
              ...excerpts,
            },
            objectID: id,
          };
          return syncToAlgolia(recordData);
        }
      }
    }
    /* published object is not a page linked to accepted content source (or vice-versa)
       so we'll reject */
    return statusAndMessage(422, 'Not eligible for sync.');
  } else {
    /* not a publish/unpublish event so reject */
    return statusAndMessage(500, 'Unknown operation type.');
  }
};
