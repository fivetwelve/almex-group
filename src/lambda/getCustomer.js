import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import 'dotenv/config';
import * as log from 'loglevel';

/*
  example of async handler using async-await
  https://github.com/netlify/netlify-lambda/issues/43#issuecomment-444618311
*/

// const config = dotenv.config({
//   path: `.env.${process.env.NODE_ENV}`,
// }).parsed;

exports.handler = async (event, context, callback) => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`AIRTABLE_ENDPOINT: ${process.env.AIRTABLE_ENDPOINT}`);
  console.log(`AIRTABLE_TOKEN: ${process.env.AIRTABLE_TOKEN}`);
  console.log(`CMS_ENDPOINT: ${process.env.CMS_ENDPOINT}`);
  console.log(`CMS_TOKEN: ${process.env.CMS_TOKEN}`);

  try {
    const url = process.env.AIRTABLE_ENDPOINT;
    const params = new URLSearchParams({
      filterByFormula: `({Email}="maggie@companyxyz.com")`,
    });
    const response = await fetch(`${url}?${params}`, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      },
    });
    if (!response.ok) {
      /* NOT res.status >= 200 && res.status < 300 */
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: data }),
    };
  } catch (err) {
    log.error(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
