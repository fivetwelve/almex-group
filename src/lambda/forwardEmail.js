import 'dotenv/config';
import Mailjet from 'node-mailjet';

const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

exports.handler = async (event, context, callback) => {
  // try {

  // } catch (err) {

  // }
  console.log('-------event');
  console.log(event);
  console.log('-------context');
  console.log(context);
  const request = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          // Email: 'victor.chan@almex.com',
          Email: 'pilot@mailjet.com',
          Name: 'Mailjet Pilot',
        },
        To: [
          {
            Email: 'hello@fivetwelve.ca',
            Name: 'passenger 1',
          },
        ],
        Subject: 'Your email flight plan!',
        TextPart: 'Dear passenger 1, welcome to Mailjet! May the delivery force be with you!',
        HTMLPart:
          '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
      },
    ],
  });
  request
    .then(result => {
      // console.log(result);
      // console.log(result.body);
      // console.log(result.body.json());
      // return { statusCode: 500, body: JSON.stringify({ msg: result.body }) };
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ msg: result }),
      });
    })
    .catch(err => {
      // console.log(err);
      // console.log(err.statusCode);
      // return { statusCode: 500, body: JSON.stringify({ msg: err.errorMessage }) };
      // callback(null, {
      //   statusCode: err.statusCode,
      //   body: JSON.stringify({ msg: err }),
      // });
      callback(err);
    });
};
