import fetch from 'node-fetch';
import 'dotenv/config';

const ipapiKey = process.env.IPAPI_APIKEY_PRIVATE;

function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    console.log('ipapi invalid http status');
    callback('ipapi invalid http status');
  }
}

exports.handler = (event, context, callback) => {
  const params = JSON.parse(event.body);
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
