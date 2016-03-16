'use strict';

const request = require('request');
const _ = require('./utils');

const config = require('./config.js');

let ids = []
  , lastTimestamp = Date.now();

function doJob() {
  
  // request error lasted for over an hour
  if (Date.now() - lastTimestamp > 60 * 60 * 1000) { 
    _.sendMail({
      subject: 'Request error lasted for over an hour',
      text: ''
    });
  }
    
  request({url: config.url, headers: {'User-Agent': 'request'}}, (err, res, body) => {
    if (err) {
      return _.log(err);
    }
    
    lastTimestamp = Date.now();
    
    let reResult;
    let topics = [];
    while ((reResult = config.re.exec(body)) !== null) {
      if (ids.indexOf(reResult[1]) < 0) {
        topics.push({id: reResult[1], title: reResult[2]});
        ids.push(reResult[1]);
      }
    }
    
    if (topics.length) {
      _.sendMail({
        subject: 'Alert(#):'.replace('#', topics.length) + topics[0].title,
        html: _.parseAlertHtml(topics)
      });
    }
  });
  
  return doJob;
}

setInterval(doJob(), config.interval);
