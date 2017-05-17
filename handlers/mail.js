const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //inlines CSS
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  //console.log(html);
  const inlined = juice(html);
  return inlined;
}

exports.send = async (options) => {
  //console.log(options);
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);

  const mailOptions = {
    from: `Admin <noreply@dangdelicious.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
}
