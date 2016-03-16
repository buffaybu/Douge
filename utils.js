'use strict';

const dateFormat = require('dateformat');
const nodemailer = require('nodemailer');
const config = require('./config.js');

// *** email setting ***
const transporter = nodemailer.createTransport(config.smtp);
transporter.verify((err) => {
  if (err) {
    _.log('Email setting error:', err);
    process.exit(1);
  }
});

const _ = {
  
  /**
   * @param {string[, string...]}
   */
  log: (...logs) => {
    let msg = '[' + dateFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') + ']';
    for (let i = 0; i < logs.length; i++) {
      msg += ' ';
      msg += typeof logs[i] == 'object' ? JSON.stringify(logs[i]) : logs[i];
    }
    return console.log(msg);
  },
  
  /**
   * @param {Object} topics
   * @param {string} topics.id
   * @param {string} topics.title
   */
  parseAlertHtml: (topics) => topics.map(
    topic =>
      '<a href="https://www.douban.com/group/topic/#/"><p>$</p></a>'
        .replace('#', topic.id)
        .replace('$', topic.title)
  ).join(''),
  
  /**
   * https://github.com/nodemailer/nodemailer#tldr-usage-example)
   * @param  {Object} obj nodemailer's mailOptions   
   */
  sendMail: (obj) => {
    const mail = Object.assign({
      from: config.from,
      to: config.to,
      subject: 'A mail from Douge',
      text: 'Something happened in Douge'
    }, obj);
    
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        _.log('Mail sending error:', err);
      } else {
        _.log('Mail sent:', info);
      }
    });
  }
  
};

module.exports = _;
