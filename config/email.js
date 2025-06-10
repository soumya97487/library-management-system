// config/email.js
const nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
if (hbs.default) hbs = hbs.default
const path = require('path');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',                                    
      layoutsDir: path.join(__dirname, '../views/emails'), 
      defaultLayout: false
    },
    viewPath: path.join(__dirname, '../views/emails'),    
    extName: '.hbs'                                      
  })
);

module.exports = transport;
