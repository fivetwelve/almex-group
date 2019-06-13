import 'dotenv/config';
import Mailjet from 'node-mailjet';

const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

exports.handler = async (event, context, callback) => {
  const params = JSON.parse(event.body);
  const destinationEmails = [];
  for (let i = 0; i < params.destination.length; i += 1) {
    const email = { Email: params.destination[i] };
    destinationEmails.push(email);
  }

  const request = await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: params.contactEmail,
          Name: params.contactName,
        },
        To: destinationEmails,
        Subject: 'Message from Almex website',
        TextPart: params.contactMessage,
        HTMLPart: `<h3>A new message has been delivered via the Almex website</h3>
        <ul>
        <li>Name: ${params.contactName}</li>
        <li>Email: ${params.contactEmail}</li>
        <li>Position: ${params.contactPosition}</li>
        <li>Company: ${params.contactCompany}</li>
        <li>Phone: ${params.contactPhone}</li>
        <li>Country: ${params.contactCountry}</li>
        </ul>
        <p><b>Message:</b><br/>${params.contactMessage}</p>`,
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
