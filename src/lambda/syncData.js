/* eslint-disable */
import fetch from 'node-fetch';
import algoliasearch from 'algoliasearch';
import 'dotenv/config';

const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, CMS_ENDPOINT, CMS_TOKEN } = process.env;
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
const INDEX_NAME = 'CMS';

const cmsUrl = 'https://api-useast.graphcms.com/v1/cjp38sm4l76js01dg55spmgn6/master';
let fetchData;

const createPageObserver = 'createPage';
const updatePageObserver = 'updatePage';
const deletePageObserver = 'deletePage';
const createProductObserver = 'createProductSource';
const updateProductObserver = 'updateProductSource';
const deleteProductObserver = 'deleteProductSource';

const creationObservers = [createPageObserver, createProductObserver];
const updateObservers = [updatePageObserver, updateProductObserver];
const deletionObservers = [deletePageObserver, deleteProductObserver];

const getPage = async pageID => {
  const pageData = {
    // query: `query {\n  page (where: {id: \"${pageID}\"}) {\n    availableIn\n    status\n    tile {\n      url\n    }\n    slugEN: slug(locale: EN)\n    slugES: slug(locale: ES)\n  }\n}`,
    query: `query {page (where: {id: \"${pageID}\"}) {availableIn status tile {url} slugEN: slug(locale: EN) slugES: slug(locale: ES)}}`,
  };

  try {
    const response = await fetch(CMS_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: CMS_TOKEN,
      },
      method: 'POST',
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      /* NOT res.status >= 200 && res.status < 300 */
      console.log('err1 ------');
      console.log(response); // output to netlify function log
      // return { statusCode: response.status, body: response.statusText };
      return null;
    }

    const data = await response.json();
    console.log('response ------');
    console.log(data);
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ msg: data }),
    // };
    return data;
  } catch (err) {
    console.log('err2 ------');
    console.log(err); // output to netlify function log
    // return {
    //   statusCode: 500,
    //   body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err) };
    // };
    return null;
  }
};

exports.handler = async (event, context) => {
  console.log(' ');
  console.log('---+---+---+---+---');
  console.log(' ');

  const response = JSON.parse(event.body);
  const {
    info: { fieldName, responseData },
  } = response;
  const pageID = responseData.page.id;

  /* reject if the incoming mutation is not meant to be synced */
  if (
    !creationObservers.includes(fieldName) &&
    !updateObservers.includes(fieldName) &&
    !deletionObservers.includes(fieldName)
  ) {
    console.log('---------422');
    return { statusCode: 422 };
  }

  /* use this try-catch for pages */
  if (![createPageObserver, updatePageObserver, deletePageObserver].includes(fieldName)) {
    // try {
    // } catch (err) {}
  }

  /* use this try-catch for content */
  try {
    const index = algolia.initIndex(INDEX_NAME);
    const pageResponse = await getPage(pageID);
    console.log('---page start---');
    console.log(pageResponse);
    console.log('---page end---');
    let body;

    if (deletionObservers.includes(fieldName)) {
      body = await index.deleteObject(responseData.id);
      console.log('---------202');
      console.log(body);
      return { statusCode: 202, body: JSON.stringify(body) };
    }

    if (pageResponse) {
      const {
        data: {
          page: { status, ...rest },
        },
      } = pageResponse;
      const {
        id: objectID,
        category,
        keywordsEN,
        keywordsES,
        marketingEN,
        marketingES,
        titleEN,
        titleES,
        updatedAt,
        ...rest
      } = responseData;
      const indexable = {
        objectID,
        category,
        keywordsEN,
        keywordsES,
        marketingEN,
        marketingES,
        titleEN,
        titleES,
        updatedAt,
        status,
        page: {
          ...rest,
        },
      };

      if (creationObservers.includes(fieldName)) {
        body = await index.addObject(indexable);
      } else if (updateObservers.includes(fieldName)) {
        body = await index.saveObject(indexable);
      } else {
        console.log('---------error');
        throw new Error(`${fieldName} could not be processed.`);
      }
    } else {
      throw new Error('Page information does not exist');
    }

    // res.status(200).send(body);
    console.log('---------200 OK!');
    console.log(body);
    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (err) {
    // res.status(500).json({ errors: [err.message] });
    console.log('---------500');
    console.log(JSON.stringify({ errors: [err.message] }));
    return {
      statusCode: 500,
      body: JSON.stringify({ errors: [err.message] }),
    };
  }
};
