import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import 'dotenv/config';

/*
  import dotenv/config to get access to process.env variables
  ---
  example of async handler using async-await
  https://github.com/netlify/netlify-lambda/issues/43#issuecomment-444618311
*/

exports.handler = async (event, context, callback) => {
  // Getting visitor's IP address https://stackoverflow.com/a/19524949
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  if (ip) {
    try {
      const url = process.env.IPSTACK_ENDPOINT;
      const params = new URLSearchParams({
        filterByFormula: `({access_key}=${process.env.IPSTACK_TOKEN})`,
      });
      const response = await fetch(`${url}/${ip}?${params}`);
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
      console.log(err); // output to netlify function log
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
      };
    }
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ msg: 'Visitor could not be determined.' }), // Could be a custom message or object i.e. JSON.stringify(err)
  };
};
