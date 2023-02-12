import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

console.log(
  '🚀 ~ file: sendgrid.js:4 ~ process.env.SENDGRID_API_KEY',
  process.env.SENDGRID_API_KEY
);

// sendgrid
//   .send({
//     to: 'helmysmile2@gmail.com',
//     from: 'engmhelmy.1990@gmail.com',
//     subject: 'hello',
//     html: '<h1>test sendgrid mailer</h1>',
//   })
//   .then(() => console.log('email sent'))
//   .catch((err) => console.log(err));

export default sendgrid;
