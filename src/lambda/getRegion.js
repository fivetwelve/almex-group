// import fetch from 'node-fetch';
import fetch from 'isomorphic-fetch';
import loggly from 'node-loggly-bulk';
import 'dotenv/config';

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

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    console.log('ipapi invalid http status');
    callback('ipapi invalid http status');
  }
}

exports.handler = async (event, context, callback) => {
  logClient.log(event);
  // console.log('event');
  // console.log(event);
  // console.log('context');
  // console.log(context);
  // const params = JSON.parse(event.body);
  const response = fetch(`https://ipapi.co/${event.headers['client-ip']}/json/?key=${ipapiKey}`, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then(checkStatus)
    .then(response => response.json())
    .then(json => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(json),
      });
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
