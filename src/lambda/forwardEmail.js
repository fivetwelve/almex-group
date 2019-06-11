import 'dotenv/config';
import Mailjet from 'node-mailjet';

const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

exports.handler = (event, context, callback) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'victor.chan@almex.com',
          // Email: 'pilot@mailjet.com',
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
      console.log(result.body);
      console.log(result.body.json());
      return { statusCode: 500, body: JSON.stringify({ msg: result.body }) };
    })
    .catch(err => {
      // console.log(err);
      console.log(err.statusCode);
      return { statusCode: 500, body: JSON.stringify({ msg: err.errorMessage }) };
    });
};
