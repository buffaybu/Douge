'use strict'

const request = require('request');

const nodemailer = require('nodemailer');
const config = require('./config.js');
const transporter = nodemailer.createTransport(config.smtp);
transporter.verify(function(err, success) {
  if (err) {
    console.log(err);
  } else {
    console.log('yes');
  }
});

const interval = 60 * 1000;

let record = []
  , lastTime = Date.now();

const url = config.groupUrl;
const re = new RegExp('href="https:\/\/www\\.douban\\.com\/group\/topic\/(\\d*)\/" title="([^"]*' + config.keyword + '[^"]*)"', 'g');
console.log(re)
function doJob() {
  
  if (Date.now() - lastTime > 60 * 60 * 1000) { // request error lasted for over 1 hour
    const mail = {
      from: config.from,
      to: config.to,
      subject: 'douban-alert\'s request error lasted for over 1 hour',
      text: ''
    };
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.log('Mail sending error:', err);
        console.log(JSON.stringify(mail));
      } else {
        console.log('Message sent: ' + JSON.stringify(info));
      }
    });
  }
    
  request({url: url, headers: {'User-Agent': 'request'}}, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    
    lastTime = Date.now();
    
    let result;
    let topics = [];
    while ((result = re.exec(body)) !== null) {
      if (record.indexOf(result[1]) < 0) {
        topics.push({id: result[1], title: result[2]});
        record.push(result[1]);
      }
    }
    console.log(topics);
    
    if (topics.length) {
      const mail = {
        from: config.from,
        to: config.to,
        subject: 'Alert(#):'.replace('#', topics.length) + topics[0].title,
        html: parseMail(topics)
      };
      console.log(mail);
      transporter.sendMail(mail, (err, info) => {
        if (err) {
          console.log('Mail sending error:', err);
          console.log(JSON.stringify(mail));
        } else {
          console.log('Message sent: ' + JSON.stringify(info));
        }
      });
    }
  });
  
  return doJob;
}

function parseMail(topics) {
  return topics.map((topic) => {
    return '<a href="https://www.douban.com/group/topic/#/"><p>$</p></a>'
      .replace('#', topic.id)
      .replace('$', topic.title)
  }).join('');
}

setInterval(doJob(), interval);
