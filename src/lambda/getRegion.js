// import fetch from 'node-fetch';
// import fetch from 'isomorphic-fetch';
import fetch from 'cross-fetch';
import loggly from 'node-loggly-bulk';
import 'dotenv/config';
// import { statusAndMessage } from '../utils/functions';

const ipapiKey = process.env.IPAPI_APIKEY_PRIVATE;
const logClient = loggly.createClient({
  token: 'b81b81cb-9289-45c9-bd10-51b22f7b0912',
  subdomain: 'almex',
  auth: {
    username: 'victor-almex@fivetwelve.ca',
    password: 'stack-trace-1',
  },
  json: true,
});

const statusAndMessage = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});

exports.handler = async (event, context) => {
  // console.log(event);
  // logClient.log(event);
  // console.log('event');
  // console.log(event);
  // console.log('context');
  // console.log(context);
  // const params = JSON.parse(event.body);
  // const response = fetch(`https://ipapi.co/${event.headers['client-ip']}/json/?key=${ipapiKey}`, {
  //   headers: {
  //     Accept: 'application/json',
  //   },
  // })
  //   // .then(checkStatus)
  //   .then(response => {
  //     console.log('response');
  //     console.log(response);
  //     return response.json();
  //   })
  //   .then(json => {
  //     callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify(json),
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     callback(err);
  //   });
  logClient.log('headers');
  logClient.log(event.headers);
  // console.log(event.headers);
  // const ipUrl =
  //   'https://ipapi.co/100.95.205.137/json?key=BLRECfgA94TXYoSTuB0iz7mdRHkIBYqwJQ8UKC7BpKKZoldhST';

  try {
    /* Typically the header used ought to be `client-id` but Netlify uses
       `x-nf-client-connection-ip`; other providers may use their own variant as well */

    const response = await fetch(
      `https://ipapi.co/${event.headers['x-nf-client-connection-ip']}/json/?key=${ipapiKey}`,
      // ipUrl,
      {
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      },
    );
    const data = await response.json();

    if (data.error) {
      return statusAndMessage(500, data);
    }
    return statusAndMessage(200, data);
  } catch (err) {
    return statusAndMessage(500, err);
  }
};
