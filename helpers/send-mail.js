const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function sendMail(email,link){
const msg = {
  to: email, // Change to your recipient
  from: process.env.SENDGRID_FROM_ADDRESS, // Change to your verified sender
  subject: 'Reset password',
  text:link

}
sgMail
  .send(msg)
  .then(() => {
  
  })
  .catch((error) => {
    console.error(error)
  })
};
module.exports = sendMail;
