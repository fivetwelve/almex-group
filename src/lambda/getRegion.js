import fetch from 'cross-fetch';
import 'dotenv/config';

const ipapiKey = process.env.IPAPI_APIKEY_PRIVATE;

const statusAndMessage = (statusCode, message) => ({
  statusCode,
  body: JSON.stringify({
    message,
  }),
});

exports.handler = async event => {
  try {
    /* Typically the header used ought to be `client-id` but Netlify uses
       `x-nf-client-connection-ip`; other providers may use their own variant as well */

    const response = await fetch(
      `https://ipapi.co/${event.headers['x-nf-client-connection-ip']}/json/?key=${ipapiKey}`,
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
