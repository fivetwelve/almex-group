// example of async handler using async-await
// https://github.com/netlify/netlify-lambda/issues/43#issuecomment-444618311

import fetch from 'node-fetch';
import * as log from 'loglevel';

// eslint-disable-next-line no-unused-vars
exports.handler = async (event, context, callback) => {
  try {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Netlify GoTrue (https://github.com/netlify/gotrue-js)',
      },
    });
    if (!response.ok) {
      /* NOT res.status >= 200 && res.status < 300 */
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: data.joke }),
    };
  } catch (err) {
    log.error(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
