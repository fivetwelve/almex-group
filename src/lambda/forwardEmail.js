// import fetch from 'node-fetch';
import fetch from 'isomorphic-fetch';
import Mailjet from 'node-mailjet';
import 'dotenv/config';
import { FORM_TYPES } from '../constants';

const {
  MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE,
  SITE_RECAPTCHA_SECRET,
  SITE_RECAPTCHA_URL,
} = process.env;
const mailjet = Mailjet.connect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

const sendEmail = (params, callback) => {
  const destinationEmails = [];
  for (let i = 0; i < params.destination.length; i += 1) {
    const email = { Email: params.destination[i] };
    destinationEmails.push(email);
  }
  let request = null;
  // console.log(params.contactFormType);
  // console.log(destinationEmails);
  switch (params.contactFormType) {
    case FORM_TYPES.CONTACT:
      request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'noreply@almex.com',
              /* use the following  to test errors on FE */
              // Email: 'pilot@mailjet.com',
              Name: 'Almex website',
            },
            To: destinationEmails,
            Subject: 'Inquiry from Almex website',
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
              /* use the following  to test errors on FE */
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

exports.handler = (event, context, callback) => {
  /* n.b. destination emails coming in from CMS should be in form of
          array even if it is a single entry */
  const params = JSON.parse(event.body);
  const response = fetch(SITE_RECAPTCHA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${SITE_RECAPTCHA_SECRET}&response=${params.gRecaptchaResponse}`,
  })
    .then(response => response.json())
    .then(json => {
      if (json.success) {
        sendEmail(params, callback);
      } else {
        callback('Recaptcha expired. Please try again later.');
      }
    })
    .catch(err => {
      console.log(err);
      callback(err);
    });
};
