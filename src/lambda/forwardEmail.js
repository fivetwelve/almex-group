import 'dotenv/config';
import Mailjet from 'node-mailjet';
import { FORM_TYPES } from '../constants';

const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

exports.handler = (event, context, callback) => {
  /* n.b. destination emails stored in CMS should be in the form of
     an array even if it is a single one */
  const params = JSON.parse(event.body);
  const destinationEmails = [];
  for (let i = 0; i < params.destination.length; i += 1) {
    const email = { Email: params.destination[i] };
    destinationEmails.push(email);
  }
  let request = null;
  console.log(params.contactFormType);
  switch (params.contactFormType) {
    case FORM_TYPES.CONTACT:
      request = mailjet.post('send', { version: 'v3.1' }).request({
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
            HTMLPart: `<h3>A new message has arrived from the Almex website</h3>
              <h3>Subject: ${params.contactSubject}</h3>
              <ul>
              <li>Name: ${params.contactName}</li>
              <li>Email: ${params.contactEmail}</li>
              <li>Phone: ${params.contactPhone}</li>
              <li>Position: ${params.contactPosition}</li>
              <li>Company: ${params.contactCompany}</li>
              <li>Country: ${params.contactCountry}</li>
              </ul>
              <h3>Message:</h3>
              <p>${params.contactMessage}</p>`,
          },
        ],
      });
      break;
    case FORM_TYPES.INSTITUTE:
      request = mailjet.post('send', { version: 'v3.1' }).request({
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
            HTMLPart: `<h3>Subject: ${params.contactSubject}</h3>
              <ul>
              <li>Name: ${params.contactName}</li>
              <li>Email: ${params.contactEmail}</li>
              <li>Phone: ${params.contactPhone}</li>
              <li>Company: ${params.contactCompany}</li>
              <li>Address 1: ${params.contactAddress1}</li>
              <li>Address 2: ${params.contactAddress2}</li>
              <li>City: ${params.contactCity}</li>
              <li>State/Province: ${params.contactStateProvince}</li>
              <li>Country: ${params.contactCountry}</li>
              </ul>
              <h3>Message:</h3>
              <p>${params.contactMessage}</p>`,
          },
        ],
      });
      break;
    default:
      break;
  }
  if (request) {
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
  } else {
    callback('Form type not defined for submission.');
  }
};
