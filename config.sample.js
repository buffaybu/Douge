module.exports = {
  // https://github.com/nodemailer/nodemailer-wellknown/blob/master/services.json
  smtp: {
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    auth: {
      user: 'jack@gmail.com',
      pass: 'password'
    }
  },
  from: 'jack@gmail.com',
  to: 'rose@gmail.com',
  
  url: 'https://www.douban.com/group/gz020/',
  re: new RegExp('href="https:\/\/www\\.douban\\.com\/group\/topic\/(\\d*)\/" title="([^"]*珠江新城[^"]*)"', 'g'),
  
  interval: 60 * 1000
};
