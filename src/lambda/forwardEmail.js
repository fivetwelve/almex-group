import 'dotenv/config';
import Mailjet from 'node-mailjet';

const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

exports.handler = (event, context, callback) => {
  const params = JSON.parse(event.body);
  const destinationEmails = [];
  for (let i = 0; i < params.destination.length; i += 1) {
    const email = { Email: params.destination[i] };
    destinationEmails.push(email);
  }
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'info@almex.com',
          /* use the following for testing errors on FE */
          // Email: 'pilot@mailjet.com',
          Name: 'Almex website',
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
        <h3>${params.contactSubject}</h3>
        <p><b>Message:</b><br/>${params.contactMessage}</p>`,
      },
    ],
  });

  request
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(res.body),
      });
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
