import Mailjet from 'node-mailjet';

exports.handler = async (event, context, callback) => {
  // your server-side functionality
  try {
    const mailjet = Mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
    const request = await mailjet.post('send').request({
      FromEmail: 'pilot@mailjet.com',
      FromName: 'Mailjet Pilot',
      Subject: 'Your email flight plan!',
      'Text-part': 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
      'Html-part':
        '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
      Recipients: [{ Email: 'victor.chan@almex.com' }],
    });
    request
      .then(result => {
        console.log(result.body);
        return {
          statusCode: 200,
          body: result.body,
        };
      })
      .catch(err => {
        console.log(err.statusCode);
        return {
          statusCode: 500,
          body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
        };
      });
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
